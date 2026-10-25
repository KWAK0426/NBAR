"""Check static local HTML links without third-party dependencies."""

import argparse
import json
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit


class PageLinks(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.links = []
        self.ids = set()

    def handle_starttag(self, tag, attrs):
        attributes = dict(attrs)
        if attributes.get("id"):
            self.ids.add(attributes["id"])
        if tag == "a" and attributes.get("name"):
            self.ids.add(attributes["name"])
        for name in ("href", "src", "poster"):
            if attributes.get(name):
                self.links.append((name, attributes[name]))

    handle_startendtag = handle_starttag


def inspect_site(site):
    pages = {}
    for file in sorted(site.rglob("*.html")):
        parser = PageLinks()
        parser.feed(file.read_text(encoding="utf-8-sig"))
        pages[file.resolve()] = parser

    problems = []
    external = set()
    checked = 0
    skipped_templates = 0
    for source, parsed in pages.items():
        for attribute, raw in parsed.links:
            if "${" in raw or "{{" in raw:
                skipped_templates += 1
                continue
            url = urlsplit(raw)
            if url.scheme in ("http", "https") or url.netloc:
                external.add(raw)
                continue
            if url.scheme in ("data", "mailto", "tel", "javascript", "blob"):
                continue
            if url.scheme:
                problems.append({"page": source.relative_to(site).as_posix(),
                                 "url": raw, "reason": "non-portable scheme"})
                continue
            target = (site / unquote(url.path.lstrip("/")) if url.path.startswith("/")
                      else source.parent / unquote(url.path)) if url.path else source
            target = target.resolve()
            if target.is_dir():
                target /= "index.html"
            checked += 1
            reason = None
            if not target.is_relative_to(site):
                reason = "path leaves site directory"
            elif not target.exists():
                reason = "missing file"
            elif url.fragment and target in pages:
                if unquote(url.fragment) not in pages[target].ids:
                    reason = "missing HTML anchor"
            if reason:
                problems.append({"page": source.relative_to(site).as_posix(),
                                 "url": raw, "reason": reason})
    return {
        "html_pages": len(pages),
        "checked_static_references": checked,
        "problems": problems,
        "external_urls_not_fetched": sorted(external),
        "skipped_template_references": skipped_templates,
        "scope": "Static HTML attributes only; JavaScript-generated links and CSS URLs are not checked.",
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--site", type=Path, default=Path(__file__).resolve().parent.parent / "site")
    parser.add_argument("--json", type=Path, help="Optional output report path")
    args = parser.parse_args()
    site = args.site.resolve()
    if not (site / "index.html").is_file():
        parser.error("site/index.html was not found")
    report = inspect_site(site)
    output = json.dumps(report, ensure_ascii=False, indent=2)
    if args.json:
        args.json.write_text(output + "\n", encoding="utf-8")
    print(output)
    return bool(report["problems"])


if __name__ == "__main__":
    raise SystemExit(main())
