import type { DressRecommendation } from '../App';

// Dress data with style descriptions
const dressDatabase = {
  hourglass: [
    {
      id: 'wrap-1',
      title: 'Classic Wrap Dress',
      style: 'wrap',
      image: '/dresses/wrap-dress-1.png',
      reason: 'Wrap dresses emphasize your natural waist and balance your proportions perfectly'
    },
    {
      id: 'fit-flare-1',
      title: 'Fit & Flare Midi',
      style: 'fit-and-flare',
      image: '/dresses/fit-flare-1.png',
      reason: 'This style highlights your waist while providing a flattering A-line silhouette'
    },
    {
      id: 'bodycon-1',
      title: 'Bodycon V-Neck',
      style: 'bodycon',
      image: '/dresses/bodycon-1.png',
      reason: 'Shows off your balanced curves with a flattering V-neckline'
    }
  ],
  pear: [
    {
      id: 'aline-1',
      title: 'A-Line Dress',
      style: 'a-line',
      image: '/dresses/aline-1.png',
      reason: 'A-line silhouette balances your proportions by emphasizing your upper body'
    },
    {
      id: 'fit-flare-2',
      title: 'Structured Fit & Flare',
      style: 'fit-and-flare',
      image: '/dresses/fit-flare-2.png',
      reason: 'Structured bodice draws attention upward while the flare flatters your hips'
    },
    {
      id: 'empire-1',
      title: 'Empire Waist Dress',
      style: 'empire',
      image: '/dresses/empire-1.png',
      reason: 'High waistline creates length and draws attention to your smallest point'
    }
  ],
  apple: [
    {
      id: 'empire-2',
      title: 'Empire Waist Maxi',
      style: 'empire',
      image: '/dresses/empire-2.png',
      reason: 'Empire waistline creates a defined waist above your midsection'
    },
    {
      id: 'shift-1',
      title: 'Shift Dress',
      style: 'shift',
      image: '/dresses/shift-1.png',
      reason: 'Loose fit with vertical lines creates a streamlined silhouette'
    },
    {
      id: 'tunic-1',
      title: 'Tunic Style Dress',
      style: 'tunic',
      image: '/dresses/tunic-1.png',
      reason: 'Gentle draping and V-neck elongate your torso beautifully'
    }
  ],
  rectangle: [
    {
      id: 'belted-1',
      title: 'Belted Sheath Dress',
      style: 'sheath',
      image: '/dresses/betled-1.png',
      reason: 'Belt creates definition at the waist to add curves to your silhouette'
    },
    {
      id: 'peplum-1',
      title: 'Peplum Dress',
      style: 'peplum',
      image: '/dresses/peplum-1.png',
      reason: 'Peplum detail adds volume at the hips to create an hourglass shape'
    },
    {
      id: 'wrap-2',
      title: 'Printed Wrap Dress',
      style: 'wrap',
      image: '/dresses/wrap-2.png',
      reason: 'Wrap style with print adds visual interest and creates waist definition'
    }
  ],
  inverted_triangle: [
    {
      id: 'aline-2',
      title: 'A-Line Midi',
      style: 'a-line',
      image: '/dresses/aline-2.png',
      reason: 'A-line skirt adds volume to your lower half to balance broad shoulders'
    },
    {
      id: 'pleated-1',
      title: 'Pleated Skirt Dress',
      style: 'pleated',
      image: '/dresses/pleated-1.png',
      reason: 'Pleated skirt creates fullness at the hips while V-neck softens shoulders'
    },
    {
      id: 'maxi-1',
      title: 'Flowing Maxi Dress',
      style: 'maxi',
      image: '/dresses/maxi-1.png',
      reason: 'Long, flowing silhouette balances your proportions beautifully'
    }
  ]
};

export function generateRecommendations(bodyType: string): DressRecommendation[] {
  const normalizedBodyType = bodyType.toLowerCase().replace(/[_\s]/g, '');
  const recommendations = dressDatabase[normalizedBodyType as keyof typeof dressDatabase];
  
  if (!recommendations) {
    // Fallback recommendations for unknown body types
    console.warn(`No recommendations found for body type: ${bodyType}, using default`);
    return [
      {
        id: 'default-1',
        title: 'Classic A-Line Dress',
        reason: 'A universally flattering style that works for most body types',
        image: '/dresses/aline-1.png'
      },
      {
        id: 'default-2', 
        title: 'Wrap Style Dress',
        reason: 'Creates a flattering silhouette with adjustable fit',
        image: '/dresses/wrap-dress-1.png'
      },
      {
        id: 'default-3',
        title: 'Fit & Flare Dress',
        reason: 'Timeless style that enhances your natural shape',
        image: '/dresses/fit-flare-1.png'
      }
    ];
  }

  return recommendations;
}

