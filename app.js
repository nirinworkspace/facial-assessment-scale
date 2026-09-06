/**
 * Facial Assessment Scale - Interactive Chart & Editable Table
 * Bilingual Edition: English (EN) & Thai (TH)
 */

// Language State
let currentLanguage = localStorage.getItem('facial_scale_lang') || 'th';

// Initial Data Model matching reference clinical configuration
const DEFAULT_ASSESSMENT_DATA = [
  {
    id: 'rad',
    category: 'Skin quality',
    sectorId: 'skin_quality',
    score: 0, // 0: None, 1: Mild, 2: Moderate, 3: Severe
    angleDeg: 67.5,
    notes: {
      en: '',
      th: ''
    }
  },
  {
    id: 'fir',
    category: 'Skin quality',
    sectorId: 'skin_quality',
    score: 0,
    angleDeg: 22.5,
    notes: {
      en: '',
      th: ''
    }
  },
  {
    id: 'sag',
    category: 'Facial shape',
    sectorId: 'facial_shape',
    score: 0,
    angleDeg: -22.5,
    notes: {
      en: '',
      th: ''
    }
  },
  {
    id: 'vol',
    category: 'Facial shape',
    sectorId: 'facial_shape',
    score: 0,
    angleDeg: -67.5,
    notes: {
      en: '',
      th: ''
    }
  },
  {
    id: 'imb',
    category: 'Proportions',
    sectorId: 'proportions',
    score: 0,
    angleDeg: -112.5,
    notes: {
      en: '',
      th: ''
    }
  },
  {
    id: 'asym',
    category: 'Symmetry',
    sectorId: 'symmetry',
    score: 0,
    angleDeg: -157.5,
    notes: {
      en: '',
      th: ''
    }
  },
  {
    id: 'stat',
    category: 'Expression',
    sectorId: 'expression',
    score: 0,
    angleDeg: 157.5,
    notes: {
      en: '',
      th: ''
    }
  },
  {
    id: 'dyn',
    category: 'Expression',
    sectorId: 'expression',
    score: 0,
    angleDeg: 112.5,
    notes: {
      en: '',
      th: ''
    }
  }
];

let showComparison = false;
let currentData = JSON.parse(JSON.stringify(DEFAULT_ASSESSMENT_DATA));

// Baseline Comparison Data (e.g. Pre-Treatment Baseline)
const baselineComparisonData = [
  { id: 'rad', score: 2 },
  { id: 'fir', score: 3 },
  { id: 'sag', score: 3 },
  { id: 'vol', score: 2 },
  { id: 'imb', score: 2 },
  { id: 'asym', score: 1 },
  { id: 'stat', score: 3 },
  { id: 'dyn', score: 2 }
];

