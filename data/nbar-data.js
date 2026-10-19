// 대시보드 오른쪽 상단에 표시되는 최신 업데이트 시간입니다.
window.NBAR_LAST_UPDATED = "2026.09.20 15:51";

// 반사도 모자이크 생성 완료 회차 수는 여기 숫자만 수정하면 됩니다.
// panelCompletedCycles: 패널 기반 처리 완료 회차 수
// elcCompletedCycles: ELC 기반 처리 완료 회차 수
// 완료 회차 이후의 회차는 예정으로 표시됩니다.
// 타프 미설치 관측의 ELC 기반 처리는 자동으로 대상 아님으로 표시됩니다.
window.NBAR_MOSAIC_CYCLE_PROGRESS = {
    default: {
        panelCompletedCycles: 0,
        elcCompletedCycles: 0
    },
    byDate: {
        // 특정 날짜만 다르게 설정하려면 아래처럼 추가합니다.
        // "2026.06.10": {
        //     panelCompletedCycles: 2,
        //     elcCompletedCycles: 1
        // }
    }
};

// 품질 검토 완료 회차 수는 여기 숫자만 수정하면 됩니다.
// 타프 미설치 관측의 ELC 기반 검토는 자동으로 대상 아님으로 표시됩니다.
window.NBAR_QUALITY_CYCLE_PROGRESS = {
    default: {
        panelCompletedCycles: 0,
        elcCompletedCycles: 0
    },
    byDate: {
        // "2026.06.10": {
        //     panelCompletedCycles: 1,
        //     elcCompletedCycles: 1
        // }
    }
};

// 설치 타프의 세부값은 여기에서 관리합니다.
// 기본 설치일은 PNU 3종 타프를 적용하고, 날짜별로 다른 구성이 있으면 byDate에 적습니다.
window.NBAR_TARP_DETAILS = {
    defaultInstalled: "PNU 3% / 36% / 56%",
    byDate: {
        "2026.06.10": "PNU 3% / 36% / 56%, NIAS 2.5% / 20% / 30% / 50%"
    }
};

