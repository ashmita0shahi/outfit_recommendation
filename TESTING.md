# Testing the Dress Recommendation App

## Quick Test Setup

Since the app requires dress images and ML models, here's how to get started quickly:

### 1. Generate Test Assets

#### Option A: Use Built-in Placeholders
The app has built-in fallbacks and will show placeholder dress images if the actual images aren't found.

#### Option B: Generate Simple Dress Placeholders
```bash
npm install canvas  # For generating placeholder images
node generate-dress-placeholders.js
```

### 2. Test the Application

1. **Start the development server** (if not already running):
   ```bash
   npm run dev
   ```

2. **Open your browser** to http://localhost:5174

3. **Upload a test image**:
   - Use a front-facing photo of a person
   - Ensure good lighting and the full torso is visible
   - JPG, PNG, or WebP format (max 5MB)

### 3. Expected Behavior

1. **Image Upload**: Should accept and display the uploaded image
2. **Pose Detection**: Will attempt to detect keypoints using MediaPipe
3. **Body Type Classification**: Uses the trained model (coefficients.json) to classify body type
4. **Recommendations**: Shows 3 dress suggestions based on body type
5. **Try-On Feature**: Attempts to overlay dress images on the photo

### 4. Troubleshooting

#### Common Issues:

**"Pose detection failed"**
- Try a clearer, front-facing photo with better lighting
- Ensure the person is standing straight with arms visible

**"Failed to load model"**
- The app will fall back to rule-based classification
- Check that `public/model/coefficients.json` exists

**"Dress images not loading"**
- Placeholder colored rectangles will show instead
- Add actual dress PNG images to `public/dresses/` folder

**MediaPipe loading issues**
- The app includes fallback pose estimation
- May take a moment to load MediaPipe from CDN

### 5. Using Real Assets

#### For Production Use:

1. **Replace dress images** in `public/dresses/` with:
   - High-quality transparent PNG files
   - 1000-1500px height recommended
   - Various dress styles (wrap, A-line, fit-and-flare, etc.)

2. **Train better models** using the Jupyter notebook:
   ```bash
   cd notebooks
   jupyter notebook bodytype_demo.ipynb
   ```

3. **Update recommendations** in `src/lib/recommendations.ts`

### 6. Demo Workflow

1. Upload a photo
2. Click "Analyze Body Type"
3. View the detected body type and confidence
4. Browse dress recommendations
5. Toggle "Overlay dress on photo" to see try-on effect
6. Use "Show Debug Info" to see detailed measurements
7. Download the result or try another photo

### 7. Privacy Note

- All processing happens locally in the browser
- No images are uploaded to any server
- Safe to use with personal photos
