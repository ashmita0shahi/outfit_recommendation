import { PoseLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

let poseLandmarker: PoseLandmarker | null = null;

export async function initializePose() {
  if (poseLandmarker) return poseLandmarker;

  try {
    const vision = await FilesetResolver.forVisionTasks(
      'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
    );
    
    poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task',
        delegate: 'GPU'
      },
      runningMode: 'IMAGE',
      numPoses: 1
    });

    return poseLandmarker;
  } catch (error) {
    console.error('Failed to initialize MediaPipe Pose:', error);
    throw new Error('Failed to load pose detection model');
  }
}

export async function detectPose(canvas: HTMLCanvasElement) {
  try {
    if (!poseLandmarker) {
      await initializePose();
    }

    if (!poseLandmarker) {
      throw new Error('Pose detector not initialized');
    }

    const results = poseLandmarker.detect(canvas);
    
    if (!results.landmarks || results.landmarks.length === 0) {
      return null;
    }

    // Convert MediaPipe landmarks to our format
    const landmarks = results.landmarks[0];
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    const keypoints = landmarks.map((landmark, index) => ({
      name: getPosePointName(index),
      x: landmark.x * canvasWidth,
      y: landmark.y * canvasHeight,
      z: landmark.z,
      visibility: landmark.visibility || 1.0
    }));

    // Filter out keypoints we need for body type analysis
    const requiredKeypoints = keypoints.filter(kp => 
      ['left_shoulder', 'right_shoulder', 'left_hip', 'right_hip'].includes(kp.name)
    );

    if (requiredKeypoints.length < 4) {
      throw new Error('Required body keypoints not detected');
    }

    return keypoints;
  } catch (error) {
    console.error('Pose detection failed:', error);
    throw error;
  }
}

function getPosePointName(index: number): string {
  // MediaPipe Pose landmark indices
  const posePoints: { [key: number]: string } = {
    0: 'nose',
    1: 'left_eye_inner',
    2: 'left_eye',
    3: 'left_eye_outer',
    4: 'right_eye_inner',
    5: 'right_eye',
    6: 'right_eye_outer',
    7: 'left_ear',
    8: 'right_ear',
    9: 'mouth_left',
    10: 'mouth_right',
    11: 'left_shoulder',
    12: 'right_shoulder',
    13: 'left_elbow',
    14: 'right_elbow',
    15: 'left_wrist',
    16: 'right_wrist',
    17: 'left_pinky',
    18: 'right_pinky',
    19: 'left_index',
    20: 'right_index',
    21: 'left_thumb',
    22: 'right_thumb',
    23: 'left_hip',
    24: 'right_hip',
    25: 'left_knee',
    26: 'right_knee',
    27: 'left_ankle',
    28: 'right_ankle',
    29: 'left_heel',
    30: 'right_heel',
    31: 'left_foot_index',
    32: 'right_foot_index'
  };

  return posePoints[index] || `point_${index}`;
}

// Fallback pose detection using a simple approach if MediaPipe fails
export async function detectPoseFallback(canvas: HTMLCanvasElement) {
  // This is a very basic fallback that tries to estimate body proportions
  // In a real implementation, you might use a different pose estimation library
  // or provide manual adjustment tools for users
  
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;

  // Estimate typical proportions for a front-facing person
  const centerX = canvasWidth / 2;
  const shoulderY = canvasHeight * 0.25;
  const hipY = canvasHeight * 0.6;
  
  const shoulderWidth = canvasWidth * 0.25;
  const hipWidth = canvasWidth * 0.22;

  const mockKeypoints = [
    {
      name: 'left_shoulder',
      x: centerX - shoulderWidth / 2,
      y: shoulderY,
      z: 0,
      visibility: 0.9
    },
    {
      name: 'right_shoulder',
      x: centerX + shoulderWidth / 2,
      y: shoulderY,
      z: 0,
      visibility: 0.9
    },
    {
      name: 'left_hip',
      x: centerX - hipWidth / 2,
      y: hipY,
      z: 0,
      visibility: 0.9
    },
    {
      name: 'right_hip',
      x: centerX + hipWidth / 2,
      y: hipY,
      z: 0,
      visibility: 0.9
    }
  ];

  console.warn('Using fallback pose estimation - results may be less accurate');
  return mockKeypoints;
}
