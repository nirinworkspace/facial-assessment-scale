/**
 * Facial Assessment Scale - Interactive Chart & Editable Table
 */

// Initial Data Model matching reference configuration
const DEFAULT_ASSESSMENT_DATA = [
  {
    id: 'rad',
    category: 'Skin quality',
    param: 'Loss of Radiance/Glow',
    score: 1, // 0: None, 1: Mild, 2: Moderate, 3: Severe
    notes: 'Subtle loss of natural luminosity and skin dullness',
    angleDeg: 67.5,
    sectorId: 'skin_quality'
  },
  {
    id: 'fir',
    category: 'Skin quality',
    param: 'Loss of firmness',
    score: 2,
    notes: 'Moderate skin laxity, delayed pinch recoil on malar cheek',
    angleDeg: 22.5,
    sectorId: 'skin_quality'
  },
  {
    id: 'sag',
    category: 'Facial shape',
    param: 'Sagging',
    score: 2,
    notes: 'Moderate lower-face jowling and indistinct jawline border',
    angleDeg: -22.5,
    sectorId: 'facial_shape'
  },
  {
    id: 'vol',
    category: 'Facial shape',
    param: 'Volume loss',
    score: 1,
    notes: 'Mild temporal depression and medial infraorbital fat loss',
    angleDeg: -67.5,
    sectorId: 'facial_shape'
  },
  {
    id: 'imb',
    category: 'Proportions',
    param: 'Imbalance',
    score: 1,
    notes: 'Mild vertical height shortening in lower third',
    angleDeg: -112.5,
    sectorId: 'proportions'
  },
  {
    id: 'asym',
    category: 'Symmetry',
    param: 'Asymmetry',
    score: 1,
    notes: 'Slight left-to-right eyebrow and commissure height variance',
    angleDeg: -157.5,
    sectorId: 'symmetry'
  },
  {
    id: 'stat',
    category: 'Expression',
    param: 'Static lines',
    score: 3,
    notes: 'Severe resting glabellar lines and etched nasolabial folds',
    angleDeg: 157.5,
    sectorId: 'expression'
  },
  {
    id: 'dyn',
    category: 'Expression',
    param: 'Dynamic lines',
    score: 1,
    notes: 'Mild periocular dynamic rhytids upon smiling',
    angleDeg: 112.5,
    sectorId: 'expression'
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

// Severity Labels
const SEVERITY_LEVELS = [
  { val: 0, label: 'None' },
  { val: 1, label: 'Mild' },
  { val: 2, label: 'Moderate' },
  { val: 3, label: 'Severe' }
];

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

// Category Styles matching Galderma paper aesthetic
const CATEGORY_STYLES = {
  'skin_quality': {
    sectorFill: '#7467ab',
    bannerFill: '#5b4f94',
    name: 'Skin quality'
  },
  'facial_shape': {
    sectorFill: '#7467ab',
    bannerFill: '#5b4f94',
    name: 'Facial shape'
  },
  'proportions': {
    sectorFill: '#978bc5',
    bannerFill: '#7c6fb5',
    name: 'Proportions'
  },
  'symmetry': {
    sectorFill: '#a397ce',
    bannerFill: '#897cbb',
    name: 'Symmetry'
  },
  'expression': {
    sectorFill: '#beb7dc',
    bannerFill: '#998ec4',
    name: 'Expression'
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
    bannerText.setAttribute('font-size', '13');
    bannerText.setAttribute('font-weight', '700');
    bannerText.setAttribute('letter-spacing', '0.04em');
    bannerText.setAttribute('dominant-baseline', 'central');

    const textPathElem = document.createElementNS('http://www.w3.org/2000/svg', 'textPath');
    textPathElem.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `#${pathId}`);
    textPathElem.setAttribute('href', `#${pathId}`);
    textPathElem.setAttribute('startOffset', '50%');
    textPathElem.setAttribute('text-anchor', 'middle');
    textPathElem.textContent = sec.style.name;

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

    // Parameter label along spoke line: perfectly centered between Level 2 (160) and Level 3 (215)
    const labelRad = (R_LEVEL_2 + R_LEVEL_3) / 2; // radius 187.5px
    const pLabel = polarToCartesian(CX, CY, labelRad, item.angleDeg);
    const labelText = document.createElementNS('http://www.w3.org/2000/svg', 'text');

    let rotDeg = -item.angleDeg;
    let anchor = 'middle';
    let offsetY = -12; // offset perpendicularly away from the spoke line

    if (item.angleDeg > 90 || item.angleDeg < -90) {
      rotDeg += 180;
      offsetY = 14;
    }

    labelText.setAttribute('x', pLabel.x.toFixed(1));
    labelText.setAttribute('y', pLabel.y.toFixed(1));
    labelText.setAttribute('transform', `rotate(${rotDeg}, ${pLabel.x.toFixed(1)}, ${pLabel.y.toFixed(1)}) translate(0, ${offsetY})`);
    labelText.setAttribute('fill', '#ffffff');
    labelText.setAttribute('font-size', '10.5');
    labelText.setAttribute('font-weight', '700');
    labelText.setAttribute('text-anchor', anchor);
    labelText.setAttribute('letter-spacing', '0.02em');
    labelText.setAttribute('stroke', '#352b57');
    labelText.setAttribute('stroke-width', '2.5');
    labelText.setAttribute('paint-order', 'stroke fill');
    labelText.setAttribute('pointer-events', 'none');
    labelText.textContent = item.param;
    spokesGroup.appendChild(labelText);
  });
  svg.appendChild(spokesGroup);

  // Group 6: Interactive Spoke Ring Nodes (0, 1, 2, 3)
  const nodesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  nodesGroup.setAttribute('id', 'chart-nodes');

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
        showTooltip(e, `<strong>${item.param}</strong>: Level ${level} (${SEVERITY_LEVELS[level].label})`);
      });
      hitArea.addEventListener('mouseleave', hideTooltip);

      nodesGroup.appendChild(nodeCircle);
      nodesGroup.appendChild(hitArea);
    });
  });
  svg.appendChild(nodesGroup);

  // Group 7: Comparison Baseline Polygon Overlay (Optional)
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

  // Group 8: Main Assessment Score Polygon & Dark Filled Points
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
      showTooltip(e, `<strong>${item.param}</strong>: Score ${item.score} (${SEVERITY_LEVELS[item.score].label})`);
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

  currentData.forEach(item => {
    const row = document.createElement('tr');
    row.setAttribute('data-id', item.id);

    let badgeClass = 'cat-skin';
    if (item.sectorId === 'facial_shape') badgeClass = 'cat-shape';
    else if (item.sectorId === 'proportions') badgeClass = 'cat-prop';
    else if (item.sectorId === 'symmetry') badgeClass = 'cat-symm';
    else if (item.sectorId === 'expression') badgeClass = 'cat-expr';

    row.innerHTML = `
      <td>
        <span class="cat-badge ${badgeClass}">${item.category}</span>
      </td>
      <td>
        <div class="param-name-cell">
          <span class="param-title">${item.param}</span>
          <span class="param-sub">${getParamSubtitle(item.id)}</span>
        </div>
      </td>
      <td>
        <div class="severity-pill-group" data-id="${item.id}">
          <button class="sev-btn ${item.score === 0 ? 'active' : ''}" data-val="0" title="0 - None">0 None</button>
          <button class="sev-btn ${item.score === 1 ? 'active' : ''}" data-val="1" title="1 - Mild">1 Mild</button>
          <button class="sev-btn ${item.score === 2 ? 'active' : ''}" data-val="2" title="2 - Moderate">2 Mod</button>
          <button class="sev-btn ${item.score === 3 ? 'active' : ''}" data-val="3" title="3 - Severe">3 Sev</button>
        </div>
      </td>
      <td>
        <input type="text" class="table-notes-input" value="${item.notes}" placeholder="Add observations..." data-id="${item.id}">
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
      item.notes = e.target.value;
    });

    tbody.appendChild(row);
  });

  updateSummaryMetrics();
}

function getParamSubtitle(id) {
  switch (id) {
    case 'rad': return 'Skin tone, glow & surface luminosity';
    case 'fir': return 'Dermal thickness, elasticity & pinch recoil';
    case 'sag': return 'Jowl descent & mandibular line definition';
    case 'vol': return 'Midface, malar & temporal fat pad atrophy';
    case 'imb': return 'Facial third proportions & profile balance';
    case 'asym': return 'Hemi-facial bilateral harmony & brow level';
    case 'stat': return 'Resting rhytids, folds & etched creases';
    case 'dyn': return 'Hyperkinetic lines during muscle contraction';
    default: return '';
  }
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
    let levelText = 'None';
    if (avgScore > 2.2) levelText = 'Severe';
    else if (avgScore > 1.5) levelText = 'Moderate–Sev';
    else if (avgScore > 0.8) levelText = 'Mild–Mod';
    else if (avgScore > 0.1) levelText = 'Minimal';
    avgEl.innerHTML = `${avgScore} <span class="stat-level">(${levelText})</span>`;
  }

  const maxItem = [...currentData].sort((a, b) => b.score - a.score)[0];
  const domEl = document.getElementById('stat-dominant');
  if (domEl && maxItem) {
    domEl.textContent = maxItem.score > 0 ? `${maxItem.param} (${maxItem.score})` : 'None (All normal)';
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
 * Global Toolbar Handlers
 */
function setupEventListeners() {

  const btnReset = document.getElementById('btn-reset');
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      currentData.forEach(d => d.score = 0);
      renderChart();
      renderTable();
    });
  }

  document.querySelectorAll('[data-set-all]').forEach(btn => {
    btn.addEventListener('click', () => {
      const val = parseInt(btn.getAttribute('data-set-all'), 10);
      currentData.forEach(d => d.score = val);
      renderChart();
      renderTable();
    });
  });

  const btnCompare = document.getElementById('toggle-comparison');
  if (btnCompare) {
    btnCompare.addEventListener('click', () => {
      showComparison = !showComparison;
      btnCompare.textContent = showComparison ? 'Hide Baseline' : '+ Compare Baseline';
      btnCompare.classList.toggle('btn-primary', showComparison);
      renderChart();
    });
  }

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

  const btnPrint = document.getElementById('btn-print');
  if (btnPrint) {
    btnPrint.addEventListener('click', () => {
      window.print();
    });
  }

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
      link.download = `Facial-Assessment-Scale-${Date.now()}.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

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
        link.download = `Facial-Assessment-Scale-${Date.now()}.png`;
        link.href = pngUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(blobURL);
      };
      image.src = blobURL;
    });
  }

  const btnExportJson = document.getElementById('btn-export-json');
  if (btnExportJson) {
    btnExportJson.addEventListener('click', () => {
      const payload = {
        title: 'Facial Assessment Scale',
        citation: 'Jain R, et al. J Cosmet Dermatol 2016;16(1):132-143',
        patient: document.getElementById('patient-name')?.value || '',
        date: document.getElementById('assessment-date')?.value || '',
        evaluator: document.getElementById('evaluator-name')?.value || '',
        stage: document.getElementById('session-stage')?.value || '',
        clinicalNotes: document.getElementById('overall-clinical-notes')?.value || '',
        data: currentData
      };

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(payload, null, 2));
      const link = document.createElement('a');
      link.setAttribute("href", dataStr);
      link.setAttribute("download", `Facial-Assessment-Data-${Date.now()}.json`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  const dateInput = document.getElementById('assessment-date');
  if (dateInput) {
    dateInput.value = new Date().toISOString().split('T')[0];
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderChart();
  renderTable();
  setupEventListeners();
});