// Bilingual Dictionary
const TRANSLATIONS = {
  en: {
    pageTitle: 'Facial Assessment Scale - Interactive Clinical Evaluation Tool',
    brandBadge: 'Aesthetic Dermatology',
    mainTitle: 'Facial Assessment Scale',
    btnReset: 'Reset',
    btnExport: 'Export / Print',
    exportPng: 'Export Chart as PNG (High-Res)',
    exportSvg: 'Export Chart as SVG',
    printReport: 'Print Clinical Report (PDF)',
    exportTableA5: 'Print Assessment Parameters & Scoring (A5 Paper)',
    exportJson: 'Download Assessment Data (JSON)',
    a5DocSubtitle: 'Clinical Assessment Parameters & Scoring Scale',
    a5ScoreSummary: 'Score Breakdown',
    a5Signature: 'Clinician Signature',
    a5DateSigned: 'Date',
    labelPatientName: 'Patient Name / ID',
    placeholderPatientName: 'Enter patient name or ID',
    labelAssessmentDate: 'Assessment Date',
    labelEvaluatorName: 'Evaluating Clinician',
    placeholderEvaluator: 'Doctor or evaluator',
    labelSessionStage: 'Evaluation Stage',
    stageBaseline: 'Baseline (Pre-Treatment)',
    stage1m: '2-Week Follow-up',
    stage3m: '1-Month Follow-up',
    stage6m: '2-Month Follow-up',
    stageMaint: 'Maintenance',
    statTotalLabel: 'Total Severity Score',
    statAvgLabel: 'Average Severity',
    statDominantLabel: 'Dominant Concern',
    dominantNone: 'None (All normal)',
    chartTitle: 'Circular Polar Assessment Scale',
    chartHint: 'Click any ring node (0–3) on the spokes to interactively set scores',
    btnCompare: '+ Compare Baseline',
    btnHideCompare: 'Hide Baseline',
    sev0: '<strong>0</strong> none',
    sev1: '<strong>1</strong> mild',
    sev2: '<strong>2</strong> moderate',
    sev3: '<strong>3</strong> severe',
    legendCaption: 'SEVERITY EVALUATION SCALE',
    tableTitle: 'Assessment Parameters & Scoring',
    tableHint: 'Edit parameters, toggle severity levels, or add clinical observations',
    thCategory: 'Category',
    thParameter: 'Parameter',
    thSeverity: 'Severity Level (0–3)',
    thNotes: 'Clinical Notes',
    catSkinQuality: 'Skin quality',
    catFacialShape: 'Facial shape',
    catProportionsSymmetry: 'Proportions & Symmetry',
    catExpression: 'Expression',
    notesLabel: 'Comprehensive Treatment Recommendation & Notes',
    notesPlaceholder: 'Enter planned aesthetic intervention (e.g. neuromodulator injection for dynamic lines, hyaluronic acid filler for volume loss, bio-remodeling for skin radiance)...',
    defaultRecommendation: '',
    footerCitation: 'Clinical Reference: Jain R, Huang P, Ferraz RM, et al. A new facial assessment scale for clinical practice and research. <em>J Cosmet Dermatol</em>. 2016;16(1):132-143.',
    footerDisclaimer: 'Standardized Aesthetic Severity Scale • All data stored locally in browser session',
    severityLevels: [
      { val: 0, pill: '0 None', label: 'None' },
      { val: 1, pill: '1 Mild', label: 'Mild' },
      { val: 2, pill: '2 Mod', label: 'Moderate' },
      { val: 3, pill: '3 Sev', label: 'Severe' }
    ],
    severityStatusText: {
      minimal: 'Minimal',
      mildMod: 'Mild–Mod',
      modSev: 'Moderate–Sev',
      severe: 'Severe',
      none: 'None'
    },
    categories: {
      skin_quality: 'Skin quality',
      facial_shape: 'Facial shape',
      proportions: 'Proportions',
      symmetry: 'Symmetry',
      expression: 'Expression'
    },
    parameters: {
      rad: {
        title: 'Loss of Radiance/Glow',
        chartLabel: 'Loss of Radiance',
        sub: 'Skin tone, glow & surface luminosity'
      },
      fir: {
        title: 'Loss of firmness',
        chartLabel: 'Loss of firmness',
        sub: 'Dermal thickness, elasticity & pinch recoil'
      },
      sag: {
        title: 'Sagging',
        chartLabel: 'Sagging',
        sub: 'Jowl descent & mandibular line definition'
      },
      vol: {
        title: 'Volume loss',
        chartLabel: 'Volume loss',
        sub: 'Midface, malar & temporal fat pad atrophy'
      },
      imb: {
        title: 'Imbalance',
        chartLabel: 'Imbalance',
        sub: 'Facial third proportions & profile balance'
      },
      asym: {
        title: 'Asymmetry',
        chartLabel: 'Asymmetry',
        sub: 'Hemi-facial bilateral harmony & brow level'
      },
      stat: {
        title: 'Static lines',
        chartLabel: 'Static lines',
        sub: 'Resting rhytids, folds & etched creases'
      },
      dyn: {
        title: 'Dynamic lines',
        chartLabel: 'Dynamic lines',
        sub: 'Hyperkinetic lines during muscle contraction'
      }
    }
  },
  th: {
    pageTitle: 'แบบประเมินโครงสร้างและสภาพใบหน้า',
    brandBadge: 'เวชศาสตร์ความงามและผิวพรรณ',
    mainTitle: 'แบบประเมินโครงสร้างใบหน้า',
    btnReset: 'รีเซ็ต',
    btnExport: 'ส่งออก / พิมพ์',
    exportPng: 'ส่งออกแผนภูมิเป็นรูป PNG (ความละเอียดสูง)',
    exportSvg: 'ส่งออกแผนภูมิเป็นเวกเตอร์ SVG',
    printReport: 'พิมพ์รายงานทางคลินิก (PDF)',
    exportTableA5: 'พิมพ์ตารางประเมินและเกณฑ์คะแนน (กระดาษ A5)',
    exportJson: 'ดาวน์โหลดข้อมูลการประเมิน (JSON)',
    a5DocSubtitle: 'แบบประเมินพารามิเตอร์และเกณฑ์คะแนนทางคลินิก (A5)',
    a5ScoreSummary: 'สรุปคะแนนรายหมวด',
    a5Signature: 'ลายมือชื่อแพทย์ผู้ประเมิน',
    a5DateSigned: 'วันที่',
    labelPatientName: 'ชื่อผู้รับบริการ / รหัสคนไข้',
    placeholderPatientName: 'ระบุชื่อหรือรหัสคนไข้',
    labelAssessmentDate: 'วันที่ทำการประเมิน',
    labelEvaluatorName: 'แพทย์หรือผู้ประเมิน',
    placeholderEvaluator: 'ระบุชื่อแพทย์ผู้ประเมิน',
    labelSessionStage: 'ระยะของการประเมิน',
    stageBaseline: 'ก่อนการรักษา',
    stage1m: 'ติดตามผล 2 สัปดาห์',
    stage3m: 'ติดตามผล 1 เดือน',
    stage6m: 'ติดตามผล 2 เดือน',
    stageMaint: 'การดูแลต่อเนื่อง',
    statTotalLabel: 'คะแนนความรุนแรงรวม',
    statAvgLabel: 'ระดับความรุนแรงเฉลี่ย',
    statDominantLabel: 'จุดที่กังวลเด่นชัด',
    dominantNone: 'ไม่มี (อยู่ในเกณฑ์ปกติทุกจุด)',
    chartTitle: 'แผนภูมิประเมินใบหน้ารูปวงกลม',
    chartHint: 'คลิกที่จุดวงแหวน (0–3) บนแกนแต่ละด้านเพื่อปรับคะแนนประเมินได้ทันที',
    btnCompare: '+ เปรียบเทียบค่าเริ่มต้น',
    btnHideCompare: 'ซ่อนเส้นเปรียบเทียบ',
    sev0: '<strong>0</strong> ไม่มี',
    sev1: '<strong>1</strong> เล็กน้อย',
    sev2: '<strong>2</strong> ปานกลาง',
    sev3: '<strong>3</strong> รุนแรงมาก',
    legendCaption: 'เกณฑ์การประเมินระดับความรุนแรง (0–3)',
    tableTitle: 'ตารางประเมินพารามิเตอร์และบันทึกอาการ',
    tableHint: 'เลือกระดับความรุนแรง หรือบันทึกข้อสังเกตเพิ่มเติมสำหรับแต่ละบริเวณ',
    thCategory: 'หมวดหมู่',
    thParameter: 'พารามิเตอร์',
    thSeverity: 'ระดับความรุนแรง (0–3)',
    thNotes: 'บันทึกข้อสังเกตทางคลินิก',
    catSkinQuality: 'คุณภาพผิว',
    catFacialShape: 'รูปหน้า',
    catProportionsSymmetry: 'สัดส่วนและความสมมาตร',
    catExpression: 'ริ้วรอยและการแสดงสีหน้า',
    notesLabel: 'ข้อเสนอแนะและแผนการรักษาทางคลินิกแบบองค์รวม',
    notesPlaceholder: 'ระบุแผนการรักษาทางความงาม (เช่น ฉีดสารคลายกล้ามเนื้อสำหรับริ้วรอยแสดงอารมณ์, เติมสารไฮยาลูโรนิกสำหรับวอลลุ่มที่ยุบตัว, ปรับสภาพผิวด้วย Skin Booster)...',
    defaultRecommendation: '',
    footerCitation: 'เอกสารอ้างอิงทางคลินิก: Jain R, Huang P, Ferraz RM, et al. A new facial assessment scale for clinical practice and research. <em>J Cosmet Dermatol</em>. 2016;16(1):132-143.',
    footerDisclaimer: 'เกณฑ์การประเมินมาตรฐานทางการแพทย์ • ข้อมูลทั้งหมดถูกจัดเก็บบนอุปกรณ์ของคุณ',
    severityLevels: [
      { val: 0, pill: '0 ไม่มี', label: 'ไม่มี (None)' },
      { val: 1, pill: '1 น้อย', label: 'เล็กน้อย (Mild)' },
      { val: 2, pill: '2 กลาง', label: 'ปานกลาง (Moderate)' },
      { val: 3, pill: '3 มาก', label: 'รุนแรงมาก (Severe)' }
    ],
    severityStatusText: {
      minimal: 'เล็กน้อยมาก',
      mildMod: 'น้อย–ปานกลาง',
      modSev: 'ปานกลาง–มาก',
      severe: 'รุนแรงมาก',
      none: 'ปกติ'
    },
    categories: {
      skin_quality: 'คุณภาพผิว',
      facial_shape: 'รูปหน้า',
      proportions: 'สัดส่วน',
      symmetry: 'ความสมมาตร',
      expression: 'การแสดงสีหน้า'
    },
    parameters: {
      rad: {
        title: 'ความเปล่งปลั่งลดลง',
        chartLabel: 'ความเปล่งปลั่งลดลง',
        sub: 'ความกระจ่างใส ความสม่ำเสมอของสีผิว'
      },
      fir: {
        title: 'ความกระชับลดลง',
        chartLabel: 'ความกระชับลดลง',
        sub: 'ความหนาแน่นและความยืดหยุ่นของชั้นผิว'
      },
      sag: {
        title: 'ความหย่อนคล้อย',
        chartLabel: 'ความหย่อนคล้อย',
        sub: 'แนวกรามและความหย่อนคล้อยของกระพุ้งแก้ม'
      },
      vol: {
        title: 'การสูญเสียปริมาตร',
        chartLabel: 'การสูญเสียปริมาตร',
        sub: 'การยุบตัวของไขมันบริเวณขมับ แก้ม และใต้ตา'
      },
      imb: {
        title: 'ความไม่ได้สัดส่วน',
        chartLabel: 'ไม่ได้สัดส่วน',
        sub: 'สัดส่วนใบหน้า 3 ส่วนและความสมดุลด้านข้าง'
      },
      asym: {
        title: 'ความไม่สมมาตร',
        chartLabel: 'ไม่สมมาตร',
        sub: 'ความสมดุลซ้าย-ขวา ระดับคิ้ว และมุมปาก'
      },
      stat: {
        title: 'ริ้วรอยขณะพัก',
        chartLabel: 'ริ้วรอยขณะพัก',
        sub: 'รอยย่น ร่องแก้ม และรอยพับลึกที่เห็นชัดขณะหน้านิ่ง'
      },
      dyn: {
        title: 'ริ้วรอยแสดงอารมณ์',
        chartLabel: 'ริ้วรอยแสดงสีหน้า',
        sub: 'ริ้วรอยหางตา หน้าผาก เมื่อยิ้มหรือขยับกล้ามเนื้อ'
      }
    }
  }
};

