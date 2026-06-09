export interface SampleScan {
  id: string;
  name: string;
  type: string;
  expectedResult: string;
  description: string;
  svg: string;
}

// Helper to convert SVG string to a PNG Blob
export const svgToBlob = (svgString: string): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Draw dark background to simulate MRI film black
        ctx.fillStyle = '#05070c';
        ctx.fillRect(0, 0, 256, 256);
        ctx.drawImage(img, 0, 0, 256, 256);
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create PNG blob from canvas'));
          }
        }, 'image/png');
      } else {
        reject(new Error('Failed to get 2D canvas context'));
      }
      URL.revokeObjectURL(url);
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load SVG image'));
      URL.revokeObjectURL(url);
    };
    
    img.src = url;
  });
};

// SVG templates of Brain MRI slices (Axial view)
const skullBase = `
  <rect width="256" height="256" fill="#05070c" />
  <!-- Skull Outline -->
  <ellipse cx="128" cy="128" rx="85" ry="105" fill="none" stroke="#2a3245" stroke-width="4" />
  <ellipse cx="128" cy="128" rx="82" ry="102" fill="none" stroke="#5d6b89" stroke-width="2" opacity="0.8" />
  
  <!-- Outer Brain Matter (Cortex) -->
  <path d="M 128 35 C 75 35, 50 80, 50 128 C 50 176, 75 221, 128 221 C 181 221, 206 176, 206 128 C 206 80, 181 35, 128 35 Z" 
        fill="#131722" stroke="#252c3d" stroke-dasharray="4 2" />
  
  <!-- Ventricles (Symmetrical Center Structure) -->
  <path d="M 128 100 C 118 80, 108 90, 115 120 C 120 140, 128 150, 128 150 C 128 150, 136 140, 141 120 C 148 90, 138 80, 128 100 Z" 
        fill="#0a0d14" stroke="#1d2433" stroke-width="2" />
  <path d="M 128 120 C 115 115, 100 120, 105 135 C 110 145, 125 145, 128 150 C 131 145, 146 145, 151 135 C 156 120, 141 115, 128 120 Z" 
        fill="#0a0d14" stroke="#1d2433" stroke-width="2" />
`;

export const SAMPLE_SCANS: SampleScan[] = [
  {
    id: 'scan-normal',
    name: 'Patient Ref: NOR-02',
    type: 'Normal Scan',
    expectedResult: 'No Tumor Detected',
    description: 'Axial T2-weighted MRI scan showing normal brain anatomy with no tissue abnormalities or mass effects.',
    svg: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256">
        ${skullBase}
        <!-- Symmetric healthy brain hemispheres patterns -->
        <path d="M 90 80 C 85 90, 95 100, 90 110" fill="none" stroke="#2c364c" stroke-width="2" opacity="0.6" />
        <path d="M 166 80 C 171 90, 161 100, 166 110" fill="none" stroke="#2c364c" stroke-width="2" opacity="0.6" />
        <path d="M 85 130 C 80 140, 90 150, 85 160" fill="none" stroke="#2c364c" stroke-width="2" opacity="0.6" />
        <path d="M 171 130 C 176 140, 166 150, 171 160" fill="none" stroke="#2c364c" stroke-width="2" opacity="0.6" />
        <!-- Normal text label on mri scan -->
        <text x="15" y="25" fill="#5d6b89" font-family="monospace" font-size="10">T2-AXIAL</text>
        <text x="15" y="40" fill="#5d6b89" font-family="monospace" font-size="10">HEALTHY_REF</text>
      </svg>
    `
  },
  {
    id: 'scan-glioblastoma',
    name: 'Patient Ref: GBM-89',
    type: 'Glioblastoma Scan (T1C+)',
    expectedResult: 'Tumor Detected (Glioblastoma)',
    description: 'T1-weighted contrast-enhanced MRI showing a large, irregular ring-enhancing mass in the right hemisphere with surrounding vasogenic edema.',
    svg: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256">
        ${skullBase}
        <!-- Glioblastoma Tumor Mass (Right side) -->
        <circle cx="85" cy="110" r="24" fill="#ff4d4d" fill-opacity="0.15" filter="blur(2px)" />
        <ellipse cx="85" cy="110" rx="20" ry="18" fill="#e65c5c" fill-opacity="0.3" stroke="#ff4d4d" stroke-width="2" stroke-dasharray="3 1" />
        <circle cx="82" cy="108" r="10" fill="#ff9999" fill-opacity="0.6" />
        <path d="M 82 108 L 78 115 M 80 102 L 85 107" stroke="#ffffff" stroke-width="1.5" opacity="0.8" />
        <!-- Midline shift (distortion of ventricles) -->
        <path d="M 130 90 C 133 110, 135 125, 131 150" fill="none" stroke="#485672" stroke-dasharray="2 2" stroke-width="2" />
        <text x="15" y="25" fill="#5d6b89" font-family="monospace" font-size="10">T1-C+</text>
        <text x="15" y="40" fill="#ff4d4d" font-family="monospace" font-size="10">MASS_DET_01</text>
      </svg>
    `
  },
  {
    id: 'scan-meningioma',
    name: 'Patient Ref: MEN-45',
    type: 'Meningioma Scan (T2)',
    expectedResult: 'Tumor Detected (Meningioma)',
    description: 'T2-weighted MRI revealing a well-circumscribed, extra-axial mass adjacent to the skull lining, displaying the classic dural tail sign.',
    svg: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256">
        ${skullBase}
        <!-- Meningioma at edge of skull -->
        <path d="M 180 70 A 20 20 0 0 1 205 98 L 202 85 Z" fill="#ffaa00" fill-opacity="0.4" stroke="#ffaa00" stroke-width="2" />
        <circle cx="190" cy="82" r="12" fill="#ffd480" fill-opacity="0.7" />
        <!-- Dural tail -->
        <path d="M 172 60 C 180 65, 192 78, 203 103 C 205 110, 207 120, 207 125" fill="none" stroke="#ffaa00" stroke-width="1.5" />
        <text x="15" y="25" fill="#5d6b89" font-family="monospace" font-size="10">T2-AXIAL</text>
        <text x="15" y="40" fill="#ffaa00" font-family="monospace" font-size="10">MENIN_REF</text>
      </svg>
    `
  },
  {
    id: 'scan-astrocytoma',
    name: 'Patient Ref: AST-12',
    type: 'Astrocytoma Scan (T2)',
    expectedResult: 'Tumor Detected (Astrocytoma)',
    description: 'T2-weighted MRI demonstrating a hyperintense, diffuse infiltrative lesion in the frontal lobe with minimal mass effect.',
    svg: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256">
        ${skullBase}
        <!-- Diffuse Astrocytoma hyperintensity -->
        <path d="M 110 60 Q 140 50 155 75 Q 160 100 135 105 Q 110 110 100 90 Q 90 70 110 60 Z" 
              fill="#c084fc" fill-opacity="0.25" filter="blur(4px)" />
        <path d="M 120 70 Q 135 65 145 78 Q 140 90 128 88 Q 115 85 120 70 Z" 
              fill="#e9d5ff" fill-opacity="0.4" filter="blur(2px)" stroke="#c084fc" stroke-width="1" stroke-dasharray="2 3" />
        <text x="15" y="25" fill="#5d6b89" font-family="monospace" font-size="10">T2-AXIAL</text>
        <text x="15" y="40" fill="#c084fc" font-family="monospace" font-size="10">DIFFUSE_INF</text>
      </svg>
    `
  }
];
