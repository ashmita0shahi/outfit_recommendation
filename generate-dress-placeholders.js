// Simple script to generate placeholder dress images for testing
// Run this with: node generate-dress-placeholders.js

import { createCanvas } from 'canvas';
import fs from 'fs';
import path from 'path';

const dresses = [
  { name: 'wrap-dress-1', color: '#E91E63', style: 'wrap' },
  { name: 'fit-flare-1', color: '#9C27B0', style: 'fit-flare' },
  { name: 'aline-1', color: '#673AB7', style: 'a-line' },
  { name: 'bodycon-1', color: '#3F51B5', style: 'bodycon' },
  { name: 'fit-flare-2', color: '#2196F3', style: 'fit-flare' },
  { name: 'empire-1', color: '#009688', style: 'empire' },
  { name: 'empire-2', color: '#4CAF50', style: 'empire' },
  { name: 'shift-1', color: '#8BC34A', style: 'shift' }
];

function generateDressShape(ctx, width, height, style, color) {
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.8;
  
  ctx.beginPath();
  
  switch (style) {
    case 'wrap':
      // Wrap dress shape - crossed bodice, flared skirt
      ctx.moveTo(width * 0.45, height * 0.1);
      ctx.lineTo(width * 0.55, height * 0.1);
      ctx.lineTo(width * 0.65, height * 0.3);
      ctx.lineTo(width * 0.7, height * 0.5);
      ctx.lineTo(width * 0.8, height * 0.9);
      ctx.lineTo(width * 0.2, height * 0.9);
      ctx.lineTo(width * 0.3, height * 0.5);
      ctx.lineTo(width * 0.35, height * 0.3);
      break;
      
    case 'fit-flare':
      // Fitted top, flared skirt
      ctx.moveTo(width * 0.4, height * 0.1);
      ctx.lineTo(width * 0.6, height * 0.1);
      ctx.lineTo(width * 0.65, height * 0.5);
      ctx.lineTo(width * 0.8, height * 0.9);
      ctx.lineTo(width * 0.2, height * 0.9);
      ctx.lineTo(width * 0.35, height * 0.5);
      break;
      
    case 'a-line':
      // A-line silhouette
      ctx.moveTo(width * 0.4, height * 0.1);
      ctx.lineTo(width * 0.6, height * 0.1);
      ctx.lineTo(width * 0.75, height * 0.9);
      ctx.lineTo(width * 0.25, height * 0.9);
      break;
      
    case 'bodycon':
      // Body-hugging shape
      ctx.moveTo(width * 0.42, height * 0.1);
      ctx.lineTo(width * 0.58, height * 0.1);
      ctx.lineTo(width * 0.6, height * 0.4);
      ctx.lineTo(width * 0.58, height * 0.6);
      ctx.lineTo(width * 0.6, height * 0.9);
      ctx.lineTo(width * 0.4, height * 0.9);
      ctx.lineTo(width * 0.42, height * 0.6);
      ctx.lineTo(width * 0.4, height * 0.4);
      break;
      
    case 'empire':
      // High waistline
      ctx.moveTo(width * 0.4, height * 0.1);
      ctx.lineTo(width * 0.6, height * 0.1);
      ctx.lineTo(width * 0.62, height * 0.25);
      ctx.lineTo(width * 0.75, height * 0.9);
      ctx.lineTo(width * 0.25, height * 0.9);
      ctx.lineTo(width * 0.38, height * 0.25);
      break;
      
    case 'shift':
      // Straight, loose fit
      ctx.moveTo(width * 0.35, height * 0.1);
      ctx.lineTo(width * 0.65, height * 0.1);
      ctx.lineTo(width * 0.68, height * 0.9);
      ctx.lineTo(width * 0.32, height * 0.9);
      break;
      
    default:
      // Default dress shape
      ctx.moveTo(width * 0.4, height * 0.1);
      ctx.lineTo(width * 0.6, height * 0.1);
      ctx.lineTo(width * 0.7, height * 0.9);
      ctx.lineTo(width * 0.3, height * 0.9);
  }
  
  ctx.closePath();
  ctx.fill();
}

async function generatePlaceholders() {
  const outputDir = path.join(process.cwd(), 'public', 'dresses');
  
  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  for (const dress of dresses) {
    const canvas = createCanvas(400, 600);
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Generate dress shape
    generateDressShape(ctx, canvas.width, canvas.height, dress.style, dress.color);
    
    // Add some simple details
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillRect(canvas.width * 0.4, canvas.height * 0.15, canvas.width * 0.2, canvas.height * 0.1);
    
    // Save as PNG
    const buffer = canvas.toBuffer('image/png');
    const fileName = `${dress.name}.png`;
    const filePath = path.join(outputDir, fileName);
    
    fs.writeFileSync(filePath, buffer);
    console.log(`Generated: ${fileName}`);
  }
  
  console.log(`\nGenerated ${dresses.length} dress placeholders in ${outputDir}`);
}

// Only run if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  generatePlaceholders().catch(console.error);
}

export { generatePlaceholders };