/**
 * Localization Helpers
 */
function t(key) {
  const dict = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
  return dict[key] || TRANSLATIONS.en[key] || key;
}

function getParamTitle(id) {
  const dict = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
  return dict.parameters[id]?.title || TRANSLATIONS.en.parameters[id]?.title || id;
}

function getParamChartLabel(id) {
  const dict = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
  return dict.parameters[id]?.chartLabel || TRANSLATIONS.en.parameters[id]?.chartLabel || id;
}

function getParamSubtitle(id) {
  const dict = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
  return dict.parameters[id]?.sub || TRANSLATIONS.en.parameters[id]?.sub || '';
}

function getCategoryName(secId) {
  const dict = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
  return dict.categories[secId] || TRANSLATIONS.en.categories[secId] || secId;
}

function getSeverityLevels() {
  const dict = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
  return dict.severityLevels || TRANSLATIONS.en.severityLevels;
}

// Geometry Constants for 740x740 SVG Canvas
const CX = 370;
const CY = 370;
const R_INNER = 50;       // Center circle (0 level)
const R_LEVEL_1 = 105;    // Level 1 (Mild)
const R_LEVEL_2 = 160;    // Level 2 (Moderate)
const R_LEVEL_3 = 215;    // Level 3 (Severe)
const R_SPOKE_END = 232;  // Outer spoke arrow end
const R_BANNER_IN = 240;  // Outer category arc inner
const R_BANNER_OUT = 274; // Outer category arc outer

// Category Styles matching clinical paper aesthetic
const CATEGORY_STYLES = {
  'skin_quality': {
    sectorFill: '#7467ab',
    bannerFill: '#5b4f94'
  },
  'facial_shape': {
    sectorFill: '#7467ab',
    bannerFill: '#5b4f94'
  },
  'proportions': {
    sectorFill: '#978bc5',
    bannerFill: '#7c6fb5'
  },
  'symmetry': {
    sectorFill: '#a397ce',
    bannerFill: '#897cbb'
  },
  'expression': {
    sectorFill: '#beb7dc',
    bannerFill: '#998ec4'
  }
};

/**
 * Polar to Cartesian Coordinate Math (SVG screen coordinates)
 */
function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy - r * Math.sin(rad)
  };
}

function getRadiusForScore(score) {
  switch (score) {
    case 0: return R_INNER;
    case 1: return R_LEVEL_1;
    case 2: return R_LEVEL_2;
    case 3: return R_LEVEL_3;
    default: return R_INNER + (score / 3) * (R_LEVEL_3 - R_INNER);
  }
}

/**
 * Construct SVG circular sector path
 */
function describeArcSector(cx, cy, rIn, rOut, startAngleDeg, endAngleDeg) {
  const p1 = polarToCartesian(cx, cy, rOut, startAngleDeg);
  const p2 = polarToCartesian(cx, cy, rOut, endAngleDeg);
  const p3 = polarToCartesian(cx, cy, rIn, endAngleDeg);
  const p4 = polarToCartesian(cx, cy, rIn, startAngleDeg);

  return [
    `M ${p1.x.toFixed(2)} ${p1.y.toFixed(2)}`,
    `A ${rOut} ${rOut} 0 0 1 ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`,
    `L ${p3.x.toFixed(2)} ${p3.y.toFixed(2)}`,
    `A ${rIn} ${rIn} 0 0 0 ${p4.x.toFixed(2)} ${p4.y.toFixed(2)}`,
    'Z'
  ].join(' ');
}

/**
 * Construct an arc path for text along curved category banner
 */
function describeBannerTextPath(cx, cy, r, startAngleDeg, endAngleDeg, isBottom) {
  if (isBottom) {
    const p1 = polarToCartesian(cx, cy, r, endAngleDeg);
    const p2 = polarToCartesian(cx, cy, r, startAngleDeg);
    return `M ${p1.x.toFixed(2)} ${p1.y.toFixed(2)} A ${r} ${r} 0 0 0 ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  } else {
    const p1 = polarToCartesian(cx, cy, r, startAngleDeg);
    const p2 = polarToCartesian(cx, cy, r, endAngleDeg);
    return `M ${p1.x.toFixed(2)} ${p1.y.toFixed(2)} A ${r} ${r} 0 0 1 ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }
}

/**
 * Render Polar Assessment Scale SVG Chart
 */
