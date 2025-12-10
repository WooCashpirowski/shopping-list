// Script to generate PWA icons from SVG
// Requires: npm install sharp --save-dev

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 },
  { name: 'apple-icon.png', size: 180 },
];

const svgPath = path.join(__dirname, '..', 'public', 'icon.svg');
const publicPath = path.join(__dirname, '..', 'public');

async function generateIcons() {
  const svgBuffer = fs.readFileSync(svgPath);
  
  for (const { name, size } of sizes) {
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(path.join(publicPath, name));
    
    console.log(`✅ Generated ${name} (${size}x${size})`);
  }
  
  console.log('\n🎉 All icons generated successfully!');
}

generateIcons().catch(console.error);
