import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const publicDir = path.resolve('public');
const iconsDir = path.join(publicDir, 'icons');
const sourceWalletPath = path.join(iconsDir, 'wallet.png');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

async function generate() {
  if (!fs.existsSync(sourceWalletPath)) {
    console.error(`❌ Source wallet icon not found at: ${sourceWalletPath}`);
    return;
  }

  console.log(`🖼️ Generating PWA icons from ${sourceWalletPath}...`);

  // 1. Generate 512x512 standard PWA icon
  await sharp(sourceWalletPath)
    .resize(512, 512)
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(path.join(iconsDir, 'pwa-512x512.png'));

  // 2. Generate 192x192 standard PWA icon
  await sharp(sourceWalletPath)
    .resize(192, 192)
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(path.join(iconsDir, 'pwa-192x192.png'));

  // 3. Generate 64x64 small PWA icon
  await sharp(sourceWalletPath)
    .resize(64, 64)
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(path.join(iconsDir, 'pwa-64x64.png'));

  // 4. Generate apple-touch-icon (180x180)
  await sharp(sourceWalletPath)
    .resize(180, 180)
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));

  // 5. Generate Maskable icon (512x512 with safe-zone padding and matching theme background #0B0F17)
  const innerSize = Math.round(512 * 0.72); // 72% safe zone for Android adaptive icons
  const resizedInnerBuffer = await sharp(sourceWalletPath)
    .resize(innerSize, innerSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 11, g: 15, b: 23, alpha: 1 }, // #0B0F17 dark theme
    },
  })
    .composite([
      {
        input: resizedInnerBuffer,
        top: Math.round((512 - innerSize) / 2),
        left: Math.round((512 - innerSize) / 2),
      },
    ])
    .png({ quality: 100 })
    .toFile(path.join(iconsDir, 'maskable-icon-512x512.png'));

  console.log('✅ All PWA icons (512x512, 192x192, 64x64, apple-touch-icon, maskable) generated successfully from wallet.png!');
}

generate().catch(console.error);