function renderChart() {
  const svg = document.getElementById('facial-scale-svg');
  if (!svg) return;

  svg.innerHTML = '';

  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  defs.innerHTML = `
    <filter id="node-shadow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="1.5" stdDeviation="2" flood-color="#140d2d" flood-opacity="0.25"/>
    </filter>
  `;
  svg.appendChild(defs);

  // Group 1: Full Circular Background Sectors & Category Banners (360 degrees)
  const sectorGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  sectorGroup.setAttribute('id', 'chart-sectors');

  const sectors = [
    {
      id: 'skin_quality',
      start: 90, end: 0,
      rIn: R_INNER, rOut: R_BANNER_IN,
      style: CATEGORY_STYLES['skin_quality'],
      isBottom: false
    },
    {
      id: 'facial_shape',
      start: 0, end: -90,
      rIn: R_INNER, rOut: R_BANNER_IN,
      style: CATEGORY_STYLES['facial_shape'],
      isBottom: true
    },
    {
      id: 'proportions',
      start: -90, end: -135,
      rIn: R_INNER, rOut: R_BANNER_IN,
      style: CATEGORY_STYLES['proportions'],
      isBottom: true
    },
    {
      id: 'symmetry',
      start: -135, end: -180,
      rIn: R_INNER, rOut: R_BANNER_IN,
      style: CATEGORY_STYLES['symmetry'],
      isBottom: true
    },
    {
      id: 'expression',
      start: 180, end: 90,
      rIn: R_INNER, rOut: R_BANNER_IN,
      style: CATEGORY_STYLES['expression'],
      isBottom: false
    }
  ];

  sectors.forEach((sec, idx) => {
    // 1. Sector wedge fill
    const secPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    secPath.setAttribute('d', describeArcSector(CX, CY, sec.rIn, sec.rOut, sec.start, sec.end));
    secPath.setAttribute('fill', sec.style.sectorFill);
    secPath.setAttribute('stroke', '#ffffff');
    secPath.setAttribute('stroke-width', '1.5');
    sectorGroup.appendChild(secPath);

    // 2. Outer category arc banner
    const bannerPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    bannerPath.setAttribute('d', describeArcSector(CX, CY, R_BANNER_IN, R_BANNER_OUT, sec.start, sec.end));
    bannerPath.setAttribute('fill', sec.style.bannerFill);
    bannerPath.setAttribute('stroke', '#ffffff');
    bannerPath.setAttribute('stroke-width', '1.5');
    sectorGroup.appendChild(bannerPath);

    // 3. Curved text on banner
    const pathId = `banner-path-${idx}`;
    const textPathArc = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const midR = (R_BANNER_IN + R_BANNER_OUT) / 2;
    textPathArc.setAttribute('id', pathId);
    textPathArc.setAttribute('d', describeBannerTextPath(CX, CY, midR, sec.start, sec.end, sec.isBottom));
    textPathArc.setAttribute('fill', 'none');
    textPathArc.setAttribute('stroke', 'none');
    defs.appendChild(textPathArc);

    const bannerText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    bannerText.setAttribute('fill', '#ffffff');
    bannerText.setAttribute('font-size', currentLanguage === 'th' ? '12.5' : '13');
    bannerText.setAttribute('font-weight', '700');
    bannerText.setAttribute('letter-spacing', '0.04em');
    bannerText.setAttribute('dominant-baseline', 'central');

    const textPathElem = document.createElementNS('http://www.w3.org/2000/svg', 'textPath');
    textPathElem.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `#${pathId}`);
    textPathElem.setAttribute('href', `#${pathId}`);
    textPathElem.setAttribute('startOffset', '50%');
    textPathElem.setAttribute('text-anchor', 'middle');
    textPathElem.textContent = getCategoryName(sec.id);

    bannerText.appendChild(textPathElem);
    sectorGroup.appendChild(bannerText);
  });

  svg.appendChild(sectorGroup);

  // Group 2: Concentric White Dotted Grid Rings
  const gridGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  gridGroup.setAttribute('id', 'chart-grid');

  [R_LEVEL_1, R_LEVEL_2, R_LEVEL_3].forEach((radius) => {
    const ring = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    ring.setAttribute('cx', CX);
    ring.setAttribute('cy', CY);
    ring.setAttribute('r', radius);
    ring.setAttribute('fill', 'none');
    ring.setAttribute('stroke', '#ffffff');
    ring.setAttribute('stroke-width', '1.6');
    ring.setAttribute('stroke-dasharray', '3.5 3.5');
    ring.setAttribute('opacity', '0.75');
    gridGroup.appendChild(ring);
  });
  svg.appendChild(gridGroup);

  // Group 3: Center White Hub (0 point)
  const centerHub = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  centerHub.setAttribute('cx', CX);
  centerHub.setAttribute('cy', CY);
  centerHub.setAttribute('r', R_INNER);
  centerHub.setAttribute('fill', '#ffffff');
  centerHub.setAttribute('stroke', '#ebe6f6');
  centerHub.setAttribute('stroke-width', '2');
  svg.appendChild(centerHub);

  // Group 4: Parameter Spokes, Arrowheads, and Spoke Labels
  const spokesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  spokesGroup.setAttribute('id', 'chart-spokes');

  currentData.forEach(item => {
    const pInner = polarToCartesian(CX, CY, R_INNER, item.angleDeg);
    const pEnd = polarToCartesian(CX, CY, R_SPOKE_END, item.angleDeg);

    // Spoke line
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', pInner.x.toFixed(1));
    line.setAttribute('y1', pInner.y.toFixed(1));
    line.setAttribute('x2', pEnd.x.toFixed(1));
    line.setAttribute('y2', pEnd.y.toFixed(1));
    line.setAttribute('stroke', '#ffffff');
    line.setAttribute('stroke-width', '1.8');
    line.setAttribute('opacity', '0.9');
    spokesGroup.appendChild(line);

    // Arrowhead at outer rim
    const arrowTip = polarToCartesian(CX, CY, R_SPOKE_END + 5, item.angleDeg);
    const rad = (item.angleDeg * Math.PI) / 180;
    const perpRad = rad + Math.PI / 2;
    const wingLen = 4.5;
    const arrowBack = 8.5;
    const pBase = {
      x: arrowTip.x - arrowBack * Math.cos(rad),
      y: arrowTip.y + arrowBack * Math.sin(rad)
    };
    const w1 = {
      x: pBase.x + wingLen * Math.cos(perpRad),
      y: pBase.y - wingLen * Math.sin(perpRad)
    };
    const w2 = {
      x: pBase.x - wingLen * Math.cos(perpRad),
      y: pBase.y + wingLen * Math.sin(perpRad)
    };

    const arrowPoly = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    arrowPoly.setAttribute('points', `${arrowTip.x.toFixed(1)},${arrowTip.y.toFixed(1)} ${w1.x.toFixed(1)},${w1.y.toFixed(1)} ${w2.x.toFixed(1)},${w2.y.toFixed(1)}`);
    arrowPoly.setAttribute('fill', '#ffffff');
    spokesGroup.appendChild(arrowPoly);

    // Parameter label along spoke line
    const labelRad = (R_LEVEL_2 + R_LEVEL_3) / 2;
    const pLabel = polarToCartesian(CX, CY, labelRad, item.angleDeg);
    const labelText = document.createElementNS('http://www.w3.org/2000/svg', 'text');

    let rotDeg = -item.angleDeg;
    let anchor = 'middle';
    let offsetY = -12;

    if (item.angleDeg > 90 || item.angleDeg < -90) {
      rotDeg += 180;
      offsetY = 14;
    }

    labelText.setAttribute('x', pLabel.x.toFixed(1));
    labelText.setAttribute('y', pLabel.y.toFixed(1));
    labelText.setAttribute('transform', `rotate(${rotDeg}, ${pLabel.x.toFixed(1)}, ${pLabel.y.toFixed(1)}) translate(0, ${offsetY})`);
    labelText.setAttribute('fill', '#ffffff');
    labelText.setAttribute('font-size', currentLanguage === 'th' ? '10' : '10.5');
    labelText.setAttribute('font-weight', '700');
    labelText.setAttribute('text-anchor', anchor);
    labelText.setAttribute('letter-spacing', '0.02em');
    labelText.setAttribute('stroke', '#352b57');
    labelText.setAttribute('stroke-width', '2.5');
    labelText.setAttribute('paint-order', 'stroke fill');
    labelText.setAttribute('pointer-events', 'none');
    labelText.textContent = getParamChartLabel(item.id);
    spokesGroup.appendChild(labelText);
  });
  svg.appendChild(spokesGroup);

  // Group 5: Interactive Spoke Ring Nodes (0, 1, 2, 3)
  const nodesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  nodesGroup.setAttribute('id', 'chart-nodes');

  const sevLevels = getSeverityLevels();

  currentData.forEach(item => {
    [0, 1, 2, 3].forEach(level => {
      const radius = getRadiusForScore(level);
      const pos = polarToCartesian(CX, CY, radius, item.angleDeg);

      // Large hit area for easy clicking
      const hitArea = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      hitArea.setAttribute('cx', pos.x.toFixed(1));
      hitArea.setAttribute('cy', pos.y.toFixed(1));
      hitArea.setAttribute('r', '15');
      hitArea.setAttribute('fill', 'transparent');
      hitArea.setAttribute('cursor', 'pointer');

      // Visual Node circle
      const nodeCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      nodeCircle.setAttribute('cx', pos.x.toFixed(1));
      nodeCircle.setAttribute('cy', pos.y.toFixed(1));
      nodeCircle.setAttribute('r', '5.5');
      nodeCircle.setAttribute('fill', '#ffffff');
      nodeCircle.setAttribute('stroke', '#6b5da5');
      nodeCircle.setAttribute('stroke-width', '1.3');
      nodeCircle.setAttribute('class', 'svg-spoke-node');
      nodeCircle.setAttribute('cursor', 'pointer');

      const clickHandler = () => {
        updateItemScore(item.id, level);
      };

      hitArea.addEventListener('click', clickHandler);
      nodeCircle.addEventListener('click', clickHandler);

      hitArea.addEventListener('mouseenter', (e) => {
        const paramName = getParamTitle(item.id);
        const lvlLabel = sevLevels[level]?.label || level;
        showTooltip(e, `<strong>${paramName}</strong>: Level ${level} (${lvlLabel})`);
      });
      hitArea.addEventListener('mouseleave', hideTooltip);

      nodesGroup.appendChild(nodeCircle);
      nodesGroup.appendChild(hitArea);
    });
  });
  svg.appendChild(nodesGroup);

  // Group 6: Comparison Baseline Polygon Overlay (Optional)
  if (showComparison) {
    const compGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    compGroup.setAttribute('id', 'chart-comparison-overlay');

    const compPts = baselineComparisonData.map(c => {
      const item = currentData.find(d => d.id === c.id);
      const r = getRadiusForScore(c.score);
      return polarToCartesian(CX, CY, r, item ? item.angleDeg : 0);
    });

    const compPoly = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    compPoly.setAttribute('points', compPts.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' '));
    compPoly.setAttribute('fill', 'rgba(215, 60, 60, 0.12)');
    compPoly.setAttribute('stroke', '#d32f2f');
    compPoly.setAttribute('stroke-width', '2.2');
    compPoly.setAttribute('stroke-dasharray', '5 3.5');
    compGroup.appendChild(compPoly);

    compPts.forEach(p => {
      const cDot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      cDot.setAttribute('cx', p.x.toFixed(1));
      cDot.setAttribute('cy', p.y.toFixed(1));
      cDot.setAttribute('r', '4');
      cDot.setAttribute('fill', '#d32f2f');
      cDot.setAttribute('stroke', '#ffffff');
      cDot.setAttribute('stroke-width', '1.5');
      compGroup.appendChild(cDot);
    });

    svg.appendChild(compGroup);
  }

  // Group 7: Main Assessment Score Polygon & Dark Filled Points
  const polygonGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  polygonGroup.setAttribute('id', 'chart-assessment-polygon');

  const activePoints = currentData.map(item => {
    const r = getRadiusForScore(item.score);
    return polarToCartesian(CX, CY, r, item.angleDeg);
  });

  // Solid dark polygon line connecting evaluated scores
  const polygonLine = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
  polygonLine.setAttribute('points', activePoints.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' '));
  polygonLine.setAttribute('fill', 'rgba(17, 13, 36, 0.08)');
  polygonLine.setAttribute('stroke', '#110d24');
  polygonLine.setAttribute('stroke-width', '2.8');
  polygonLine.setAttribute('stroke-linejoin', 'round');
  polygonGroup.appendChild(polygonLine);

  // Solid black dots matching reference image
  activePoints.forEach((pt, index) => {
    const item = currentData[index];
    const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    dot.setAttribute('cx', pt.x.toFixed(1));
    dot.setAttribute('cy', pt.y.toFixed(1));
    dot.setAttribute('r', '6.8');
    dot.setAttribute('fill', '#110d24');
    dot.setAttribute('stroke', '#ffffff');
    dot.setAttribute('stroke-width', '2');
    dot.setAttribute('filter', 'url(#node-shadow)');
    dot.setAttribute('class', 'svg-data-point');
    dot.setAttribute('cursor', 'pointer');

    dot.addEventListener('mouseenter', (e) => {
      const paramName = getParamTitle(item.id);
      const lvlLabel = sevLevels[item.score]?.label || item.score;
      showTooltip(e, `<strong>${paramName}</strong>: Score ${item.score} (${lvlLabel})`);
    });
    dot.addEventListener('mouseleave', hideTooltip);

    polygonGroup.appendChild(dot);
  });

  svg.appendChild(polygonGroup);
}

