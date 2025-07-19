<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Dress Recommendation Demo Project Instructions

This project is a React + Vite + Tailwind CSS application for dress recommendations using computer vision for body type analysis.

## Key Technologies
- React with TypeScript
- Vite for building
- Tailwind CSS for styling
- MediaPipe for pose detection
- TensorFlow.js for model inference
- Canvas API for dress overlay

## Project Structure
- `/src/components/` - React components for UI
- `/src/lib/` - Utility functions for pose detection, classification, and overlays
- `/public/dresses/` - Transparent PNG dress images
- `/public/model/` - ML model files (TensorFlow.js or JSON coefficients)
- `/notebooks/` - Jupyter notebook for training body type classifier

## Code Conventions
- Use functional components with hooks
- TypeScript for type safety
- Tailwind CSS classes for styling
- Keep all processing client-side (no backend)
- Handle errors gracefully with fallbacks
- Maintain user privacy (no data upload)

## Body Types
- hourglass, pear, apple, rectangle, inverted_triangle
- Classification based on shoulder/waist/hip ratios from pose keypoints

## Key Features
- Image upload with validation
- Pose detection and body type classification
- Dress recommendations with reasoning
- Canvas-based dress overlay
- Download composed image
- Mobile-responsive design
