// Dress overlay functionality for canvas

interface OverlayConfig {
  scaleMin: number;
  scaleMax: number;
  offsetY: number;
  offsetX: number;
  rotation: number;
}

interface BodyMetrics {
  shoulderSpan: number;
  waistSpan: number;
  hipSpan: number;
  r1WaistShoulder: number;
  r2HipShoulder: number;
}

const DEFAULT_CONFIG: OverlayConfig = {
  scaleMin: 0.8,
  scaleMax: 1.2,
  offsetY: -20, // Pixels to offset neckline above shoulder line
  offsetX: 0,   // Horizontal offset from center
  rotation: 0   // Rotation in degrees
};

export async function overlayDress(
  canvas: HTMLCanvasElement,
  keypoints: any[],
  dressImageUrl: string,
  metrics: BodyMetrics,
  config: Partial<OverlayConfig> = {}
): Promise<void> {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  
  try {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Cannot get canvas context');
    }

    // Load the dress image
    const dressImage = await loadImage(dressImageUrl);
    
    // Calculate overlay parameters
    const overlayParams = calculateOverlayParameters(keypoints, metrics, dressImage, finalConfig);
    
    if (!overlayParams) {
      throw new Error('Could not calculate overlay parameters');
    }

    // Apply the overlay
    await applyDressOverlay(ctx, dressImage, overlayParams);
    
  } catch (error) {
    console.error('Dress overlay failed:', error);
    // Instead of throwing, we'll try a fallback approach
    await applySimpleOverlay(canvas, dressImageUrl, keypoints);
  }
}

async function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous'; // Enable CORS for external images
    
    img.onload = () => resolve(img);
    img.onerror = () => {
      // Try loading a placeholder if the original fails
      console.warn(`Failed to load dress image: ${url}, using placeholder`);
      reject(new Error(`Failed to load image: ${url}`));
    };
    
    img.src = url;
  });
}

interface OverlayParameters {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  alpha: number;
}

function calculateOverlayParameters(
  keypoints: any[],
  metrics: BodyMetrics,
  dressImage: HTMLImageElement,
  config: OverlayConfig
): OverlayParameters | null {
  try {
    // Find key landmarks
    const leftShoulder = keypoints.find(kp => kp.name === 'left_shoulder');
    const rightShoulder = keypoints.find(kp => kp.name === 'right_shoulder');
    const leftHip = keypoints.find(kp => kp.name === 'left_hip');
    const rightHip = keypoints.find(kp => kp.name === 'right_hip');

    if (!leftShoulder || !rightShoulder || !leftHip || !rightHip) {
      throw new Error('Required keypoints not found');
    }

    // Calculate person's measurements in pixels
    const shoulderCenter = {
      x: (leftShoulder.x + rightShoulder.x) / 2,
      y: (leftShoulder.y + rightShoulder.y) / 2
    };

    const hipCenter = {
      x: (leftHip.x + rightHip.x) / 2,
      y: (leftHip.y + rightHip.y) / 2
    };

    const bodyHeight = hipCenter.y - shoulderCenter.y;
    const shoulderWidth = Math.abs(rightShoulder.x - leftShoulder.x);

    // Calculate dress scaling
    // Scale the dress width to match shoulder or hip width based on dress style
    const targetWidth = shoulderWidth * 1.1; // Slightly wider than shoulders
    const scaleX = targetWidth / dressImage.width;
    const scaleY = scaleX; // Maintain aspect ratio

    // Apply scale constraints
    const finalScale = Math.max(config.scaleMin, Math.min(config.scaleMax, scaleX));

    const finalWidth = dressImage.width * finalScale;
    const finalHeight = dressImage.height * finalScale;

    // Position the dress
    // Center horizontally on the person
    const x = shoulderCenter.x - (finalWidth / 2) + config.offsetX;
    
    // Position vertically so the neckline sits just below the shoulders
    const y = shoulderCenter.y + config.offsetY;

    return {
      x,
      y,
      width: finalWidth,
      height: finalHeight,
      rotation: config.rotation,
      alpha: 0.85 // Slightly transparent to blend with the photo
    };
  } catch (error) {
    console.error('Failed to calculate overlay parameters:', error);
    return null;
  }
}