/**
 * Render the Editable Assessment Table
 */
function renderTable() {
  const tbody = document.getElementById('table-body');
  if (!tbody) return;

  tbody.innerHTML = '';
  const sevLevels = getSeverityLevels();

  currentData.forEach(item => {
    const row = document.createElement('tr');
    row.setAttribute('data-id', item.id);

    let badgeClass = 'cat-skin';
    if (item.sectorId === 'facial_shape') badgeClass = 'cat-shape';
    else if (item.sectorId === 'proportions') badgeClass = 'cat-prop';
    else if (item.sectorId === 'symmetry') badgeClass = 'cat-symm';
    else if (item.sectorId === 'expression') badgeClass = 'cat-expr';

    const categoryText = getCategoryName(item.sectorId);
    const paramTitle = getParamTitle(item.id);
    const paramSub = getParamSubtitle(item.id);

    // Get note text in current language or user custom string
    let currentNote = '';
    if (typeof item.notes === 'object') {
      currentNote = item.notes[currentLanguage] || item.notes.en || '';
    } else {
      currentNote = item.notes || '';
    }

    let pillsHtml = '';
    sevLevels.forEach(lvl => {
      const isActive = item.score === lvl.val ? 'active' : '';
      pillsHtml += `<button class="sev-btn ${isActive}" data-val="${lvl.val}" title="${lvl.val} - ${lvl.label}">${lvl.pill}</button>`;
    });

    row.innerHTML = `
      <td>
        <span class="cat-badge ${badgeClass}">${categoryText}</span>
      </td>
      <td>
        <div class="param-name-cell">
          <span class="param-title">${paramTitle}</span>
          <span class="param-sub">${paramSub}</span>
        </div>
      </td>
      <td>
        <div class="severity-pill-group" data-id="${item.id}">
          ${pillsHtml}
        </div>
      </td>
      <td>
        <input type="text" class="table-notes-input" value="${currentNote}" placeholder="${currentLanguage === 'th' ? 'เพิ่มข้อสังเกต...' : 'Add observations...'}" data-id="${item.id}">
      </td>
    `;

    const pillButtons = row.querySelectorAll('.sev-btn');
    pillButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const val = parseInt(e.currentTarget.getAttribute('data-val'), 10);
        updateItemScore(item.id, val);
      });
    });

    const notesInput = row.querySelector('.table-notes-input');
    notesInput.addEventListener('input', (e) => {
      if (typeof item.notes !== 'object') {
        item.notes = {};
      }
      item.notes[currentLanguage] = e.target.value;
    });

    tbody.appendChild(row);
  });

  updateSummaryMetrics();
}

