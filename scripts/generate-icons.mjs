import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const publicDir = path.resolve('public');
const iconsDir = path.join(publicDir, 'icons');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// SVG content for the main icon
const svgContent = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0F172A"/>
      <stop offset="100%" stop-color="#020617"/>
    </linearGradient>
    <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#10B981"/>
      <stop offset="100%" stop-color="#0D9488"/>
    </linearGradient>
    <linearGradient id="coinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FCD34D"/>
      <stop offset="100%" stop-color="#F59E0B"/>
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="16" flood-color="#10B981" flood-opacity="0.4"/>
    </filter>
    <filter id="coinGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#F59E0B" flood-opacity="0.5"/>
    </filter>
  </defs>

  <!-- Background Base -->
  <rect width="512" height="512" rx="112" fill="url(#bgGrad)"/>
  <rect width="510" height="510" x="1" y="1" rx="111" fill="none" stroke="#334155" stroke-width="2" stroke-opacity="0.4"/>

  <!-- Glowing Aura -->
  <circle cx="256" cy="256" r="160" fill="#10B981" opacity="0.12" filter="blur(30px)"/>

  <!-- Wallet Body -->
  <g filter="url(#glow)">
    <!-- Main Wallet Card / Bag -->
    <rect x="106" y="156" width="300" height="210" rx="36" fill="url(#cardGrad)"/>
    
    <!-- Wallet flap shadow & highlight -->
    <path d="M 106 206 C 106 178 128 156 156 156 L 356 156 C 384 156 406 178 406 206 L 406 220 L 106 220 Z" fill="#ffffff" opacity="0.15"/>
    
    <!-- Card Slot Accent Line -->
    <rect x="146" y="132" width="220" height="40" rx="12" fill="#047857" opacity="0.6"/>

    <!-- Wallet Clasp / Pocket -->
    <path d="M 286 226 L 396 226 C 401.5 226 406 230.5 406 236 L 406 286 C 406 291.5 401.5 296 396 296 L 286 296 C 266 296 250 280 250 261 C 250 241 266 226 286 226 Z" fill="#064E3B"/>
    <circle cx="296" cy="261" r="14" fill="#FCD34D" filter="url(#coinGlow)"/>
    <circle cx="296" cy="261" r="6" fill="#D97706"/>
  </g>

  <!-- Growth Spark / Upward Trend Badge -->
  <g transform="translate(140, 240)">
    <circle cx="28" cy="28" r="28" fill="#065F46" opacity="0.8"/>
    <path d="M 16 34 L 25 24 L 32 30 L 40 18" fill="none" stroke="#34D399" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M 34 18 L 40 18 L 40 24" fill="none" stroke="#34D399" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
</svg>
`;

// Maskable version with safe margins (smaller graphic in center)
const maskableSvgContent = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="mBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0F172A"/>
      <stop offset="100%" stop-color="#020617"/>
    </linearGradient>
    <linearGradient id="mCardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#10B981"/>
      <stop offset="100%" stop-color="#0D9488"/>
    </linearGradient>
    <filter id="mGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="6" stdDeviation="12" flood-color="#10B981" flood-opacity="0.4"/>
    </filter>
  </defs>

  <!-- Full bleed background for safe-zone mask -->
  <rect width="512" height="512" fill="url(#mBgGrad)"/>

  <!-- Scaled content centered within 70% safe zone -->
  <g transform="translate(76, 76) scale(0.7)" filter="url(#mGlow)">
    <rect x="106" y="156" width="300" height="210" rx="36" fill="url(#mCardGrad)"/>
    <path d="M 106 206 C 106 178 128 156 156 156 L 356 156 C 384 156 406 178 406 206 L 406 220 L 106 220 Z" fill="#ffffff" opacity="0.15"/>
    <rect x="146" y="132" width="220" height="40" rx="12" fill="#047857" opacity="0.6"/>

    <path d="M 286 226 L 396 226 C 401.5 226 406 230.5 406 236 L 406 286 C 406 291.5 401.5 296 396 296 L 286 296 C 266 296 250 280 250 261 C 250 241 266 226 286 226 Z" fill="#064E3B"/>
    <circle cx="296" cy="261" r="14" fill="#FCD34D"/>
    <circle cx="296" cy="261" r="6" fill="#D97706"/>

    <g transform="translate(140, 240)">
      <circle cx="28" cy="28" r="28" fill="#065F46" opacity="0.8"/>
      <path d="M 16 34 L 25 24 L 32 30 L 40 18" fill="none" stroke="#34D399" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M 34 18 L 40 18 L 40 24" fill="none" stroke="#34D399" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    </g>
  </g>
</svg>
`;

async function generate() {
  const svgBuffer = Buffer.from(svgContent);
  const maskableSvgBuffer = Buffer.from(maskableSvgContent);

  // Save SVG favicon
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), svgContent.trim());

  // Generate 512x512
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(iconsDir, 'pwa-512x512.png'));

  // Generate 192x192
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.join(iconsDir, 'pwa-192x192.png'));

  // Generate 64x64
  await sharp(svgBuffer)
    .resize(64, 64)
    .png()
    .toFile(path.join(iconsDir, 'pwa-64x64.png'));

  // Generate apple-touch-icon (180x180)
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));

  // Generate maskable icon (512x512)
  await sharp(maskableSvgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(iconsDir, 'maskable-icon-512x512.png'));

  console.log('✅ All PWA icons generated successfully in /public!');
}

generate().catch(console.error);
