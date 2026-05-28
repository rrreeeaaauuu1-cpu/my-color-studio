export default {
  async fetch(request) {
    const url = new URL(request.url);

    // 파라미터 가져오기 (언더바를 공백으로 변환)
    const getParam = (key, defaultValue) => {
      const val = url.searchParams.get(key) || defaultValue;
      return val.replace(/_/g, ' ');
    };
    const room     = getParam('room', '열람실 알 수 없음'); // 열람실: [현재 장소/에피소드 명]
    const turn     = getParam('turn', '0');                 // TRUN: 현재 턴 수
    const cgt      = getParam('cgt',  '0');                 // CGT 수치: [0~100]  (% 기호는 SVG에서 붙임)
    const attitude = getParam('att',  '평온');              // 나오코의 태도: [경계/집착/우울/평온]
    const progress = getParam('prog', '0');                 // 진행도: 열람한 책 [ ? ] 권

    // ── SVG 구성 ────────────────────────────────────────────────
    // 배경 ink.png 원본 해상도: 1024 × 512
    // 라벨(열람실:, TRUN, CGT 수치, 나오코의 태도, 진행도)은 이미지에 이미
    // 그려져 있으므로, 여기서는 값만 각 라벨 오른쪽 빈칸 위에 오버레이한다.
    //
    // 텍스트 위치 (이미지에서 추출한 하이라이트 박스 좌표)
    //   열람실 값       : x=285, y=106 (font 30px)  — 박스 y=70-118, x=273-621
    //   TRUN  값        : x=280, y=220 (font 26px)  — 박스 y=187-228, x=268-471
    //   CGT 수치 값     : x=324, y=282 (font 22px)  — 박스 y=255-289, x=316-483
    //   나오코의 태도 값: x=405, y=338 (font 22px)  — 박스 y=311-345, x=397-564
    //   진행도 값       : x=300, y=406 (font 22px)  — 박스 y=379-413, x=292-459
    // ────────────────────────────────────────────────────────────
    const svgCode = `
      <svg width="1024" height="512" viewBox="0 0 1024 512" xmlns="http://www.w3.org/2000/svg">
        <!-- 배경 이미지 -->
        <image href="https://project-episod.com/ink.png" x="0" y="0" width="1024" height="512" />

        <!-- 텍스트 공통 스타일: 따뜻한 크림색 + 검은 테두리(가독성) -->
        <style>
          .val { font-family: 'Noto Serif KR','Nanum Myeongjo',serif;
                 fill: #e8d9a8; font-weight: 600;
                 paint-order: stroke; stroke: #000; stroke-width: 3px; }
          .v1 { font-size: 30px; }
          .v2 { font-size: 26px; }
          .v3 { font-size: 22px; }
        </style>

        <!-- 열람실 (상단 배너) -->
        <text class="val v1" x="285" y="106">${room}</text>

        <!-- TRUN -->
        <text class="val v2" x="280" y="220">${turn}</text>

        <!-- CGT 수치 -->
        <text class="val v3" x="324" y="282">${cgt}%</text>

        <!-- 나오코의 태도 -->
        <text class="val v3" x="405" y="338">${attitude}</text>

        <!-- 진행도 -->
        <text class="val v3" x="300" y="406">열람한 책 [ ${progress} ] 권</text>
      </svg>
    `;

    return new Response(svgCode, {
      headers: {
        'Content-Type': 'image/svg+xml; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      },
    });
  },
};