/**
 * Update Score for a single parameter
 */
function updateItemScore(id, newScore) {
  const item = currentData.find(d => d.id === id);
  if (!item) return;

  item.score = Math.max(0, Math.min(3, newScore));

  renderChart();

  const pillGroup = document.querySelector(`.severity-pill-group[data-id="${id}"]`);
  if (pillGroup) {
    pillGroup.querySelectorAll('.sev-btn').forEach(btn => {
      const val = parseInt(btn.getAttribute('data-val'), 10);
      if (val === item.score) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  updateSummaryMetrics();
}

/**
 * Update Summary Statistics and Quadrant Breakdown
 */
function updateSummaryMetrics() {
  const totalScore = currentData.reduce((acc, item) => acc + item.score, 0);
  const avgScore = (totalScore / currentData.length).toFixed(2);

  const totalEl = document.getElementById('stat-total-score');
  if (totalEl) {
    totalEl.innerHTML = `${totalScore} <span class="stat-max">/ 24</span>`;
  }

  const avgEl = document.getElementById('stat-avg-score');
  if (avgEl) {
    const dict = TRANSLATIONS[currentLanguage]?.severityStatusText || TRANSLATIONS.en.severityStatusText;
    let levelText = dict.none;
    if (avgScore > 2.2) levelText = dict.severe;
    else if (avgScore > 1.5) levelText = dict.modSev;
    else if (avgScore > 0.8) levelText = dict.mildMod;
    else if (avgScore > 0.1) levelText = dict.minimal;
    avgEl.innerHTML = `${avgScore} <span class="stat-level">(${levelText})</span>`;
  }

  const maxItem = [...currentData].sort((a, b) => b.score - a.score)[0];
  const domEl = document.getElementById('stat-dominant');
  if (domEl && maxItem) {
    if (maxItem.score > 0) {
      const name = getParamTitle(maxItem.id);
      domEl.textContent = `${name} (${maxItem.score})`;
    } else {
      domEl.textContent = t('dominantNone');
    }
  }

  const skinScore = currentData.filter(d => d.sectorId === 'skin_quality').reduce((a, b) => a + b.score, 0);
  const shapeScore = currentData.filter(d => d.sectorId === 'facial_shape').reduce((a, b) => a + b.score, 0);
  const propSymmScore = currentData.filter(d => d.sectorId === 'proportions' || d.sectorId === 'symmetry').reduce((a, b) => a + b.score, 0);
  const exprScore = currentData.filter(d => d.sectorId === 'expression').reduce((a, b) => a + b.score, 0);

  const skinEl = document.getElementById('score-skin-quality');
  if (skinEl) skinEl.textContent = `${skinScore} / 6`;

  const shapeEl = document.getElementById('score-facial-shape');
  if (shapeEl) shapeEl.textContent = `${shapeScore} / 6`;

  const propEl = document.getElementById('score-proportions');
  if (propEl) propEl.textContent = `${propSymmScore} / 6`;

  const exprEl = document.getElementById('score-expression');
  if (exprEl) exprEl.textContent = `${exprScore} / 6`;
}

/**
 * Tooltip Helper
 */
let tooltipEl = null;

function showTooltip(event, contentHtml) {
  if (!tooltipEl) {
    tooltipEl = document.createElement('div');
    tooltipEl.className = 'chart-tooltip';
    document.body.appendChild(tooltipEl);
  }

  tooltipEl.innerHTML = contentHtml;
  tooltipEl.style.display = 'block';
  tooltipEl.style.left = `${event.pageX}px`;
  tooltipEl.style.top = `${event.pageY}px`;
  tooltipEl.style.opacity = '1';
}

function hideTooltip() {
  if (tooltipEl) {
    tooltipEl.style.opacity = '0';
    tooltipEl.style.display = 'none';
  }
}

/**
 * Apply Selected Language to all UI Elements
 */
function setLanguage(lang) {
  if (!TRANSLATIONS[lang]) return;
  currentLanguage = lang;
  localStorage.setItem('facial_scale_lang', lang);

  // Update HTML tag
  document.documentElement.lang = lang;
  document.title = t('pageTitle');

  // Update active state in switcher buttons
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
  });

  // Update elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (key && TRANSLATIONS[lang][key]) {
      el.innerHTML = TRANSLATIONS[lang][key];
    }
  });

  // Update placeholders
  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const key = el.getAttribute('data-i18n-ph');
    if (key && TRANSLATIONS[lang][key]) {
      el.placeholder = TRANSLATIONS[lang][key];
    }
  });

  // Update comparison toggle button text
  const btnCompare = document.getElementById('toggle-comparison');
  if (btnCompare) {
    const textSpan = btnCompare.querySelector('[data-i18n]') || btnCompare;
    textSpan.textContent = showComparison ? t('btnHideCompare') : t('btnCompare');
  }

  // Update recommendation notes if currently default
  const notesTextarea = document.getElementById('overall-clinical-notes');
  if (notesTextarea) {
    const otherLang = lang === 'th' ? 'en' : 'th';
    if (notesTextarea.value.trim() === TRANSLATIONS[otherLang].defaultRecommendation.trim()) {
      notesTextarea.value = TRANSLATIONS[lang].defaultRecommendation;
    }
  }

  // Re-render chart and table with localized strings
  renderChart();
  renderTable();
}