// Get detailed style advice for a body type
export function getStyleAdvice(bodyType: string): {
  what_works: string[];
  what_to_avoid: string[];
  key_features: string[];
} {
  const advice = {
    hourglass: {
      what_works: [
        'Wrap dresses and tops',
        'Fit-and-flare silhouettes', 
        'Belted styles',
        'V-necks and sweetheart necklines'
      ],
      what_to_avoid: [
        'Boxy or oversized clothing',
        'Straight-cut dresses',
        'Shapeless garments'
      ],
      key_features: [
        'Emphasize your waist',
        'Choose fitted styles',
        'Show off your balanced proportions'
      ]
    },
    pear: {
      what_works: [
        'A-line dresses',
        'Structured shoulders',
        'Interesting necklines',
        'Empire waists'
      ],
      what_to_avoid: [
        'Clingy fabrics on hips',
        'Tapered or pencil skirts',
        'Hip pockets'
      ],
      key_features: [
        'Draw attention upward',
        'Balance your proportions',
        'Emphasize your upper body'
      ]
    },
    apple: {
      what_works: [
        'Empire waistlines',
        'Vertical lines',
        'Gentle draping',
        'Deep V-necks'
      ],
      what_to_avoid: [
        'Tight-fitting waistlines',
        'Horizontal stripes',
        'Clingy fabrics at midsection'
      ],
      key_features: [
        'Create waist definition above your middle',
        'Elongate your torso',
        'Choose flowing fabrics'
      ]
    },
    rectangle: {
      what_works: [
        'Belted styles',
        'Peplum details',
        'Layering',
        'Dresses with darts'
      ],
      what_to_avoid: [
        'Straight, boxy cuts',
        'Shapeless dresses',
        'Minimal detailing'
      ],
      key_features: [
        'Create curves and definition',
        'Add visual interest',
        'Emphasize or create a waistline'
      ]
    },
    inverted_triangle: {
      what_works: [
        'A-line skirts',
        'V-necks',
        'Fuller bottoms',
        'Soft fabrics'
      ],
      what_to_avoid: [
        'Shoulder pads',
        'Boat necks',
        'Embellishments on shoulders'
      ],
      key_features: [
        'Add volume to lower body',
        'Soften your shoulder line',
        'Balance your silhouette'
      ]
    }
  };

  const normalizedBodyType = bodyType.toLowerCase().replace(/[_\s]/g, '');
  return advice[normalizedBodyType as keyof typeof advice] || advice.rectangle;
}

// Get color recommendations based on body type and skin tone (basic version)
export function getColorRecommendations(bodyType: string): {
  best_colors: string[];
  patterns: string[];
} {
  // These are general recommendations - in a full app you'd consider skin tone too
  const colorAdvice = {
    hourglass: {
      best_colors: ['Rich jewel tones', 'Deep blues', 'Emerald green', 'Classic black', 'Ruby red'],
      patterns: ['Small to medium prints', 'Vertical stripes', 'Subtle patterns']
    },
    pear: {
      best_colors: ['Bright colors on top', 'Pastels', 'Light neutrals', 'Bold jewel tones'],
      patterns: ['Patterns on upper body', 'Solid colors on bottom', 'Horizontal stripes on top']
    },
    apple: {
      best_colors: ['Monochromatic looks', 'Deep colors', 'Rich purples', 'Navy blue'],
      patterns: ['Vertical stripes', 'Small all-over prints', 'Solid colors']
    },
    rectangle: {
      best_colors: ['Bold colors', 'Bright hues', 'Contrasting colors', 'Color blocking'],
      patterns: ['Large prints', 'Geometric patterns', 'Mixed patterns']
    },
    inverted_triangle: {
      best_colors: ['Dark colors on top', 'Light colors on bottom', 'Earth tones'],
      patterns: ['Solid tops', 'Patterned bottoms', 'Vertical patterns']
    }
  };

  const normalizedBodyType = bodyType.toLowerCase().replace(/[_\s]/g, '');
  return colorAdvice[normalizedBodyType as keyof typeof colorAdvice] || colorAdvice.rectangle;
}

// Check if a dress image exists (for development)
export async function checkDressImage(imagePath: string): Promise<boolean> {
  try {
    const response = await fetch(imagePath, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}

// Generate placeholder dress if image doesn't exist
export function getPlaceholderDress(dressId: string): string {
  // Create a simple colored rectangle as placeholder
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];
  const colorIndex = dressId.charCodeAt(0) % colors.length;
  const color = colors[colorIndex];
  
  // Return a data URL with a colored rectangle
  const canvas = document.createElement('canvas');
  canvas.width = 300;
  canvas.height = 400;
  const ctx = canvas.getContext('2d');
  
  if (ctx) {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 300, 400);
    ctx.fillStyle = 'white';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Dress Placeholder', 150, 200);
  }
  
  return canvas.toDataURL();
}
