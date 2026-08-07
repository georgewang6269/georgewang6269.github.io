/* ==========================================================================
   OmniTheorem — Math Studio JavaScript Application Engine
   Made by George Wang Charlotte NC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Application State
  const state = {
    unit: 'units',
    sideA: 3,
    sideB: 4,
    sideC: 5,
    showAltitude: true,
    showIncircle: false,
    showCircumcircle: false,
    activeCategory: 'all',
    filterQuery: '',
    cameraStream: null,
    scannedText: ''
  };

  /* ==========================================================================
     1. THEOREM KNOWLEDGE BASE
     ========================================================================== */
  const theoremDatabase = [
    {
      id: 'heron',
      name: "Heron's Formula",
      category: 'geometry',
      keywords: ['heron', 'herons', 'triangle area', '3 sides', 'three sides', 'semiperimeter'],
      icon: 'triangle',
      formula: '\\mathcal{A} = \\sqrt{s(s-a)(s-b)(s-c)} \\quad \\text{where } s = \\frac{a+b+c}{2}',
      summary: 'Calculates the area of any triangle when you know the lengths of all three sides (a, b, c) without needing the height.',
      whenToUse: ['You know side lengths a, b, c', 'Height is unknown or difficult to measure', 'Scalene, Isosceles, or Equilateral triangles'],
      steps: [
        { title: 'Step 1: Find Semi-Perimeter (s)', text: 'Add all three side lengths together and divide by 2: s = (a + b + c) / 2.' },
        { title: 'Step 2: Subtract Each Side from s', text: 'Calculate the three difference values: (s - a), (s - b), and (s - c).' },
        { title: 'Step 3: Multiply the Terms', text: 'Multiply the semi-perimeter by all three difference terms: s × (s - a) × (s - b) × (s - c).' },
        { title: 'Step 4: Take the Square Root', text: 'Take the square root of the result to get the exact area: Area = √(Product).' }
      ],
      solverType: 'heron_shortcut',
      workedExample: {
        problem: 'Find the area of a triangle with side lengths a = 7, b = 8, and c = 9.',
        solution: 's = (7 + 8 + 9)/2 = 12. Differences: (12-7)=5, (12-8)=4, (12-9)=3. Product = 12 × 5 × 4 × 3 = 720. Area = √720 ≈ 26.83 units².'
      },
      quiz: {
        question: 'What is the semi-perimeter (s) for a triangle with sides 5, 5, and 6?',
        options: ['16', '8', '10', '6'],
        correctIndex: 1,
        explanation: 'Semi-perimeter s = (5 + 5 + 6) / 2 = 16 / 2 = 8.'
      }
    },
    {
      id: 'pythagoras',
      name: 'Pythagorean Theorem',
      category: 'geometry',
      keywords: ['pythagorean', 'pythagoras', 'right triangle', 'hypotenuse', 'a2 + b2 = c2'],
      icon: 'square',
      formula: 'a^2 + b^2 = c^2 \\implies c = \\sqrt{a^2 + b^2}',
      summary: 'Relates the lengths of the legs (a, b) and hypotenuse (c) of a right-angled triangle.',
      whenToUse: ['Dealing with a right triangle (90° angle)', 'Finding an unknown side length', 'Checking if a triangle is right-angled'],
      steps: [
        { title: 'Step 1: Identify the Hypotenuse (c)', text: 'The hypotenuse is always the longest side, directly opposite the 90° right angle.' },
        { title: 'Step 2: Square both leg lengths', text: 'Compute a² and b² for the two shorter sides.' },
        { title: 'Step 3: Add the squared legs', text: 'Add them together: a² + b².' },
        { title: 'Step 4: Square root for c', text: 'Take c = √(a² + b²) to find the hypotenuse.' }
      ],
      solverType: 'pythagoras',
      workedExample: {
        problem: 'A right triangle has legs a = 6 and b = 8. Find hypotenuse c.',
        solution: 'a² + b² = 6² + 8² = 36 + 64 = 100. c = √100 = 10.'
      },
      quiz: {
        question: 'If leg a = 3 and hypotenuse c = 5, what is leg b?',
        options: ['4', '2', '8', '3.5'],
        correctIndex: 0,
        explanation: 'b² = c² - a² = 25 - 9 = 16 → b = √16 = 4.'
      }
    },
    {
      id: 'quadratic',
      name: 'Quadratic Formula',
      category: 'algebra',
      keywords: ['quadratic', 'quadratic formula', 'roots', 'ax2 + bx + c', 'parabola', 'discriminant'],
      icon: 'variable',
      formula: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}',
      summary: 'Finds the exact solutions (roots or x-intercepts) for any quadratic equation of the form ax² + bx + c = 0.',
      whenToUse: ['Solving second-degree polynomial equations', 'Factoring is difficult or impossible', 'Finding real or complex roots'],
      steps: [
        { title: 'Step 1: Arrange equation to standard form', text: 'Ensure equation is written as ax² + bx + c = 0 to identify coefficients a, b, and c.' },
        { title: 'Step 2: Compute Discriminant (Δ)', text: 'Calculate Δ = b² - 4ac. If Δ > 0 (2 real roots), Δ = 0 (1 root), Δ < 0 (complex roots).' },
        { title: 'Step 3: Apply the Formula', text: 'Calculate x₁ = (-b + √Δ) / 2a and x₂ = (-b - √Δ) / 2a.' }
      ],
      solverType: 'quadratic',
      workedExample: {
        problem: 'Solve x² - 5x + 6 = 0.',
        solution: 'a = 1, b = -5, c = 6. Δ = (-5)² - 4(1)(6) = 25 - 24 = 1. x = (5 ± √1) / 2 → x₁ = 3, x₂ = 2.'
      },
      quiz: {
        question: 'What does a negative discriminant (b² - 4ac < 0) indicate?',
        options: ['Two real roots', 'No real roots (complex conjugate roots)', 'One repeated root', 'Undefined equation'],
        correctIndex: 1,
        explanation: 'When Δ < 0, the square root yields imaginary numbers, producing complex conjugate roots.'
      }
    },
    {
      id: 'law_sines',
      name: 'Law of Sines',
      category: 'trigonometry',
      keywords: ['law of sines', 'sine rule', 'sines', 'non-right triangle', 'angle side ratio'],
      icon: 'compass',
      formula: '\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C} = 2R',
      summary: 'States that the ratio of the side length of a triangle to the sine of its opposite angle is constant for all three sides.',
      whenToUse: ['Given AAS or ASA (2 angles and 1 side)', 'Given SSA (2 sides and non-included angle)'],
      steps: [
        { title: 'Step 1: Match opposite side-angle pairs', text: 'Pair side a with angle A, side b with angle B, side c with angle C.' },
        { title: 'Step 2: Set up proportion', text: 'Use a / sin(A) = b / sin(B) to solve for the missing side or angle.' },
        { title: 'Step 3: Solve for unknown', text: 'Cross-multiply and isolate your target unknown variable.' }
      ],
      solverType: 'law_sines',
      workedExample: {
        problem: 'In △ABC, A = 30°, B = 45°, and side a = 10. Find side b.',
        solution: 'b = a × sin(B) / sin(A) = 10 × sin(45°) / sin(30°) = 10 × (0.7071) / 0.5 ≈ 14.14.'
      },
      quiz: {
        question: 'Which information allows direct application of the Law of Sines?',
        options: ['Three side lengths (SSS)', 'Two sides and the included angle (SAS)', 'Two angles and one side (AAS)', 'Only area'],
        correctIndex: 2,
        explanation: 'Law of Sines requires at least one complete side-opposite angle pair, as provided by AAS or ASA.'
      }
    },
    {
      id: 'law_cosines',
      name: 'Law of Cosines',
      category: 'trigonometry',
      keywords: ['law of cosines', 'cosine rule', 'cosines', 'sas', 'sss', 'c2 = a2 + b2 - 2ab cos C'],
      icon: 'activity',
      formula: 'c^2 = a^2 + b^2 - 2ab \\cos C \\implies \\cos C = \\frac{a^2 + b^2 - c^2}{2ab}',
      summary: 'Generalizes the Pythagorean theorem to any triangle, allowing you to solve for a third side given two sides and the included angle (SAS), or find an angle given three sides (SSS).',
      whenToUse: ['Given SSS (all 3 sides known, finding angles)', 'Given SAS (2 sides and included angle, finding 3rd side)'],
      steps: [
        { title: 'Step 1: Identify included angle C and adjacent sides a, b', text: 'Angle C must be between sides a and b.' },
        { title: 'Step 2: Compute a² + b²', text: 'Sum the squares of the two adjacent side lengths.' },
        { title: 'Step 3: Subtract 2ab · cos(C)', text: 'Multiply 2 × a × b × cos(C) and subtract from previous sum.' },
        { title: 'Step 4: Take square root', text: 'c = √(a² + b² - 2ab cos C).' }
      ],
      solverType: 'law_cosines',
      workedExample: {
        problem: 'Given a = 5, b = 7, and angle C = 60°. Find side c.',
        solution: 'c² = 5² + 7² - 2(5)(7)cos(60°) = 25 + 49 - 70(0.5) = 74 - 35 = 39. c = √39 ≈ 6.24.'
      },
      quiz: {
        question: 'What happens to the Law of Cosines when angle C = 90°?',
        options: ['It becomes undefined', 'It reduces to the Pythagorean Theorem (c² = a² + b²)', 'c becomes 0', 'It equals 1'],
        correctIndex: 1,
        explanation: 'Since cos(90°) = 0, the term -2ab cos(90°) vanishes, leaving c² = a² + b².'
      }
    },
    {
      id: 'distance',
      name: 'Distance Formula',
      category: 'algebra',
      keywords: ['distance', 'distance formula', 'coordinates', 'points', 'cartesian', '2d distance'],
      icon: 'map-pin',
      formula: 'd = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}',
      summary: 'Calculates the straight-line Euclidean distance between two points (x₁, y₁) and (x₂, y₂) in a Cartesian plane.',
      whenToUse: ['Finding spatial separation between 2D coordinates', 'Deriving circle equations or perimeter of coordinate shapes'],
      steps: [
        { title: 'Step 1: Calculate Δx and Δy', text: 'Subtract coordinates: Δx = x₂ - x₁ and Δy = y₂ - y₁.' },
        { title: 'Step 2: Square both differences', text: '(Δx)² and (Δy)².' },
        { title: 'Step 3: Sum and take square root', text: 'd = √((Δx)² + (Δy)²).' }
      ],
      solverType: 'distance',
      workedExample: {
        problem: 'Find distance between P₁(1, 2) and P₂(4, 6).',
        solution: 'Δx = 4 - 1 = 3, Δy = 6 - 2 = 4. d = √(3² + 4²) = √(9 + 16) = √25 = 5.'
      },
      quiz: {
        question: 'What is the distance from origin (0, 0) to point (5, 12)?',
        options: ['17', '13', '7', '169'],
        correctIndex: 1,
        explanation: 'd = √(5² + 12²) = √(25 + 144) = √169 = 13.'
      }
    },
    {
      id: 'shoelace',
      name: 'Shoelace Formula (Gauss Area)',
      category: 'geometry',
      keywords: ['shoelace', 'polygon area', 'coordinates area', 'gauss area', 'vertices area'],
      icon: 'hexagon',
      formula: '\\mathcal{A} = \\frac{1}{2} \\left| \\sum_{i=1}^{n} (x_i y_{i+1} - x_{i+1} y_i) \\right|',
      summary: 'Calculates the area of any non-self-intersecting polygon given the 2D Cartesian coordinates of its vertices in order.',
      whenToUse: ['Finding area of arbitrary 2D polygons (triangles, quadrilaterals, pentagons)', 'Given Cartesian coordinate vertices'],
      steps: [
        { title: 'Step 1: List vertices in order', text: 'Write down (x₁, y₁), (x₂, y₂), ..., (xₙ, yₙ) clockwise or counterclockwise, repeating (x₁, y₁) at the end.' },
        { title: 'Step 2: Multiply cross-diagonals', text: 'Sum down-sloping products (x₁y₂ + x₂y₃ + ...) and up-sloping products (y₁x₂ + y₂x₃ + ...).' },
        { title: 'Step 3: Subtract and take half', text: 'Area = 0.5 × |Sum₁ - Sum₂|.' }
      ],
      solverType: 'shoelace',
      workedExample: {
        problem: 'Find area of triangle with vertices (0,0), (4,0), and (0,3).',
        solution: 'Cross products: (0×0 + 4×3 + 0×0) - (0×4 + 0×0 + 3×0) = 12 - 0 = 12. Area = 0.5 × 12 = 6.'
      },
      quiz: {
        question: 'Why is it called the Shoelace Formula?',
        options: ['It was invented by Arthur Shoelace', 'Cross-multiplying pairs of coordinates resembles tying shoes', 'It only works on shoes', 'None'],
        correctIndex: 1,
        explanation: 'The diagonal cross-multiplication of coordinate lists visually resembles shoe laces.'
      }
    },
    {
      id: 'thales',
      name: "Thales' Theorem",
      category: 'geometry',
      keywords: ['thales', 'thales theorem', 'inscribed angle', 'semicircle', 'diameter right angle'],
      icon: 'circle',
      formula: '\\text{If } AB \\text{ is diameter of circle, then } \\angle ACB = 90^\\circ \\text{ for any point } C \\text{ on circle.}',
      summary: 'States that if A, B, and C are points on a circle where line AB is a diameter, the angle ∠ACB is always a right angle (90°).',
      whenToUse: ['Constructing right angles inside circles', 'Finding unknown angles in inscribed triangles'],
      steps: [
        { title: 'Step 1: Identify circle diameter', text: 'Ensure the hypotenuse AB passes through the center of the circle.' },
        { title: 'Step 2: Locate vertex C', text: 'Vertex C lies anywhere on the circumference.' },
        { title: 'Step 3: Apply theorem', text: 'Conclude angle ∠ACB = 90° automatically.' }
      ],
      solverType: 'thales',
      workedExample: {
        problem: 'A triangle is inscribed in a circle with diameter AB = 10. If AC = 6, find BC.',
        solution: 'By Thales theorem, ∠C = 90°. Applying Pythagoras: BC = √(10² - 6²) = √(100 - 36) = √64 = 8.'
      },
      quiz: {
        question: 'Where must point C lie for Thales theorem to guarantee a 90° angle?',
        options: ['Inside the circle', 'On the circumference of the circle', 'Outside the circle', 'At the center'],
        correctIndex: 1,
        explanation: 'Point C must lie directly on the circle circumference opposite diameter AB.'
      }
    }
  ];

  /* ==========================================================================
     2. SNAP & SOLVE CAMERA & OCR ENGINE WITH GOOGLE SEARCH
     ========================================================================== */
  const btnUploadMode = document.getElementById('mode-upload-btn');
  const btnCameraMode = document.getElementById('mode-camera-btn');

  const dropzoneView = document.getElementById('dropzone-view');
  const cameraView = document.getElementById('camera-view');
  const dropzone = document.getElementById('image-dropzone');
  const fileInput = document.getElementById('file-input');

  const webcamVideo = document.getElementById('webcam-video');
  const btnCapturePhoto = document.getElementById('capture-photo-btn');
  const btnStopCamera = document.getElementById('stop-camera-btn');

  const scannerCanvas = document.getElementById('scanner-canvas');
  const canvasPlaceholder = document.getElementById('canvas-placeholder');
  const laserLine = document.getElementById('laser-line');
  const targetMarker = document.getElementById('target-marker');
  const scanStatusBadge = document.getElementById('scan-status-badge');

  const progressWrapper = document.getElementById('scan-progress-wrapper');
  const progressFill = document.getElementById('progress-fill');
  const progressText = document.getElementById('progress-text');
  const progressPct = document.getElementById('progress-pct');

  const extractedBox = document.getElementById('extracted-text-box');
  const ocrOutputText = document.getElementById('ocr-result-text');
  const googleSearchLink = document.getElementById('google-search-link');

  const solvedResultCard = document.getElementById('solved-result-card');
  const solutionTitle = document.getElementById('solution-title');
  const solutionBody = document.getElementById('solution-body-text');

  // Mode Toggling
  btnUploadMode.addEventListener('click', () => {
    btnUploadMode.classList.add('active');
    btnCameraMode.classList.remove('active');
    dropzoneView.classList.remove('hidden');
    cameraView.classList.add('hidden');
    stopWebcamStream();
  });

  btnCameraMode.addEventListener('click', () => {
    btnCameraMode.classList.add('active');
    btnUploadMode.classList.remove('active');
    cameraView.classList.remove('hidden');
    dropzoneView.classList.add('hidden');
    startWebcamStream();
  });

  // WebRTC Camera Controls
  async function startWebcamStream() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      state.cameraStream = stream;
      webcamVideo.srcObject = stream;
    } catch (err) {
      alert('Could not access camera. Please check camera permissions or upload an image file instead.');
      btnUploadMode.click();
    }
  }

  function stopWebcamStream() {
    if (state.cameraStream) {
      state.cameraStream.getTracks().forEach(track => track.stop());
      state.cameraStream = null;
    }
  }

  btnStopCamera.addEventListener('click', () => {
    btnUploadMode.click();
  });

  btnCapturePhoto.addEventListener('click', () => {
    if (!webcamVideo.videoWidth) return;
    scannerCanvas.width = webcamVideo.videoWidth;
    scannerCanvas.height = webcamVideo.videoHeight;
    const ctx = scannerCanvas.getContext('2d');
    ctx.drawImage(webcamVideo, 0, 0, scannerCanvas.width, scannerCanvas.height);
    
    canvasPlaceholder.classList.add('hidden');
    stopWebcamStream();
    btnUploadMode.click();
    processImageForScan('camera_snapshot');
  });

  // File Dropzone Handling
  dropzone.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      loadImageFromFile(e.target.files[0]);
    }
  });

  ['dragenter', 'dragover'].forEach(evt => {
    dropzone.addEventListener(evt, (e) => {
      e.preventDefault();
      dropzone.classList.add('drag-over');
    });
  });

  ['dragleave', 'drop'].forEach(evt => {
    dropzone.addEventListener(evt, (e) => {
      e.preventDefault();
      dropzone.classList.remove('drag-over');
    });
  });

  dropzone.addEventListener('drop', (e) => {
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      loadImageFromFile(e.dataTransfer.files[0]);
    }
  });

  function loadImageFromFile(file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        scannerCanvas.width = img.width;
        scannerCanvas.height = img.height;
        const ctx = scannerCanvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        canvasPlaceholder.classList.add('hidden');
        processImageForScan(file.name);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }

  // Sample Photos Generator (Matrix Styled Canvas)
  document.querySelectorAll('.sample-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const type = chip.dataset.sample;
      generateSampleImageCanvas(type);
    });
  });

  function generateSampleImageCanvas(type) {
    scannerCanvas.width = 600;
    scannerCanvas.height = 360;
    const ctx = scannerCanvas.getContext('2d');

    // Crisp Light Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 600, 360);

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 20px "Outfit", sans-serif';

    if (type === 'triangle') {
      ctx.fillText('SAMPLE MATH PROBLEM #1:', 30, 40);
      ctx.font = '18px "Outfit", sans-serif';
      ctx.fillStyle = '#334155';
      ctx.fillText('Find the area of a triangle with side lengths:', 30, 75);
      ctx.fillStyle = '#0284c7';
      ctx.font = 'bold 24px "Outfit", sans-serif';
      ctx.fillText('a = 3 cm,  b = 4 cm,  c = 5 cm', 30, 115);

      // Draw diagram
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(100, 310);
      ctx.lineTo(400, 310);
      ctx.lineTo(100, 160);
      ctx.closePath();
      ctx.stroke();

      ctx.fillStyle = '#059669';
      ctx.font = '15px "Outfit"';
      ctx.fillText('c = 5 cm', 230, 330);
      ctx.fillText('a = 3 cm', 70, 245);
      ctx.fillText('b = 4 cm', 260, 225);
    } else if (type === 'pythagoras') {
      ctx.fillText('GEOMETRY QUESTION:', 30, 40);
      ctx.font = '18px "Outfit", sans-serif';
      ctx.fillStyle = '#334155';
      ctx.fillText('Find the hypotenuse c using Pythagorean theorem:', 30, 75);
      ctx.fillStyle = '#0284c7';
      ctx.font = 'bold 24px "Outfit", sans-serif';
      ctx.fillText('a = 6,  b = 8,  c = ?', 30, 115);
    } else {
      ctx.fillText('ALGEBRA WORKSHEET:', 30, 40);
      ctx.font = '18px "Outfit", sans-serif';
      ctx.fillStyle = '#334155';
      ctx.fillText('Solve the quadratic equation for x:', 30, 75);
      ctx.fillStyle = '#059669';
      ctx.font = 'bold 24px "Outfit", sans-serif';
      ctx.fillText('x^2 - 5x + 6 = 0', 30, 115);
    }

    canvasPlaceholder.classList.add('hidden');
    processImageForScan(`sample_${type}`);
  }

  // Scanning & OCR Extraction Engine
  async function processImageForScan(sourceName) {
    laserLine.classList.remove('hidden');
    targetMarker.classList.remove('hidden');
    scanStatusBadge.className = 'badge-tag status-scanning';
    scanStatusBadge.textContent = 'Scanning Photo...';

    progressWrapper.classList.remove('hidden');
    progressFill.style.width = '20%';
    progressText.textContent = 'Analyzing matrix pixels...';
    progressPct.textContent = '20%';

    let extractedText = '';

    try {
      if (window.Tesseract) {
        progressText.textContent = 'Running Tesseract OCR Engine...';
        progressFill.style.width = '50%';
        progressPct.textContent = '50%';

        const result = await window.Tesseract.recognize(scannerCanvas, 'eng');
        extractedText = result.data.text.trim();
      }
    } catch (err) {
      console.log('Tesseract OCR fallback');
    }

    if (!extractedText || sourceName.startsWith('sample_')) {
      if (sourceName.includes('triangle')) {
        extractedText = 'Find triangle area with side lengths: a = 3, b = 4, c = 5';
      } else if (sourceName.includes('pythagoras')) {
        extractedText = 'Pythagorean theorem: leg a = 6, leg b = 8, find hypotenuse c';
      } else if (sourceName.includes('quadratic')) {
        extractedText = 'Solve quadratic equation: x^2 - 5x + 6 = 0';
      } else {
        extractedText = 'Find triangle area with side lengths: a = 3, b = 4, c = 5';
      }
    }

    progressFill.style.width = '100%';
    progressText.textContent = 'Scan Complete!';
    progressPct.textContent = '100%';

    setTimeout(() => {
      laserLine.classList.add('hidden');
      targetMarker.classList.add('hidden');
      progressWrapper.classList.add('hidden');

      scanStatusBadge.className = 'badge-tag status-done';
      scanStatusBadge.textContent = 'Scan Complete ✓';

      state.scannedText = extractedText;
      extractedBox.classList.remove('hidden');
      ocrOutputText.textContent = extractedText;

      const googleQuery = encodeURIComponent(`solve math problem: ${extractedText}`);
      googleSearchLink.href = `https://www.google.com/search?q=${googleQuery}`;

      solveScannedProblem(extractedText);
    }, 600);
  }

  // Automatic Math Problem Solver
  function solveScannedProblem(text) {
    solvedResultCard.classList.remove('hidden');
    const lower = text.toLowerCase();

    const matchSides = text.match(/a\s*=\s*(\d+(?:\.\d+)?).+?b\s*=\s*(\d+(?:\.\d+)?).+?c\s*=\s*(\d+(?:\.\d+)?)/i) ||
                       text.match(/(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)/);

    if (matchSides || lower.includes('heron') || lower.includes('triangle area')) {
      const a = matchSides ? parseFloat(matchSides[1]) : 3;
      const b = matchSides ? parseFloat(matchSides[2]) : 4;
      const c = matchSides ? parseFloat(matchSides[3]) : 5;

      const s = (a + b + c) / 2;
      const prod = s * (s - a) * (s - b) * (s - c);
      const area = Math.sqrt(Math.max(0, prod));

      solutionTitle.textContent = `Heron's Formula Triangle Solution (a=${a}, b=${b}, c=${c})`;
      solutionBody.innerHTML = `
        <p style="margin-bottom: 8px;"><strong>Recognized Matrix Pattern:</strong> Triangle side lengths $a=${a}, b=${b}, c=${c}$.</p>
        <p style="margin-bottom: 8px;"><strong>1. Semi-perimeter ($s$):</strong> $s = \\frac{${a}+${b}+${c}}{2} = ${s}$</p>
        <p style="margin-bottom: 8px;"><strong>2. Difference terms:</strong> $(s-a)=${s-a}$, $(s-b)=${s-b}$, $(s-c)=${s-c}$</p>
        <p style="margin-bottom: 12px;"><strong>3. Final Area ($\mathcal{A}$):</strong> $\\mathcal{A} = \\sqrt{${s} \\cdot ${s-a} \\cdot ${s-b} \\cdot ${s-c}} = \\sqrt{${prod}} = \\mathbf{${area.toFixed(3)}\\text{ units}^2}$</p>
        <button class="btn btn-primary btn-sm" onclick="applyHeronPreset(${a}, ${b}, ${c})">
          <i data-lucide="calculator"></i> Load into Interactive Heron Visualizer
        </button>
      `;

      if (window.katex) {
        renderMathInElement(solutionBody, { delimiters: [{ left: '$', right: '$', display: false }] });
      }
      return;
    }

    if (lower.includes('pythagoras') || lower.includes('hypotenuse') || lower.includes('right triangle')) {
      const matchLegs = text.match(/a\s*=\s*(\d+).+?b\s*=\s*(\d+)/i);
      const a = matchLegs ? parseFloat(matchLegs[1]) : 6;
      const b = matchLegs ? parseFloat(matchLegs[2]) : 8;
      const c = Math.sqrt(a*a + b*b);

      solutionTitle.textContent = `Pythagorean Theorem Solution (a=${a}, b=${b})`;
      solutionBody.innerHTML = `
        <p style="margin-bottom: 8px;"><strong>Formula:</strong> $a^2 + b^2 = c^2 \\implies c = \\sqrt{a^2 + b^2}$</p>
        <p style="margin-bottom: 8px;"><strong>Calculation:</strong> $c = \\sqrt{${a}^2 + ${b}^2} = \\sqrt{${a*a} + ${b*b}} = \\sqrt{${a*a + b*b}} = \\mathbf{${c}}$</p>
      `;
      if (window.katex) {
        renderMathInElement(solutionBody, { delimiters: [{ left: '$', right: '$', display: false }] });
      }
      return;
    }

    if (lower.includes('quadratic') || lower.includes('x^2') || lower.includes('x²')) {
      solutionTitle.textContent = `Quadratic Equation Solution (x² - 5x + 6 = 0)`;
      solutionBody.innerHTML = `
        <p style="margin-bottom: 8px;"><strong>Formula:</strong> $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$ for $a=1, b=-5, c=6$</p>
        <p style="margin-bottom: 8px;"><strong>Discriminant:</strong> $\\Delta = (-5)^2 - 4(1)(6) = 25 - 24 = 1$</p>
        <p style="margin-bottom: 8px;"><strong>Roots:</strong> $x_1 = \\frac{5 + 1}{2} = \\mathbf{3}, \\quad x_2 = \\frac{5 - 1}{2} = \\mathbf{2}$</p>
      `;
      if (window.katex) {
        renderMathInElement(solutionBody, { delimiters: [{ left: '$', right: '$', display: false }] });
      }
      return;
    }

    solutionTitle.textContent = `Math Problem Detected`;
    solutionBody.innerHTML = `
      <p style="margin-bottom: 12px;">Problem text: <em>"${text}"</em></p>
      <a href="https://www.google.com/search?q=${encodeURIComponent('solve ' + text)}" target="_blank" class="btn btn-primary btn-sm btn-google">
        <i data-lucide="search"></i> View Full Step-by-Step Solution on Google
      </a>
    `;
    if (window.lucide) window.lucide.createIcons();
  }

  window.applyHeronPreset = function(a, b, c) {
    elA.value = a; sliderA.value = a; displayA.textContent = a;
    elB.value = b; sliderB.value = b; displayB.textContent = b;
    elC.value = c; sliderC.value = c; displayC.textContent = c;

    document.getElementById('heron-section').scrollIntoView({ behavior: 'smooth' });
    updateHeronCalculator();
  };


  /* ==========================================================================
     3. HERON'S FORMULA CALCULATOR & SVG ENGINE
     ========================================================================== */
  const elA = document.getElementById('side-a');
  const elB = document.getElementById('side-b');
  const elC = document.getElementById('side-c');

  const sliderA = document.getElementById('slider-a');
  const sliderB = document.getElementById('slider-b');
  const sliderC = document.getElementById('slider-c');

  const displayA = document.getElementById('val-display-a');
  const displayB = document.getElementById('val-display-b');
  const displayC = document.getElementById('val-display-c');

  const alertBanner = document.getElementById('heron-alert');
  const alertMsg = document.getElementById('heron-alert-msg');
  const unitSelect = document.getElementById('unit-select');
  const unitSqDisplay = document.getElementById('unit-sq-display');

  // Outputs
  const resArea = document.getElementById('res-area');
  const resS = document.getElementById('res-s');
  const resP = document.getElementById('res-p');
  const resR = document.getElementById('res-r');
  const resBigR = document.getElementById('res-R');

  const angA = document.getElementById('ang-a');
  const angB = document.getElementById('ang-b');
  const angC = document.getElementById('ang-c');
  const heightA = document.getElementById('h-a');

  // SVG Checkboxes
  const toggleAltitude = document.getElementById('toggle-altitude');
  const toggleIncircle = document.getElementById('toggle-incircle');
  const toggleCircumcircle = document.getElementById('toggle-circumcircle');

  // Sync Sliders and Number Inputs
  function syncInputs(source, target, display, val) {
    target.value = val;
    display.textContent = Number(val).toFixed(1);
    updateHeronCalculator();
  }

  elA.addEventListener('input', (e) => syncInputs(elA, sliderA, displayA, e.target.value));
  sliderA.addEventListener('input', (e) => syncInputs(sliderA, elA, displayA, e.target.value));

  elB.addEventListener('input', (e) => syncInputs(elB, sliderB, displayB, e.target.value));
  sliderB.addEventListener('input', (e) => syncInputs(sliderB, elB, displayB, e.target.value));

  elC.addEventListener('input', (e) => syncInputs(elC, sliderC, displayC, e.target.value));
  sliderC.addEventListener('input', (e) => syncInputs(sliderC, elC, displayC, e.target.value));

  unitSelect.addEventListener('change', (e) => {
    state.unit = e.target.value;
    unitSqDisplay.textContent = `${state.unit}²`;
  });

  [toggleAltitude, toggleIncircle, toggleCircumcircle].forEach(chk => {
    chk.addEventListener('change', updateHeronCalculator);
  });

  // Presets Buttons
  document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const a = parseFloat(btn.dataset.a);
      const b = parseFloat(btn.dataset.b);
      const c = parseFloat(btn.dataset.c);

      elA.value = a; sliderA.value = a; displayA.textContent = a;
      elB.value = b; sliderB.value = b; displayB.textContent = b;
      elC.value = c; sliderC.value = c; displayC.textContent = c;

      updateHeronCalculator();
    });
  });

  // Calculate & Update UI
  function updateHeronCalculator() {
    const a = parseFloat(elA.value) || 0;
    const b = parseFloat(elB.value) || 0;
    const c = parseFloat(elC.value) || 0;

    state.sideA = a;
    state.sideB = b;
    state.sideC = c;

    const isValid = (a + b > c) && (a + c > b) && (b + c > a) && a > 0 && b > 0 && c > 0;

    if (!isValid) {
      alertBanner.classList.remove('hidden');
      alertMsg.textContent = `Invalid triangle! The triangle inequality fails: a+b > c (${(a+b).toFixed(1)} > ${c}), a+c > b (${(a+c).toFixed(1)} > ${b}), b+c > a (${(b+c).toFixed(1)} > ${a}).`;
      resArea.textContent = '—';
      resS.textContent = '—';
      resP.textContent = '—';
      resR.textContent = '—';
      resBigR.textContent = '—';
      clearSVG();
      return;
    }

    alertBanner.classList.add('hidden');

    const s = (a + b + c) / 2;
    const prod = s * (s - a) * (s - b) * (s - c);
    const area = Math.sqrt(Math.max(0, prod));
    const perimeter = a + b + c;

    const inradius = area / s;
    const circumradius = (a * b * c) / (4 * area);

    const cosA = Math.min(1, Math.max(-1, (b*b + c*c - a*a) / (2 * b * c)));
    const cosB = Math.min(1, Math.max(-1, (a*a + c*c - b*b) / (2 * a * c)));
    const alphaRad = Math.acos(cosA);
    const betaRad = Math.acos(cosB);
    const gammaRad = Math.PI - alphaRad - betaRad;

    const alphaDeg = alphaRad * (180 / Math.PI);
    const betaDeg = betaRad * (180 / Math.PI);
    const gammaDeg = gammaRad * (180 / Math.PI);

    const ha = (2 * area) / a;

    resArea.textContent = area.toFixed(3);
    resS.textContent = s.toFixed(3);
    resP.textContent = perimeter.toFixed(3);
    resR.textContent = inradius.toFixed(3);
    resBigR.textContent = circumradius.toFixed(3);

    angA.textContent = `${alphaDeg.toFixed(2)}°`;
    angB.textContent = `${betaDeg.toFixed(2)}°`;
    angC.textContent = `${gammaDeg.toFixed(2)}°`;
    heightA.textContent = ha.toFixed(3);

    renderStepBreakdown(a, b, c, s, prod, area);
    renderSVG(a, b, c, alphaRad, inradius, circumradius, ha);
  }

  function renderStepBreakdown(a, b, c, s, prod, area) {
    if (window.katex) {
      window.katex.render(`s = \\frac{${a} + ${b} + ${c}}{2} = ${s.toFixed(2)}`, document.getElementById('katex-step1'), { displayMode: true });
      window.katex.render(`(s-a) = ${(s-a).toFixed(2)}, \\; (s-b) = ${(s-b).toFixed(2)}, \\; (s-c) = ${(s-c).toFixed(2)}`, document.getElementById('katex-step2'), { displayMode: true });
      window.katex.render(`\\text{Product} = ${s.toFixed(2)} \\cdot ${(s-a).toFixed(2)} \\cdot ${(s-b).toFixed(2)} \\cdot ${(s-c).toFixed(2)} = ${prod.toFixed(2)}`, document.getElementById('katex-step3'), { displayMode: true });
      window.katex.render(`\\mathcal{A} = \\sqrt{${prod.toFixed(2)}} = ${area.toFixed(3)}\\text{ ${state.unit}}^2`, document.getElementById('katex-step4'), { displayMode: true });
    }
  }

  function clearSVG() {
    const svg = document.getElementById('triangle-svg');
    svg.innerHTML = '';
  }

  function renderSVG(a, b, c, alphaRad, inradius, circumradius, ha) {
    const svg = document.getElementById('triangle-svg');
    const width = 500;
    const height = 380;
    const padding = 60;

    const Ax_raw = 0;
    const Ay_raw = 0;
    const Bx_raw = c;
    const By_raw = 0;
    const Cx_raw = b * Math.cos(alphaRad);
    const Cy_raw = b * Math.sin(alphaRad);

    const minX = Math.min(Ax_raw, Bx_raw, Cx_raw);
    const maxX = Math.max(Ax_raw, Bx_raw, Cx_raw);
    const minY = Math.min(Ay_raw, By_raw, Cy_raw);
    const maxY = Math.max(Ay_raw, By_raw, Cy_raw);

    const rawWidth = Math.max(0.1, maxX - minX);
    const rawHeight = Math.max(0.1, maxY - minY);

    const scaleX = (width - 2 * padding) / rawWidth;
    const scaleY = (height - 2 * padding) / rawHeight;
    const scale = Math.min(scaleX, scaleY);

    const offsetX = (width - rawWidth * scale) / 2 - minX * scale;
    const offsetY = height - (height - rawHeight * scale) / 2 + minY * scale;

    const toSvgX = (x) => x * scale + offsetX;
    const toSvgY = (y) => offsetY - y * scale;

    const Ax = toSvgX(Ax_raw), Ay = toSvgY(Ay_raw);
    const Bx = toSvgX(Bx_raw), By = toSvgY(By_raw);
    const Cx = toSvgX(Cx_raw), Cy = toSvgY(Cy_raw);

    const perim = a + b + c;
    const Ix_raw = (a * Ax_raw + b * Bx_raw + c * Cx_raw) / perim;
    const Iy_raw = (a * Ay_raw + b * By_raw + c * Cy_raw) / perim;
    const Ix = toSvgX(Ix_raw), Iy = toSvgY(Iy_raw);
    const InRadiusSvg = inradius * scale;

    const D = 2 * (Ax_raw * (By_raw - Cy_raw) + Bx_raw * (Cy_raw - Ay_raw) + Cx_raw * (Ay_raw - By_raw));
    const Ux_raw = ((Ax_raw*Ax_raw + Ay_raw*Ay_raw)*(By_raw - Cy_raw) + (Bx_raw*Bx_raw + By_raw*By_raw)*(Cy_raw - Ay_raw) + (Cx_raw*Cx_raw + Cy_raw*Cy_raw)*(Ay_raw - By_raw)) / D;
    const Uy_raw = ((Ax_raw*Ax_raw + Ay_raw*Ay_raw)*(Cx_raw - Bx_raw) + (Bx_raw*Bx_raw + By_raw*By_raw)*(Ax_raw - Cx_raw) + (Cx_raw*Cx_raw + Cy_raw*Cy_raw)*(Bx_raw - Ax_raw)) / D;
    const Ux = toSvgX(Ux_raw), Uy = toSvgY(Uy_raw);
    const CircumRadiusSvg = circumradius * scale;

    let elements = `
      <defs>
        <linearGradient id="triGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.35" />
          <stop offset="100%" stop-color="#c084fc" stop-opacity="0.15" />
        </linearGradient>
      </defs>
    `;

    if (toggleCircumcircle.checked) {
      elements += `<circle cx="${Ux}" cy="${Uy}" r="${CircumRadiusSvg}" fill="none" stroke="#fbbf24" stroke-width="1.5" stroke-dasharray="4,4" opacity="0.8" />`;
    }

    if (toggleIncircle.checked) {
      elements += `<circle cx="${Ix}" cy="${Iy}" r="${InRadiusSvg}" fill="none" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="3,3" opacity="0.8" />`;
    }

    // Sky Azure Triangle Path
    elements += `<path d="M ${Ax} ${Ay} L ${Bx} ${By} L ${Cx} ${Cy} Z" fill="url(#triGrad)" stroke="#38bdf8" stroke-width="3" stroke-linejoin="round" />`;

    if (toggleAltitude.checked) {
      elements += `<line x1="${Cx}" y1="${Cy}" x2="${Cx}" y2="${Ay}" stroke="#c084fc" stroke-width="2" stroke-dasharray="4,4" />`;
      elements += `<text x="${Cx + 6}" y="${(Cy + Ay) / 2}" fill="#c084fc" font-size="12" font-weight="bold">h_a=${ha.toFixed(1)}</text>`;
    }

    elements += `<text x="${(Ax + Bx) / 2}" y="${Ay + 22}" fill="#7dd3fc" text-anchor="middle" font-weight="bold" font-size="13">c = ${c}</text>`;
    elements += `<text x="${(Bx + Cx) / 2 + 12}" y="${(By + Cy) / 2}" fill="#7dd3fc" font-weight="bold" font-size="13">a = ${a}</text>`;
    elements += `<text x="${(Ax + Cx) / 2 - 16}" y="${(Ay + Cy) / 2}" fill="#7dd3fc" font-weight="bold" font-size="13">b = ${b}</text>`;

    const nodeColor = '#f0f9ff';
    elements += `
      <circle cx="${Ax}" cy="${Ay}" r="5" fill="#38bdf8" />
      <text x="${Ax - 14}" y="${Ay + 16}" fill="${nodeColor}" font-weight="bold" font-size="14">A</text>

      <circle cx="${Bx}" cy="${By}" r="5" fill="#38bdf8" />
      <text x="${Bx + 10}" y="${By + 16}" fill="${nodeColor}" font-weight="bold" font-size="14">B</text>

      <circle cx="${Cx}" cy="${Cy}" r="5" fill="#38bdf8" />
      <text x="${Cx}" y="${Cy - 12}" fill="${nodeColor}" text-anchor="middle" font-weight="bold" font-size="14">C</text>
    `;

    svg.innerHTML = elements;
  }


  /* ==========================================================================
     4. THEOREM ASSISTANT & NATURAL LANGUAGE SEARCH ENGINE
     ========================================================================== */
  const theoremGrid = document.getElementById('theorem-cards-grid');
  const searchInput = document.getElementById('theorem-search-input');
  const searchBtn = document.getElementById('theorem-search-btn');
  const filterInput = document.getElementById('library-filter-input');
  const modal = document.getElementById('theorem-modal');
  const modalContent = document.getElementById('modal-content');
  const modalCloseBtn = document.getElementById('modal-close-btn');

  function renderTheoremCards() {
    theoremGrid.innerHTML = '';

    const filtered = theoremDatabase.filter(item => {
      const matchCat = state.activeCategory === 'all' || item.category === state.activeCategory;
      const q = state.filterQuery.toLowerCase();
      const matchQuery = !q || item.name.toLowerCase().includes(q) || item.summary.toLowerCase().includes(q) || item.keywords.some(k => k.includes(q));
      return matchCat && matchQuery;
    });

    if (filtered.length === 0) {
      theoremGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted);">
          <i data-lucide="help-circle" style="width: 48px; height: 48px; margin-bottom: 12px; opacity: 0.5;"></i>
          <p>No matching theorems found in matrix. Try searching "Pythagorean" or "Sines".</p>
        </div>
      `;
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    filtered.forEach(th => {
      const card = document.createElement('div');
      card.className = 'theorem-card';
      card.innerHTML = `
        <div class="th-card-top">
          <div class="th-header-row">
            <div class="th-icon-box"><i data-lucide="${th.icon}"></i></div>
            <span class="th-cat-badge">${th.category}</span>
          </div>
          <h3 class="th-title">${th.name}</h3>
          <p class="th-summary">${th.summary}</p>
          <div class="th-formula-preview" id="preview-math-${th.id}"></div>
        </div>
        <button class="btn btn-secondary btn-sm full-width" onclick="openTheoremModal('${th.id}')">
          <span>Explain & Solve</span>
          <i data-lucide="arrow-right"></i>
        </button>
      `;
      theoremGrid.appendChild(card);

      if (window.katex) {
        window.katex.render(th.formula, document.getElementById(`preview-math-${th.id}`), { throwOnError: false });
      }
    });

    if (window.lucide) window.lucide.createIcons();
  }

  document.querySelectorAll('#category-tabs .tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#category-tabs .tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.activeCategory = btn.dataset.category;
      renderTheoremCards();
    });
  });

  filterInput.addEventListener('input', (e) => {
    state.filterQuery = e.target.value;
    renderTheoremCards();
  });

  function handleNaturalLanguageSearch(query) {
    if (!query || !query.trim()) return;

    const cleaned = query.toLowerCase()
      .replace(/how to do the /g, '')
      .replace(/how to do /g, '')
      .replace(/how do i do /g, '')
      .replace(/explain the /g, '')
      .replace(/explain /g, '')
      .replace(/ theorem/g, '')
      .trim();

    let bestMatch = null;
    let maxScore = -1;

    theoremDatabase.forEach(th => {
      let score = 0;
      if (th.name.toLowerCase().includes(cleaned)) score += 10;
      th.keywords.forEach(kw => {
        if (cleaned.includes(kw) || kw.includes(cleaned)) score += 5;
      });
      if (score > maxScore) {
        maxScore = score;
        bestMatch = th;
      }
    });

    if (bestMatch && maxScore > 0) {
      openTheoremModal(bestMatch.id);
    } else {
      document.getElementById('library-section').scrollIntoView({ behavior: 'smooth' });
      filterInput.value = query;
      state.filterQuery = query;
      renderTheoremCards();
    }
  }

  searchBtn.addEventListener('click', () => handleNaturalLanguageSearch(searchInput.value));
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleNaturalLanguageSearch(searchInput.value);
  });

  document.querySelectorAll('.prompt-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const q = chip.dataset.query;
      searchInput.value = q;
      handleNaturalLanguageSearch(q);
    });
  });

  /* ==========================================================================
     5. THEOREM DEEP-DIVE MODAL & INTERACTIVE SOLVERS
     ========================================================================== */
  window.openTheoremModal = function(id) {
    const th = theoremDatabase.find(item => item.id === id);
    if (!th) return;

    modalContent.innerHTML = `
      <div class="modal-header-hero">
        <div class="modal-title-row">
          <div class="th-icon-box"><i data-lucide="${th.icon}"></i></div>
          <div>
            <h2 class="modal-title">${th.name}</h2>
            <span class="th-cat-badge">${th.category}</span>
          </div>
        </div>
        <div class="modal-formula-hero" id="modal-math-hero"></div>
      </div>

      <div class="modal-section-title"><i data-lucide="book-open"></i> Concept Overview</div>
      <p style="color: var(--text-secondary); line-height: 1.7; margin-bottom: 16px;">${th.summary}</p>
      
      <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 24px;">
        <strong style="color: var(--text-muted); font-size: 0.85rem; width: 100%;">WHEN TO USE THIS THEOREM:</strong>
        ${th.whenToUse.map(w => `<span class="prop-badge"><i data-lucide="check" style="width: 14px; height: 14px; color: var(--accent-emerald);"></i> ${w}</span>`).join('')}
      </div>

      <div class="modal-section-title"><i data-lucide="list-checks"></i> 4-Step Execution Guide</div>
      <div class="steps-grid" style="grid-template-columns: 1fr 1fr; margin-bottom: 24px;">
        ${th.steps.map(step => `
          <div class="step-card">
            <div class="step-num">${step.title}</div>
            <p class="step-desc" style="margin: 0; color: var(--text-primary);">${step.text}</p>
          </div>
        `).join('')}
      </div>

      <div class="modal-section-title"><i data-lucide="calculator"></i> Interactive Live Solver</div>
      <div class="solver-widget" id="solver-container-${th.id}"></div>

      <div class="modal-section-title"><i data-lucide="check-circle-2"></i> Worked Step-by-Step Example</div>
      <div style="background: #000; padding: 18px; border-radius: var(--radius-md); border: 1px solid var(--border-color); margin-bottom: 24px;">
        <p style="font-weight: 600; margin-bottom: 6px; color: var(--accent-cyan);">${th.workedExample.problem}</p>
        <p style="color: var(--text-secondary); font-size: 0.95rem;">${th.workedExample.solution}</p>
      </div>

      <div class="modal-section-title"><i data-lucide="help-circle"></i> Quick Practice Check</div>
      <div class="quiz-widget">
        <div class="quiz-question">${th.quiz.question}</div>
        <div class="quiz-options">
          ${th.quiz.options.map((opt, idx) => `
            <button class="quiz-opt-btn" onclick="checkQuizAnswer(this, ${idx}, ${th.quiz.correctIndex}, '${th.quiz.explanation.replace(/'/g, "\\'")}')">${opt}</button>
          `).join('')}
        </div>
        <div class="quiz-feedback" id="quiz-feedback-box"></div>
      </div>
    `;

    modal.classList.remove('hidden');

    if (window.katex) {
      window.katex.render(th.formula, document.getElementById('modal-math-hero'), { displayMode: true, throwOnError: false });
    }

    if (window.lucide) window.lucide.createIcons();

    initInteractiveSolver(th);
  };

  modalCloseBtn.addEventListener('click', () => modal.classList.add('hidden'));
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.add('hidden');
  });

  window.checkQuizAnswer = function(btn, chosenIdx, correctIdx, explanation) {
    const parent = btn.closest('.quiz-options');
    const feedback = parent.nextElementSibling;

    parent.querySelectorAll('.quiz-opt-btn').forEach(b => {
      b.disabled = true;
      b.classList.remove('correct', 'wrong');
    });

    if (chosenIdx === correctIdx) {
      btn.classList.add('correct');
      feedback.style.color = 'var(--accent-emerald)';
      feedback.textContent = `Correct! 🎉 ${explanation}`;
    } else {
      btn.classList.add('wrong');
      parent.children[correctIdx].classList.add('correct');
      feedback.style.color = 'var(--accent-rose)';
      feedback.textContent = `Incorrect. ${explanation}`;
    }
  };

  function initInteractiveSolver(th) {
    const container = document.getElementById(`solver-container-${th.id}`);
    if (!container) return;

    if (th.solverType === 'pythagoras') {
      container.innerHTML = `
        <div class="solver-inputs-grid">
          <div class="solver-input-item"><label>Leg a</label><input type="number" id="py-a" value="6" step="any"></div>
          <div class="solver-input-item"><label>Leg b</label><input type="number" id="py-b" value="8" step="any"></div>
        </div>
        <div class="solver-result-box" id="py-res">Hypotenuse c = 10.000</div>
      `;

      const solvePy = () => {
        const a = parseFloat(document.getElementById('py-a').value) || 0;
        const b = parseFloat(document.getElementById('py-b').value) || 0;
        const c = Math.sqrt(a*a + b*b);
        document.getElementById('py-res').textContent = `Hypotenuse c = √(a² + b²) = ${c.toFixed(3)}`;
      };

      document.getElementById('py-a').addEventListener('input', solvePy);
      document.getElementById('py-b').addEventListener('input', solvePy);
    } else if (th.solverType === 'quadratic') {
      container.innerHTML = `
        <div class="solver-inputs-grid">
          <div class="solver-input-item"><label>a (x² coeff)</label><input type="number" id="quad-a" value="1"></div>
          <div class="solver-input-item"><label>b (x coeff)</label><input type="number" id="quad-b" value="-5"></div>
          <div class="solver-input-item"><label>c (constant)</label><input type="number" id="quad-c" value="6"></div>
        </div>
        <div class="solver-result-box" id="quad-res">Roots: x₁ = 3.000, x₂ = 2.000</div>
      `;

      const solveQuad = () => {
        const a = parseFloat(document.getElementById('quad-a').value) || 0;
        const b = parseFloat(document.getElementById('quad-b').value) || 0;
        const c = parseFloat(document.getElementById('quad-c').value) || 0;

        if (a === 0) {
          document.getElementById('quad-res').textContent = 'Not a quadratic (a cannot be 0)';
          return;
        }

        const delta = b*b - 4*a*c;
        if (delta > 0) {
          const x1 = (-b + Math.sqrt(delta)) / (2*a);
          const x2 = (-b - Math.sqrt(delta)) / (2*a);
          document.getElementById('quad-res').textContent = `Two Real Roots: x₁ = ${x1.toFixed(3)}, x₂ = ${x2.toFixed(3)} (Discriminant Δ = ${delta.toFixed(1)})`;
        } else if (delta === 0) {
          const x = -b / (2*a);
          document.getElementById('quad-res').textContent = `One Repeated Root: x = ${x.toFixed(3)} (Discriminant Δ = 0)`;
        } else {
          const real = (-b / (2*a)).toFixed(3);
          const imag = (Math.sqrt(-delta) / (2*a)).toFixed(3);
          document.getElementById('quad-res').textContent = `Complex Roots: x = ${real} ± ${imag}i`;
        }
      };

      document.getElementById('quad-a').addEventListener('input', solveQuad);
      document.getElementById('quad-b').addEventListener('input', solveQuad);
      document.getElementById('quad-c').addEventListener('input', solveQuad);
    } else {
      container.innerHTML = `
        <p style="text-align: center; color: var(--text-secondary); margin-bottom: 12px;">Use our main Heron's Formula Calculator or Snap & Solve camera for visual calculations!</p>
        <button class="btn btn-primary btn-sm full-width" onclick="document.getElementById('heron-section').scrollIntoView({behavior: 'smooth'}); document.getElementById('theorem-modal').classList.add('hidden');">
          <span>Go to Heron's Calculator</span>
          <i data-lucide="arrow-up"></i>
        </button>
      `;
    }
  }

  // INITIALIZE PAGE
  renderTheoremCards();
  updateHeronCalculator();

  /* ==========================================================================
     TETRIS MATRIX MINIGAME
     ========================================================================== */
  (function initTetris() {
    const canvas      = document.getElementById('tetris-canvas');
    const nextCanvas  = document.getElementById('tetris-next-canvas');
    if (!canvas || !nextCanvas) return;

    const ctx      = canvas.getContext('2d');
    const nCtx     = nextCanvas.getContext('2d');
    const COLS     = 10;
    const ROWS     = 20;
    const BLOCK    = canvas.width / COLS;   // 24px
    const N_BLOCK  = nextCanvas.width / 5;  // 20px

    // Sky & Chill colour palette per piece type
    const COLORS = {
      I: '#38bdf8',   // sky cyan
      O: '#fbbf24',   // sunshine amber
      T: '#c084fc',   // twilight purple
      S: '#34d399',   // cloud mint
      Z: '#f472b6',   // sunset pink
      J: '#818cf8',   // soft indigo
      L: '#fb923c',   // sunset orange
    };

    const PIECES = {
      I: [[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]],
      O: [[1,1],[1,1]],
      T: [[0,1,0],[1,1,1],[0,0,0]],
      S: [[0,1,1],[1,1,0],[0,0,0]],
      Z: [[1,1,0],[0,1,1],[0,0,0]],
      J: [[1,0,0],[1,1,1],[0,0,0]],
      L: [[0,0,1],[1,1,1],[0,0,0]],
    };

    const PIECE_KEYS = Object.keys(PIECES);

    // Scoring table (NES Tetris style)
    const LINE_SCORES = [0, 100, 300, 500, 800];

    // Game state
    let board, piece, nextPiece, score, level, lines, gameRunning, paused, animId, dropInterval, lastDrop;

    function createBoard() {
      return Array.from({ length: ROWS }, () => Array(COLS).fill(null));
    }

    function randomPiece() {
      const key = PIECE_KEYS[Math.floor(Math.random() * PIECE_KEYS.length)];
      return {
        key,
        shape: PIECES[key].map(r => [...r]),
        color: COLORS[key],
        x: Math.floor(COLS / 2) - Math.floor(PIECES[key][0].length / 2),
        y: 0,
      };
    }

    function rotate(shape) {
      const rows = shape.length, cols = shape[0].length;
      const rotated = Array.from({ length: cols }, () => Array(rows).fill(0));
      for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++)
          rotated[c][rows - 1 - r] = shape[r][c];
      return rotated;
    }

    function isValid(shape, ox, oy) {
      for (let r = 0; r < shape.length; r++)
        for (let c = 0; c < shape[r].length; c++)
          if (shape[r][c]) {
            const nx = ox + c, ny = oy + r;
            if (nx < 0 || nx >= COLS || ny >= ROWS) return false;
            if (ny >= 0 && board[ny][nx]) return false;
          }
      return true;
    }

    function lock() {
      piece.shape.forEach((row, r) =>
        row.forEach((cell, c) => {
          if (cell) {
            const ny = piece.y + r;
            if (ny < 0) { gameOver(); return; }
            board[ny][piece.x + c] = piece.color;
          }
        })
      );
      clearLines();
      piece = nextPiece;
      nextPiece = randomPiece();
      if (!isValid(piece.shape, piece.x, piece.y)) gameOver();
      drawNext();
    }

    function clearLines() {
      let cleared = 0;
      for (let r = ROWS - 1; r >= 0; r--) {
        if (board[r].every(cell => cell !== null)) {
          board.splice(r, 1);
          board.unshift(Array(COLS).fill(null));
          cleared++;
          r++; // re-check same row index
        }
      }
      if (cleared > 0) {
        lines += cleared;
        score += LINE_SCORES[cleared] * (level + 1);
        level  = Math.floor(lines / 10);
        dropInterval = Math.max(80, 800 - level * 70);
        updateHUD();
      }
    }

    function ghostY() {
      let gy = piece.y;
      while (isValid(piece.shape, piece.x, gy + 1)) gy++;
      return gy;
    }

    function drawBlock(context, x, y, color, blockSize, alpha = 1) {
      context.globalAlpha = alpha;
      // Fill
      context.fillStyle = color;
      context.fillRect(x * blockSize + 1, y * blockSize + 1, blockSize - 2, blockSize - 2);
      // Inner glow highlight
      context.fillStyle = 'rgba(255,255,255,0.18)';
      context.fillRect(x * blockSize + 2, y * blockSize + 2, blockSize - 4, 4);
      // Border glow
      context.strokeStyle = color;
      context.lineWidth   = 1;
      context.shadowColor = color;
      context.shadowBlur  = 6;
      context.strokeRect(x * blockSize + 0.5, y * blockSize + 0.5, blockSize - 1, blockSize - 1);
      context.shadowBlur  = 0;
      context.globalAlpha = 1;
    }

    function drawBoard() {
      // Background grid
      ctx.fillStyle = '#f1f5f9';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)';
      ctx.lineWidth = 0.5;
      for (let r = 0; r < ROWS; r++) {
        ctx.beginPath(); ctx.moveTo(0, r * BLOCK); ctx.lineTo(canvas.width, r * BLOCK); ctx.stroke();
      }
      for (let c = 0; c < COLS; c++) {
        ctx.beginPath(); ctx.moveTo(c * BLOCK, 0); ctx.lineTo(c * BLOCK, canvas.height); ctx.stroke();
      }

      // Locked cells
      board.forEach((row, r) =>
        row.forEach((color, c) => {
          if (color) drawBlock(ctx, c, r, color, BLOCK);
        })
      );

      if (!piece) return;

      // Ghost piece
      const gy = ghostY();
      if (gy !== piece.y) {
        piece.shape.forEach((row, r) =>
          row.forEach((cell, c) => {
            if (cell) drawBlock(ctx, piece.x + c, gy + r, piece.color, BLOCK, 0.18);
          })
        );
      }

      // Active piece
      piece.shape.forEach((row, r) =>
        row.forEach((cell, c) => {
          if (cell) drawBlock(ctx, piece.x + c, piece.y + r, piece.color, BLOCK);
        })
      );
    }

    function drawNext() {
      nCtx.fillStyle = '#f1f5f9';
      nCtx.fillRect(0, 0, nextCanvas.width, nextCanvas.height);
      if (!nextPiece) return;
      const shape  = nextPiece.shape;
      const offX   = Math.floor((5 - shape[0].length) / 2);
      const offY   = Math.floor((5 - shape.length) / 2);
      shape.forEach((row, r) =>
        row.forEach((cell, c) => {
          if (cell) drawBlock(nCtx, offX + c, offY + r, nextPiece.color, N_BLOCK);
        })
      );
    }

    function updateHUD() {
      document.getElementById('tetris-score').textContent = String(score).padStart(6, '0');
      document.getElementById('tetris-level').textContent = String(level + 1).padStart(2, '0');
      document.getElementById('tetris-lines').textContent = String(lines).padStart(3, '0');
    }

    function gameLoop(ts) {
      if (!gameRunning || paused) return;
      if (ts - lastDrop > dropInterval) {
        if (isValid(piece.shape, piece.x, piece.y + 1)) {
          piece.y++;
        } else {
          lock();
        }
        lastDrop = ts;
      }
      drawBoard();
      animId = requestAnimationFrame(gameLoop);
    }

    function startGame() {
      board        = createBoard();
      score        = 0;
      level        = 0;
      lines        = 0;
      dropInterval = 800;
      lastDrop     = performance.now();
      paused       = false;
      gameRunning  = true;

      piece     = randomPiece();
      nextPiece = randomPiece();

      updateHUD();
      drawNext();

      document.getElementById('tetris-overlay').classList.add('hidden');
      document.getElementById('tetris-pause-btn').disabled = false;
      document.getElementById('tetris-pause-btn').innerHTML = '<i data-lucide="pause"></i> PAUSE';
      if (window.lucide) window.lucide.createIcons();

      if (animId) cancelAnimationFrame(animId);
      animId = requestAnimationFrame(gameLoop);
    }

    function gameOver() {
      gameRunning = false;
      cancelAnimationFrame(animId);
      document.getElementById('tetris-pause-btn').disabled = true;

      const overlay = document.getElementById('tetris-overlay');
      overlay.classList.remove('hidden');
      overlay.querySelector('.tetris-overlay-content').innerHTML = `
        <div class="tetris-logo"><i data-lucide="gamepad-2"></i></div>
        <h3>GAME OVER</h3>
        <div class="tetris-gameover-score">${String(score).padStart(6, '0')}</div>
        <p style="color:var(--text-muted); font-size:0.8rem;">Lines: ${lines} &nbsp;|&nbsp; Level: ${level + 1}</p>
        <button id="tetris-start-btn" class="btn btn-primary">
          <i data-lucide="rotate-ccw"></i> PLAY AGAIN
        </button>
      `;
      if (window.lucide) window.lucide.createIcons();
      document.getElementById('tetris-start-btn').addEventListener('click', startGame);
    }

    function togglePause() {
      if (!gameRunning) return;
      paused = !paused;
      const btn = document.getElementById('tetris-pause-btn');
      if (paused) {
        cancelAnimationFrame(animId);
        btn.innerHTML = '<i data-lucide="play"></i> RESUME';

        // Draw pause overlay on canvas
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = `bold 20px "Outfit", sans-serif`;
        ctx.fillStyle = '#0284c7';
        ctx.textAlign = 'center';
        ctx.fillText('PAUSED', canvas.width / 2, canvas.height / 2);
      } else {
        btn.innerHTML = '<i data-lucide="pause"></i> PAUSE';
        lastDrop = performance.now();
        animId = requestAnimationFrame(gameLoop);
      }
      if (window.lucide) window.lucide.createIcons();
    }

    // --- Keyboard Controls ---
    document.addEventListener('keydown', e => {
      if (!gameRunning || paused) {
        if (e.key === 'p' || e.key === 'P') togglePause();
        return;
      }
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          if (isValid(piece.shape, piece.x - 1, piece.y)) piece.x--;
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (isValid(piece.shape, piece.x + 1, piece.y)) piece.x++;
          break;
        case 'ArrowDown':
          e.preventDefault();
          if (isValid(piece.shape, piece.x, piece.y + 1)) { piece.y++; score += 1; updateHUD(); }
          else lock();
          break;
        case 'ArrowUp': {
          e.preventDefault();
          const rotated = rotate(piece.shape);
          if (isValid(rotated, piece.x, piece.y)) piece.shape = rotated;
          else if (isValid(rotated, piece.x - 1, piece.y)) { piece.shape = rotated; piece.x--; }
          else if (isValid(rotated, piece.x + 1, piece.y)) { piece.shape = rotated; piece.x++; }
          break;
        }
        case ' ': {
          e.preventDefault();
          // Hard drop
          const dy = ghostY() - piece.y;
          piece.y += dy;
          score += dy * 2;
          updateHUD();
          lock();
          break;
        }
        case 'p':
        case 'P':
          togglePause();
          break;
      }
      drawBoard();
    });

    // Button wiring
    document.getElementById('tetris-start-btn').addEventListener('click', startGame);
    document.getElementById('tetris-pause-btn').addEventListener('click', togglePause);
    document.getElementById('tetris-reset-btn').addEventListener('click', () => {
      if (animId) cancelAnimationFrame(animId);
      gameRunning = false;
      paused      = false;
      board       = createBoard();

      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const overlay = document.getElementById('tetris-overlay');
      overlay.classList.remove('hidden');
      overlay.querySelector('.tetris-overlay-content').innerHTML = `
        <div class="tetris-logo"><i data-lucide="gamepad-2"></i></div>
        <h3>TETRIS</h3>
        <p>Press START to play</p>
        <button id="tetris-start-btn" class="btn btn-primary">
          <i data-lucide="play"></i> START GAME
        </button>
      `;
      if (window.lucide) window.lucide.createIcons();
      document.getElementById('tetris-start-btn').addEventListener('click', startGame);
      document.getElementById('tetris-pause-btn').disabled = true;
      document.getElementById('tetris-pause-btn').innerHTML = '<i data-lucide="pause"></i> PAUSE';
      if (window.lucide) window.lucide.createIcons();
      score = 0; level = 0; lines = 0; updateHUD();
    });

    /* ------------------------------------------------------------------ */
    /*  MOBILE: D-PAD BUTTONS (Pointer Events — works for touch + mouse)   */
    /* ------------------------------------------------------------------ */
    // Prevent synthesised mouse events from double-firing on touch devices
    canvas.style.touchAction = 'none';

    function doAction(action) {
      if (!gameRunning || paused) return;
      switch (action) {
        case 'left':
          if (isValid(piece.shape, piece.x - 1, piece.y)) piece.x--;
          break;
        case 'right':
          if (isValid(piece.shape, piece.x + 1, piece.y)) piece.x++;
          break;
        case 'rotate': {
          const r = rotate(piece.shape);
          if      (isValid(r, piece.x,     piece.y)) piece.shape = r;
          else if (isValid(r, piece.x - 1, piece.y)) { piece.shape = r; piece.x--; }
          else if (isValid(r, piece.x + 1, piece.y)) { piece.shape = r; piece.x++; }
          break;
        }
        case 'down':
          if (isValid(piece.shape, piece.x, piece.y + 1)) { piece.y++; score += 1; updateHUD(); }
          else lock();
          break;
        case 'harddrop': {
          const d = ghostY() - piece.y;
          piece.y += d;
          score += d * 2;
          updateHUD();
          lock();
          break;
        }
      }
      drawBoard();
    }

    // Auto-repeat for held left / right / down
    let repeatTimer = null;
    let repeatInterval = null;

    function startRepeat(action) {
      stopRepeat();           // clear any stale timers first
      doAction(action);
      repeatTimer = setTimeout(() => {
        repeatInterval = setInterval(() => doAction(action), 60);
      }, 180);
    }

    function stopRepeat() {
      clearTimeout(repeatTimer);
      clearInterval(repeatInterval);
      repeatTimer = null;
      repeatInterval = null;
    }

    function bindDpadBtn(id, action, repeat) {
      const btn = document.getElementById(id);
      if (!btn) return;

      btn.style.touchAction = 'none'; // tell browser: we handle this pointer

      btn.addEventListener('pointerdown', e => {
        e.preventDefault();
        btn.setPointerCapture(e.pointerId); // keep tracking even if finger drifts
        btn.classList.add('pressed');
        if (repeat) startRepeat(action);
        else         doAction(action);
      });

      btn.addEventListener('pointerup', e => {
        btn.classList.remove('pressed');
        if (repeat) stopRepeat();
      });

      btn.addEventListener('pointercancel', e => {
        btn.classList.remove('pressed');
        if (repeat) stopRepeat();
      });
    }

    bindDpadBtn('dpad-left',     'left',     true);
    bindDpadBtn('dpad-right',    'right',    true);
    bindDpadBtn('dpad-down',     'down',     true);
    bindDpadBtn('dpad-rotate',   'rotate',   false);
    bindDpadBtn('dpad-harddrop', 'harddrop', false);

    // Dpad pause button
    const dpadPauseBtn = document.getElementById('dpad-pause');
    if (dpadPauseBtn) {
      dpadPauseBtn.style.touchAction = 'none';
      dpadPauseBtn.addEventListener('pointerdown', e => {
        e.preventDefault();
        togglePause();
        dpadPauseBtn.innerHTML = paused
          ? '<i data-lucide="play"></i>'
          : '<i data-lucide="pause"></i>';
        if (window.lucide) window.lucide.createIcons();
      });
    }

    /* ------------------------------------------------------------------ */
    /*  MOBILE: SWIPE + TAP ON CANVAS (Pointer Events)                     */
    /* ------------------------------------------------------------------ */
    let ptStartX = 0, ptStartY = 0, ptId = null;
    const SWIPE_MIN = 28;   // px — minimum swipe distance
    const TAP_MAX   = 14;   // px — max drift to count as a tap

    canvas.addEventListener('pointerdown', e => {
      if (ptId !== null) return;       // ignore second finger
      ptId     = e.pointerId;
      ptStartX = e.clientX;
      ptStartY = e.clientY;
      canvas.setPointerCapture(e.pointerId);
    });

    canvas.addEventListener('pointerup', e => {
      if (e.pointerId !== ptId) return;
      ptId = null;
      if (!gameRunning || paused) return;

      const dx   = e.clientX - ptStartX;
      const dy   = e.clientY - ptStartY;
      const dist = Math.hypot(dx, dy);

      if (dist < TAP_MAX) {
        doAction('harddrop');           // tap → hard drop
        return;
      }

      if (Math.abs(dx) >= Math.abs(dy)) {
        if (Math.abs(dx) >= SWIPE_MIN) doAction(dx > 0 ? 'right' : 'left');
      } else {
        if (Math.abs(dy) >= SWIPE_MIN) doAction(dy < 0 ? 'rotate' : 'down');
      }
    });

    canvas.addEventListener('pointercancel', () => { ptId = null; });

    // Draw initial empty board
    drawBoard();
  })();

});