/**
 * Helper to escape HTML characters
 */
function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Generate High-Resolution Single-Page A5 Assessment Sheet HTML
 */
function generateA5SheetHtml() {
  const patientName = escapeHtml(document.getElementById('patient-name')?.value || '—');
  const assessmentDate = escapeHtml(document.getElementById('assessment-date')?.value || '—');
  const evaluatorName = escapeHtml(document.getElementById('evaluator-name')?.value || '—');
  const stageEl = document.getElementById('session-stage');
  const sessionStage = escapeHtml(stageEl ? (stageEl.options[stageEl.selectedIndex]?.text || stageEl.value) : '—');
  const clinicalNotes = escapeHtml(document.getElementById('overall-clinical-notes')?.value || '');

  const totalScore = currentData.reduce((acc, item) => acc + item.score, 0);
  const avgScore = (totalScore / currentData.length).toFixed(2);
  const sevLevels = getSeverityLevels();

  const skinScore = currentData.filter(d => d.sectorId === 'skin_quality').reduce((a, b) => a + b.score, 0);
  const shapeScore = currentData.filter(d => d.sectorId === 'facial_shape').reduce((a, b) => a + b.score, 0);
  const propScore = currentData.filter(d => d.sectorId === 'proportions' || d.sectorId === 'symmetry').reduce((a, b) => a + b.score, 0);
  const exprScore = currentData.filter(d => d.sectorId === 'expression').reduce((a, b) => a + b.score, 0);

  const dict = TRANSLATIONS[currentLanguage]?.severityStatusText || TRANSLATIONS.en.severityStatusText;
  let levelText = dict.none;
  if (avgScore > 2.2) levelText = dict.severe;
  else if (avgScore > 1.5) levelText = dict.modSev;
  else if (avgScore > 0.8) levelText = dict.mildMod;
  else if (avgScore > 0.1) levelText = dict.minimal;

  const rowsHtml = currentData.map(item => {
    let catBadgeColor = '#7467ab';
    if (item.sectorId === 'proportions' || item.sectorId === 'symmetry') catBadgeColor = '#978bc5';
    else if (item.sectorId === 'expression') catBadgeColor = '#a8a0cf';

    const categoryText = escapeHtml(getCategoryName(item.sectorId));
    const paramTitle = escapeHtml(getParamTitle(item.id));
    const paramSub = escapeHtml(getParamSubtitle(item.id));

    let note = '';
    if (typeof item.notes === 'object') {
      note = item.notes[currentLanguage] || item.notes.en || '';
    } else {
      note = item.notes || '';
    }
    const safeNote = escapeHtml(note);

    let pillsHtml = '';
    sevLevels.forEach(lvl => {
      const isSelected = item.score === lvl.val;
      pillsHtml += `<span class="sev-tag ${isSelected ? 'selected' : ''}">${lvl.val}</span>`;
    });

    const activeLevel = sevLevels[item.score] || { label: '' };

    return `
      <tr>
        <td class="col-cat">
          <span class="cat-pill" style="background:${catBadgeColor};">${categoryText}</span>
        </td>
        <td class="col-param">
          <div class="param-name">${paramTitle}</div>
          <div class="param-sub">${paramSub}</div>
        </td>
        <td class="col-score">
          <div class="score-pills-wrap">
            ${pillsHtml}
          </div>
          <span class="score-label score-lvl-${item.score}">${activeLevel.label}</span>
        </td>
        <td class="col-notes">
          <div class="note-text">${safeNote || '<span class="empty-note">—</span>'}</div>
        </td>
      </tr>
    `;
  }).join('');

  return `
  <div class="a5-sheet">
    <!-- Header -->
    <header class="sheet-header">
      <div class="brand-left">
        <div class="brand-logo-icon">FA</div>
        <div class="brand-text">
          <h1>${escapeHtml(t('mainTitle'))}</h1>
          <div class="sub-title">${escapeHtml(t('tableTitle'))} &bull; ${escapeHtml(t('brandBadge'))}</div>
        </div>
      </div>
      <div class="meta-right">
        <span class="badge-stage">${sessionStage}</span>
      </div>
    </header>

    <!-- Patient Meta Grid -->
    <div class="patient-meta-grid">
      <div class="meta-item">
        <span class="meta-label">${escapeHtml(t('labelPatientName'))}</span>
        <span class="meta-val">${patientName}</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">${escapeHtml(t('labelAssessmentDate'))}</span>
        <span class="meta-val">${assessmentDate}</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">${escapeHtml(t('labelEvaluatorName'))}</span>
        <span class="meta-val">${evaluatorName}</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">${escapeHtml(t('statTotalLabel'))}</span>
        <span class="meta-val"><span class="total-badge-inline">${totalScore} / 24</span> (${levelText})</span>
      </div>
    </div>

    <!-- Table -->
    <div class="table-wrap">
      <table class="a5-table">
        <thead>
          <tr>
            <th class="col-cat">${escapeHtml(t('thCategory'))}</th>
            <th class="col-param">${escapeHtml(t('thParameter'))}</th>
            <th class="col-score">${escapeHtml(t('thSeverity'))}</th>
            <th class="col-notes">${escapeHtml(t('thNotes'))}</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
    </div>

    <!-- Category Breakdown Cards -->
    <div class="summary-grid-a5">
      <div class="cat-summary-box" style="border-top-color: #7467ab;">
        <div class="csb-name">${escapeHtml(t('catSkinQuality'))}</div>
        <div class="csb-score">${skinScore} / 6</div>
      </div>
      <div class="cat-summary-box" style="border-top-color: #7467ab;">
        <div class="csb-name">${escapeHtml(t('catFacialShape'))}</div>
        <div class="csb-score">${shapeScore} / 6</div>
      </div>
      <div class="cat-summary-box" style="border-top-color: #978bc5;">
        <div class="csb-name">${escapeHtml(t('catProportionsSymmetry'))}</div>
        <div class="csb-score">${propScore} / 6</div>
      </div>
      <div class="cat-summary-box" style="border-top-color: #a8a0cf;">
        <div class="csb-name">${escapeHtml(t('catExpression'))}</div>
        <div class="csb-score">${exprScore} / 6</div>
      </div>
    </div>

    <!-- Clinical Recommendation Box -->
    <div class="notes-box-a5">
      <div class="nb-label">${escapeHtml(t('notesLabel'))}</div>
      <div class="nb-content">${clinicalNotes || '—'}</div>
    </div>

    <!-- Sign-off & Citation -->
    <div class="sign-row-a5">
      <div class="citation-left">
        <strong>${escapeHtml(t('pageTitle'))}</strong><br>
        Jain R, Huang P, Ferraz RM, et al. <em>J Cosmet Dermatol</em>. 2016;16(1):132-143.
      </div>
      <div class="sig-right">
        <div class="sig-line"></div>
        <div class="sig-label">${escapeHtml(t('a5Signature'))} / ${escapeHtml(t('a5DateSigned'))}</div>
      </div>
    </div>
  </div>`;
}

