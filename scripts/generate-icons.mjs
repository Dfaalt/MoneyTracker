import fs from "fs";
import path from "path";
import sharp from "sharp";

const publicDir = path.resolve("public");
const iconsDir = path.join(publicDir, "icons");

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

async function generate() {
  const sourceImagePath = path.join(iconsDir, "wallet.png");

  if (!fs.existsSync(sourceImagePath)) {
    console.error("❌ Source image not found at:", sourceImagePath);
    process.exit(1);
  }

  console.log("🖼️ Found source image at:", sourceImagePath);
  const metadata = await sharp(sourceImagePath).metadata();
  console.log(
    `Dimensions: ${metadata.width}x${metadata.height}, format: ${metadata.format}`,
  );

  // Base image buffer
  const baseSharp = sharp(sourceImagePath);

  // 1. Generate 512x512
  await sharp(sourceImagePath)
    .resize(512, 512, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toFile(path.join(iconsDir, "pwa-512x512.png"));

  // 2. Generate 192x192
  await sharp(sourceImagePath)
    .resize(192, 192, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toFile(path.join(iconsDir, "pwa-192x192.png"));

  // 3. Generate 64x64
  await sharp(sourceImagePath)
    .resize(64, 64, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toFile(path.join(iconsDir, "pwa-64x64.png"));

  // 4. Generate apple-touch-icon (180x180)
  await sharp(sourceImagePath)
    .resize(180, 180, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toFile(path.join(publicDir, "apple-touch-icon.png"));

  // 5. Generate Maskable Icon (512x512 with dark theme background & 75% safe-zone margin)
  const innerIconSize = Math.round(512 * 0.72); // 368px
  const innerBuffer = await sharp(sourceImagePath)
    .resize(innerIconSize, innerIconSize, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .toBuffer();

  await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 11, g: 15, b: 23, alpha: 1 }, // Matches app theme #0B0F17
    },
  })
    .composite([
      {
        input: innerBuffer,
        gravity: "center",
      },
    ])
    .png()
    .toFile(path.join(iconsDir, "maskable-icon-512x512.png"));

  // 6. Generate SVG favicon with embedded high-res PNG for browsers
  const base64Data = (
    await sharp(sourceImagePath)
      .resize(128, 128, { fit: "contain" })
      .png()
      .toBuffer()
  ).toString("base64");
  const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
  <image href="data:image/png;base64,${base64Data}" width="128" height="128"/>
</svg>`;
  fs.writeFileSync(path.join(publicDir, "favicon.svg"), faviconSvg.trim());

  console.log("✅ All PWA icons successfully generated from wallet.png!");
}

generate().catch(console.error);
