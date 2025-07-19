#!/usr/bin/env node
/**
 * Create dress data and copy placeholder images
 */

import fs from 'fs';
import path from 'path';

// Create dresses directory
const dressesDir = './public/dresses';
if (!fs.existsSync(dressesDir)) {
  fs.mkdirSync(dressesDir, { recursive: true });
}

// Create a simple SVG placeholder dress
function createSVGDress(color, style, filename) {
  let svgContent;
  
  switch (style) {
    case 'a-line':
      svgContent = `<svg width="200" height="400" xmlns="http://www.w3.org/2000/svg">
        <polygon points="75,50 125,50 135,200 165,350 35,350 65,200" 
                 fill="${color}" 
                 fill-opacity="0.8" 
                 stroke="#333" 
                 stroke-width="2"/>
        <ellipse cx="100" cy="60" rx="25" ry="15" fill="white" fill-opacity="0.3"/>
      </svg>`;
      break;
      
    case 'bodycon':
      svgContent = `<svg width="200" height="400" xmlns="http://www.w3.org/2000/svg">
        <polygon points="80,50 120,50 110,200 115,350 85,350 90,200" 
                 fill="${color}" 
                 fill-opacity="0.8" 
                 stroke="#333" 
                 stroke-width="2"/>
        <ellipse cx="100" cy="60" rx="25" ry="15" fill="white" fill-opacity="0.3"/>
      </svg>`;
      break;
      
    case 'shift':
      svgContent = `<svg width="200" height="400" xmlns="http://www.w3.org/2000/svg">
        <rect x="75" y="50" width="50" height="300" 
              fill="${color}" 
              fill-opacity="0.8" 
              stroke="#333" 
              stroke-width="2"/>
        <ellipse cx="100" cy="60" rx="25" ry="15" fill="white" fill-opacity="0.3"/>
      </svg>`;
      break;
      
    case 'wrap':
      svgContent = `<svg width="200" height="400" xmlns="http://www.w3.org/2000/svg">
        <polygon points="85,50 125,80 120,200 150,350 50,350 80,200" 
                 fill="${color}" 
                 fill-opacity="0.8" 
                 stroke="#333" 
                 stroke-width="2"/>
        <ellipse cx="100" cy="65" rx="25" ry="15" fill="white" fill-opacity="0.3"/>
      </svg>`;
      break;
      
    case 'fit-flare':
      svgContent = `<svg width="200" height="400" xmlns="http://www.w3.org/2000/svg">
        <polygon points="80,50 120,50 110,180 170,350 30,350 90,180" 
                 fill="${color}" 
                 fill-opacity="0.8" 
                 stroke="#333" 
                 stroke-width="2"/>
        <ellipse cx="100" cy="60" rx="25" ry="15" fill="white" fill-opacity="0.3"/>
      </svg>`;
      break;
      
    default:
      svgContent = `<svg width="200" height="400" xmlns="http://www.w3.org/2000/svg">
        <rect x="75" y="50" width="50" height="300" 
              fill="${color}" 
              fill-opacity="0.8" 
              stroke="#333" 
              stroke-width="2"/>
      </svg>`;
  }
  
  fs.writeFileSync(path.join(dressesDir, filename), svgContent);
  console.log(`Created ${filename}`);
}

// Create dress images
const dresses = [
  // A-line dresses (good for pear, apple)
  { style: 'a-line', color: '#ff6464', filename: 'a-line-red.svg' },
  { style: 'a-line', color: '#6496ff', filename: 'a-line-blue.svg' },
  { style: 'a-line', color: '#64c864', filename: 'a-line-green.svg' },
  
  // Bodycon dresses (good for hourglass)
  { style: 'bodycon', color: '#c864c8', filename: 'bodycon-purple.svg' },
  { style: 'bodycon', color: '#323232', filename: 'bodycon-black.svg' },
  
  // Shift dresses (good for rectangle)
  { style: 'shift', color: '#ffc864', filename: 'shift-yellow.svg' },
  { style: 'shift', color: '#96c8ff', filename: 'shift-lightblue.svg' },
  
  // Wrap dresses (good for apple, pear)
  { style: 'wrap', color: '#c89664', filename: 'wrap-brown.svg' },
  { style: 'wrap', color: '#966496', filename: 'wrap-mauve.svg' },
  
  // Fit and flare (good for inverted triangle)
  { style: 'fit-flare', color: '#ff9696', filename: 'fit-flare-pink.svg' },
  { style: 'fit-flare', color: '#64ffc8', filename: 'fit-flare-mint.svg' },
];

// Generate all dress images
dresses.forEach(dress => {
  createSVGDress(dress.color, dress.style, dress.filename);
});

console.log(`\nCreated ${dresses.length} placeholder dress images in public/dresses/`);
console.log('\nNote: These are SVG placeholders. In a production app, you would use:');
console.log('- High-quality PNG images with transparent backgrounds');
console.log('- Proper dress photography or 3D models');
console.log('- Images sized consistently (e.g., 400x600px)');