/**
 * Print / Export Assessment Parameters & Scoring Scale on A5 Paper (Chrome & Universal Cross-Browser)
 */
function exportAssessmentTableA5() {
  let container = document.getElementById('a5-print-section');
  if (!container) {
    container = document.createElement('div');
    container.id = 'a5-print-section';
    container.className = 'a5-print-section';
    document.body.appendChild(container);
  }

  // Populate dynamic A5 sheet content
  container.innerHTML = generateA5SheetHtml();

  // Inject temporary @page rule for A5 portrait
  let pageStyle = document.getElementById('a5-page-style');
  if (!pageStyle) {
    pageStyle = document.createElement('style');
    pageStyle.id = 'a5-page-style';
    pageStyle.textContent = `@page { size: A5 portrait; margin: 5mm 6mm 5mm 6mm; }`;
    document.head.appendChild(pageStyle);
  }

  // Set print mode class on body
  document.body.classList.add('print-mode-a5');

  // Cleanup handler
  let cleanedUp = false;
  const cleanup = () => {
    if (cleanedUp) return;
    cleanedUp = true;
    document.body.classList.remove('print-mode-a5');
    const ps = document.getElementById('a5-page-style');
    if (ps) ps.remove();
    window.removeEventListener('afterprint', cleanup);
  };

  window.addEventListener('afterprint', cleanup);

  // Small delay to ensure browser DOM reflow before calling native print
  setTimeout(() => {
    try {
      window.print();
    } finally {
      // Safety cleanup after dialog closes or in case afterprint is not supported
      setTimeout(cleanup, 1200);
    }
  }, 80);
}

/**
 * Global Toolbar & App Handlers
 */
function setupEventListeners() {
  // Language Switcher Buttons
  const btnEn = document.getElementById('lang-btn-en');
  const btnTh = document.getElementById('lang-btn-th');

  if (btnEn) {
    btnEn.addEventListener('click', () => setLanguage('en'));
  }
  if (btnTh) {
    btnTh.addEventListener('click', () => setLanguage('th'));
  }

  // Reset Button
  const btnReset = document.getElementById('btn-reset');
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      currentData.forEach(d => {
        d.score = 0;
        if (typeof d.notes === 'object') {
          d.notes.en = '';
          d.notes.th = '';
        } else {
          d.notes = '';
        }
      });
      const notesArea = document.getElementById('overall-clinical-notes');
      if (notesArea) notesArea.value = '';
      renderChart();
      renderTable();
    });
  }

  // Comparison Toggle
  const btnCompare = document.getElementById('toggle-comparison');
  if (btnCompare) {
    btnCompare.addEventListener('click', () => {
      showComparison = !showComparison;
      const textSpan = btnCompare.querySelector('[data-i18n]') || btnCompare;
      textSpan.textContent = showComparison ? t('btnHideCompare') : t('btnCompare');
      btnCompare.classList.toggle('btn-primary', showComparison);
      renderChart();
    });
  }

  // Export Dropdown
  const exportBtn = document.getElementById('btn-export-dropdown');
  const exportMenu = document.getElementById('export-menu');
  if (exportBtn && exportMenu) {
    exportBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      exportMenu.classList.toggle('show');
    });

    document.addEventListener('click', () => {
      exportMenu.classList.remove('show');
    });
  }

  // Print Report
  const btnPrint = document.getElementById('btn-print');
  if (btnPrint) {
    btnPrint.addEventListener('click', () => {
      window.print();
    });
  }

  // Export SVG
  const btnExportSvg = document.getElementById('btn-export-svg');
  if (btnExportSvg) {
    btnExportSvg.addEventListener('click', () => {
      const svg = document.getElementById('facial-scale-svg');
      const serializer = new XMLSerializer();
      let source = serializer.serializeToString(svg);

      if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
        source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
      }

      const url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Facial-Assessment-Scale-${currentLanguage}-${Date.now()}.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  // Export PNG
  const btnExportPng = document.getElementById('btn-export-png');
  if (btnExportPng) {
    btnExportPng.addEventListener('click', () => {
      const svg = document.getElementById('facial-scale-svg');
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svg);
      const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
      const URL = window.URL || window.webkitURL || window;
      const blobURL = URL.createObjectURL(svgBlob);

      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = 1480;
        canvas.height = 1480;
        const context = canvas.getContext("2d");
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, 0, canvas.width, canvas.height);

        const pngUrl = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.download = `Facial-Assessment-Scale-${currentLanguage}-${Date.now()}.png`;
        link.href = pngUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(blobURL);
      };
      image.src = blobURL;
    });
  }

  // Export Assessment Parameters & Scoring Scale (A5 Paper)
  const btnExportA5 = document.getElementById('btn-export-a5') || document.getElementById('btn-export-json');
  if (btnExportA5) {
    btnExportA5.addEventListener('click', exportAssessmentTableA5);
  }

  // Date input auto-fill today
  const dateInput = document.getElementById('assessment-date');
  if (dateInput) {
    dateInput.value = new Date().toISOString().split('T')[0];
  }
}

document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  setLanguage(currentLanguage);
});