async function applyDressOverlay(
  ctx: CanvasRenderingContext2D,
  dressImage: HTMLImageElement,
  params: OverlayParameters
): Promise<void> {
  // Save the current canvas state
  ctx.save();

  // Set transparency
  ctx.globalAlpha = params.alpha;

  // Apply transformations
  ctx.translate(params.x + params.width / 2, params.y + params.height / 2);
  ctx.rotate(params.rotation * Math.PI / 180);

  // Draw the dress image
  ctx.drawImage(
    dressImage,
    -params.width / 2,
    -params.height / 2,
    params.width,
    params.height
  );

  // Restore the canvas state
  ctx.restore();
}

async function applySimpleOverlay(
  canvas: HTMLCanvasElement,
  dressImageUrl: string,
  keypoints: any[]
): Promise<void> {
  try {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Try to load a placeholder or simplified dress overlay
    const placeholderImage = await createPlaceholderDress(200, 300);
    
    // Simple positioning based on canvas center
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Draw placeholder with low opacity
    ctx.save();
    ctx.globalAlpha = 0.3;
    ctx.drawImage(
      placeholderImage,
      centerX - 100, // Half width
      centerY - 150, // Half height
      200,
      300
    );
    ctx.restore();
    
    console.log('Applied simple dress overlay fallback');
  } catch (error) {
    console.warn('Simple overlay also failed:', error);
    // If everything fails, we just don't show an overlay
  }
}

function createPlaceholderDress(width: number, height: number): Promise<HTMLImageElement> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      resolve(new Image());
      return;
    }

    // Draw a simple dress silhouette
    ctx.fillStyle = 'rgba(150, 100, 200, 0.6)';
    
    // Dress outline
    ctx.beginPath();
    ctx.moveTo(width * 0.4, 0); // Top left
    ctx.lineTo(width * 0.6, 0); // Top right
    ctx.lineTo(width * 0.7, height * 0.3); // Shoulder right
    ctx.lineTo(width * 0.8, height * 0.6); // Waist right
    ctx.lineTo(width * 0.9, height); // Bottom right
    ctx.lineTo(width * 0.1, height); // Bottom left
    ctx.lineTo(width * 0.2, height * 0.6); // Waist left
    ctx.lineTo(width * 0.3, height * 0.3); // Shoulder left
    ctx.closePath();
    ctx.fill();

    // Convert canvas to image
    const img = new Image();
    img.onload = () => resolve(img);
    img.src = canvas.toDataURL();
  });
}

export function downloadCanvasImage(canvas: HTMLCanvasElement, filename: string = 'my-look.png'): void {
  try {
    // Create a download link
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    
    // Temporarily add to DOM and click
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log(`Downloaded image as: ${filename}`);
  } catch (error) {
    console.error('Failed to download image:', error);
    alert('Failed to download image. Please try again.');
  }
}

export function adjustOverlayParameters(
  canvas: HTMLCanvasElement,
  dressImageUrl: string,
  keypoints: any[],
  adjustments: Partial<OverlayConfig>
): Promise<void> {
  // Re-apply overlay with new parameters
  return overlayDress(canvas, keypoints, dressImageUrl, {
    shoulderSpan: 100, // These would come from previous analysis
    waistSpan: 80,
    hipSpan: 90,
    r1WaistShoulder: 0.8,
    r2HipShoulder: 0.9
  }, adjustments);
}

// Utility function to check if a point is within the dress area (for interaction)
export function isPointInDress(
  x: number,
  y: number,
  dressParams: OverlayParameters
): boolean {
  return (
    x >= dressParams.x &&
    x <= dressParams.x + dressParams.width &&
    y >= dressParams.y &&
    y <= dressParams.y + dressParams.height
  );
}
