#!/usr/bin/env python3
"""
Create placeholder dress images for the demo.
This script generates transparent PNG images with dress-like shapes.
"""

import os
from PIL import Image, ImageDraw

def create_dress_image(width, height, dress_type, color, filename):
    """Create a simple dress shape as a transparent PNG."""
    # Create image with transparent background
    img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    if dress_type == "a-line":
        # A-line dress shape
        points = [
            (width//2 - 50, 50),    # Top left shoulder
            (width//2 + 50, 50),    # Top right shoulder
            (width//2 + 40, 200),   # Right waist
            (width//2 + 80, height-50),  # Right hem
            (width//2 - 80, height-50),  # Left hem
            (width//2 - 40, 200),   # Left waist
        ]
        draw.polygon(points, fill=color + (180,))  # Semi-transparent
        
    elif dress_type == "bodycon":
        # Bodycon dress shape
        points = [
            (width//2 - 45, 50),    # Top left shoulder
            (width//2 + 45, 50),    # Top right shoulder
            (width//2 + 35, 200),   # Right waist
            (width//2 + 40, height-50),  # Right hem
            (width//2 - 40, height-50),  # Left hem
            (width//2 - 35, 200),   # Left waist
        ]
        draw.polygon(points, fill=color + (180,))
        
    elif dress_type == "shift":
        # Straight shift dress
        points = [
            (width//2 - 50, 50),    # Top left shoulder
            (width//2 + 50, 50),    # Top right shoulder
            (width//2 + 50, height-50),  # Right hem
            (width//2 - 50, height-50),  # Left hem
        ]
        draw.polygon(points, fill=color + (180,))
        
    elif dress_type == "wrap":
        # Wrap dress with asymmetric neckline
        points = [
            (width//2 - 40, 50),    # Top left
            (width//2 + 50, 80),    # Top right (lower)
            (width//2 + 45, 200),   # Right waist
            (width//2 + 75, height-50),  # Right hem
            (width//2 - 75, height-50),  # Left hem
            (width//2 - 45, 200),   # Left waist
        ]
        draw.polygon(points, fill=color + (180,))
        
    elif dress_type == "fit-flare":
        # Fit and flare dress
        points = [
            (width//2 - 45, 50),    # Top left shoulder
            (width//2 + 45, 50),    # Top right shoulder
            (width//2 + 35, 180),   # Right waist (fitted)
            (width//2 + 90, height-50),  # Right hem (flared)
            (width//2 - 90, height-50),  # Left hem (flared)
            (width//2 - 35, 180),   # Left waist (fitted)
        ]
        draw.polygon(points, fill=color + (180,))
    
    # Add some simple details
    # Neckline
    draw.ellipse([width//2-25, 45, width//2+25, 70], fill=(255, 255, 255, 100))
    
    # Save the image
    img.save(filename, 'PNG')
    print(f"Created {filename}")

def main():
    """Create placeholder dress images."""
    # Create dresses directory
    os.makedirs('public/dresses', exist_ok=True)
    
    # Define dress styles and colors
    dresses = [
        # A-line dresses (good for pear, apple)
        ("a-line", (255, 100, 100), "a-line-red.png"),
        ("a-line", (100, 150, 255), "a-line-blue.png"),
        ("a-line", (100, 200, 100), "a-line-green.png"),
        
        # Bodycon dresses (good for hourglass)
        ("bodycon", (200, 100, 200), "bodycon-purple.png"),
        ("bodycon", (50, 50, 50), "bodycon-black.png"),
        
        # Shift dresses (good for rectangle)
        ("shift", (255, 200, 100), "shift-yellow.png"),
        ("shift", (150, 200, 255), "shift-lightblue.png"),
        
        # Wrap dresses (good for apple, pear)
        ("wrap", (200, 150, 100), "wrap-brown.png"),
        ("wrap", (150, 100, 150), "wrap-mauve.png"),
        
        # Fit and flare (good for inverted triangle)
        ("fit-flare", (255, 150, 150), "fit-flare-pink.png"),
        ("fit-flare", (100, 255, 200), "fit-flare-mint.png"),
    ]
    
    # Create each dress image
    for dress_type, color, filename in dresses:
        create_dress_image(200, 400, dress_type, color, f"public/dresses/{filename}")
    
    print(f"\nCreated {len(dresses)} placeholder dress images in public/dresses/")

if __name__ == "__main__":
    main()