window.NBAR_OBSERVATIONS = [
    {
        date: "2026.05.07",
        coverType: "농지",
        crop: "",
        site: "밀양 부속농장",
        purpose: "이앙 전 재배 준비",
        purposeDetail: "모내기 및 작물 재배 준비 단계",
        cycle: "3회",
        observationTime: "12:49~14:45",
        imageCount: 2104,
        title: "[농지] - 밀양 부속농장",
        agency: "부산대",
        html: "reports/2026-05-07_miryang_field.html",
        status: "전처리 진행 중",
        statusClass: "progress",
        processing: [
            ["자료 정리", "완료"],
            ["영상 처리", "진행 중"],
            ["품질 검토", "예정"],
            ["BRDF 분석", "예정"],
            ["보고서 작성", "예정"]
        ],
        schedule: [
            ["날짜", "2026.05.07", "이앙 전 재배 준비 관측"],
            ["관측 시간", "12:49~14:45", "전체 관측 시간"],
            ["관측 사이클", "3회", "관측 사이클 수"],
            ["반사도 타프", "미설치", "해당 관측일은 반사도 타프 미설치"],
            ["영상 개수", "분광밴드별 2104장", "밴드별 개별 영상 장수"]
        ]
    },
    {
        date: "2026.05.10",
        coverType: "농지",
        crop: "벼",
        site: "김해 농지",
        purpose: "이앙 전후",
        purposeDetail: "필지별 이앙 시기 차이에 따른 이앙 전·후 상태 혼재",
        cycle: "5회",
        observationTime: "10:50~13:30",
        imageCount: 5320,
        title: "[벼] - 김해 농지",
        agency: "부산대",
        html: "reports/2026-05-10_gimhae_rice.html",
        status: "전처리 진행 중",
        statusClass: "progress",
        processing: [
            ["자료 정리", "완료"],
            ["영상 처리", "진행 중"],
            ["품질 검토", "예정"],
            ["BRDF 분석", "예정"],
            ["보고서 작성", "예정"]
        ],
        schedule: [
            ["날짜", "2026.05.10", "이앙 전후 관측"],
            ["관측 시간", "10:50~13:30", "전체 관측 시간"],
            ["관측 사이클", "5회", "관측 사이클 수"],
            ["반사도 타프", "미설치", "해당 관측일은 반사도 타프 미설치"],
            ["영상 개수", "분광밴드별 5320장", "밴드별 개별 영상 장수"]
        ]
    },
    {
        date: "2026.06.30",
        coverType: "농지",
        crop: "벼",
        site: "김해 농지",
        purpose: "급성장기 - 초기",
        purposeDetail: "모내기 후 벼 군락이 빠르게 성장하는 시기",
        cycle: "4회",
        observationTime: "10:01~14:18",
        imageCount: 4580,
        title: "[벼] - 김해 농지",
        agency: "농과원 · 부산대",
        html: "reports/2026-06-30_gimhae_rice.html",
        status: "전처리 진행 중",
        statusClass: "progress",
        processing: [
            ["자료 정리", "완료"],
            ["영상 처리", "진행 중"],
            ["품질 검토", "예정"],
            ["BRDF 분석", "예정"],
            ["보고서 작성", "예정"]
        ],
        schedule: [
            ["날짜", "2026.06.30", "급성장기 - 초기 관측"],
            ["관측 시간", "10:01~14:18", "전체 관측 시간"],
            ["관측 사이클", "4회", "관측 사이클 수"],
            ["반사도 타프", "미설치", "해당 관측일은 반사도 타프 미설치"],
            ["영상 개수", "분광밴드별 4580장", "밴드별 개별 영상 장수"]
        ]
    },
    {
        date: "2026.07.16",
        coverType: "농지",
        crop: "벼",
        site: "김해 농지",
        purpose: "급성장기 - 중기",
        purposeDetail: "모내기 후 급성장기의 시간 변화 확인",
        cycle: "6회",
        observationTime: "10:00~15:28",
        imageCount: 6130,
        title: "[벼] - 김해 농지",
        agency: "부산대",
        html: "reports/2026-07-16_gimhae_rice.html",
        status: "전처리 진행 중",
        statusClass: "progress",
        processing: [
            ["자료 정리", "완료"],
            ["영상 처리", "진행 중"],
            ["품질 검토", "예정"],
            ["BRDF 분석", "예정"],
            ["보고서 작성", "예정"]
        ],
        schedule: [
            ["날짜", "2026.07.16", "급성장기 - 중기 관측"],
            ["관측 시간", "10:00~15:28", "전체 관측 시간"],
            ["관측 사이클", "6회", "관측 사이클 수"],
            ["반사도 타프", "3%, 36%, 56%", "PNU 3종 반사도 타프 설치"],
            ["영상 개수", "분광밴드별 6130장", "밴드별 개별 영상 장수"]
        ]
    },
    {
        date: "2026.07.31",
        coverType: "농지",
        crop: "벼",
        site: "김해 농지",
        purpose: "급성장기 - 후기",
        purposeDetail: "모내기 후 급성장기의 시간 변화 확인",
        cycle: "5회",
        observationTime: "09:55~14:42",
        imageCount: 5834,
        title: "[벼] - 김해 농지",
        agency: "농과원 · 부산대",
        html: "reports/2026-07-31_gimhae_rice.html",
        status: "전처리 진행 중",
        statusClass: "progress",
        processing: [
            ["자료 정리", "완료"],
            ["영상 처리", "진행 중"],
            ["품질 검토", "예정"],
            ["BRDF 분석", "예정"],
            ["보고서 작성", "예정"]
        ],
        schedule: [
            ["날짜", "2026.07.31", "급성장기 - 후기 관측"],
            ["관측 시간", "09:55~14:42", "전체 관측 시간"],
            ["관측 사이클", "5회", "관측 사이클 수"],
            ["반사도 타프", "3%, 36%, 56%", "PNU 3종 반사도 타프 설치"],
            ["영상 개수", "분광밴드별 5834장", "밴드별 개별 영상 장수"]
        ]
    },
    {
        date: "2026.05.15",
        coverType: "밭",
        crop: "양배추",
        site: "김해 밭",
        purpose: "수확 직전",
        purposeDetail: "양배추 수확 직전 시기",
        cycle: "6회",
        observationTime: "09:30~15:20",
        imageCount: 4233,
        title: "[양배추] - 김해 밭",
        agency: "부산대",
        html: "reports/2026-05-15_gimhae_cabbage.html",
        status: "전처리 진행 중",
        statusClass: "progress",
        processing: [
            ["자료 정리", "완료"],
            ["영상 처리", "진행 중"],
            ["품질 검토", "예정"],
            ["BRDF 분석", "예정"],
            ["보고서 작성", "예정"]
        ],
        schedule: [
            ["날짜", "2026.05.15", "수확 직전 관측"],
            ["관측 시간", "09:30~15:20", "전체 관측 시간"],
            ["관측 사이클", "6회", "관측 사이클 수"],
            ["반사도 타프", "미설치", "해당 관측일은 반사도 타프 미설치"],
            ["영상 개수", "분광밴드별 4233장", "밴드별 개별 영상 장수"]
        ]
    },
    {
        date: "2026.06.10",
        coverType: "나지",
        crop: "",
        site: "농업위성센터",
        purpose: "경운 후 나지",
        purposeDetail: "작물 재배를 위한 트랙터 작업 후 나지",
        cycle: "6회",
        observationTime: "09:55~15:12",
        imageCount: 7679,
        title: "[나지] - 농업위성센터",
        agency: "농과원 · 부산대",
        html: "reports/2026-06-10_field_result_report.html",
        status: "보고서 작성 중",
        statusClass: "progress",
        processing: [
            ["자료 정리", "완료"],
            ["영상 처리", "진행 중"],
            ["품질 검토", "예정"],
            ["BRDF 분석", "예정"],
            ["보고서 작성", "진행 중"]
        ],
        schedule: [
            ["날짜", "2026.06.10", "경운 후 나지 관측"],
            ["관측 시간", "09:55~15:12", "전체 관측 시간"],
            ["관측 사이클", "6회", "관측 사이클 수"],
            ["반사도 타프", "3%, 36%, 56%", "PNU 3종 및 NIAS 4종 반사도 타프 설치"],
            ["영상 개수", "분광밴드별 7679장", "밴드별 개별 영상 장수"]
        ]
    },
    {
        date: "2026.06.12",
        coverType: "경사지",
        crop: "",
        site: "금정산 북문",
        purpose: "하계 산림",
        purposeDetail: "침엽수와 활엽수를 포함하는 여름철 경사지",
        cycle: "3회",
        observationTime: "10:50~14:58",
        imageCount: 9128,
        title: "[경사지] - 금정산 북문",
        agency: "부산대",
        html: "reports/2026-06-12_geumjeongsan_slope.html",
        status: "전처리 진행 중",
        statusClass: "progress",
        processing: [
            ["자료 정리", "완료"],
            ["영상 처리", "진행 중"],
            ["품질 검토", "예정"],
            ["BRDF 분석", "예정"],
            ["보고서 작성", "예정"]
        ],
        schedule: [
            ["날짜", "2026.06.12", "하계 산림 관측"],
            ["관측 시간", "10:50~14:58", "전체 관측 시간"],
            ["관측 사이클", "3회", "관측 사이클 수"],
            ["반사도 타프", "3%, 36%, 56%", "PNU 3종 반사도 타프 설치"],
            ["영상 개수", "분광밴드별 9128장", "밴드별 개별 영상 장수"]
        ]
    }
];
