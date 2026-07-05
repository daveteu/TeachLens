import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const iconSource = "/Users/daveteu/Downloads/TeachLens Branding (1).png";
const logoSource = "/Users/daveteu/Downloads/TeachLens Branding (2).png";
const outputDir = path.join(process.cwd(), "public", "brand");

function isBackground(pixel) {
  const [r, g, b, a] = pixel;
  if (a < 8) return true;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const saturation = max - min;

  return r > 210 && g > 220 && b > 230 && saturation < 35;
}

function alphaAt(data, index) {
  return data[index + 3];
}

async function transparentTrim(input, output, options) {
  const {
    width: targetWidth,
    height: targetHeight,
    square = false,
    padRatio = 0.08
  } = options;
  const image = sharp(input).ensureAlpha();
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  const visited = new Uint8Array(width * height);
  const queue = [];
  const enqueue = (x, y) => {
    if (x < 0 || x >= width || y < 0 || y >= height) return;
    const id = y * width + x;
    if (visited[id]) return;
    const offset = id * channels;
    const pixel = [data[offset], data[offset + 1], data[offset + 2], data[offset + 3]];
    if (!isBackground(pixel)) return;
    visited[id] = 1;
    queue.push(id);
  };

  for (let x = 0; x < width; x += 1) {
    enqueue(x, 0);
    enqueue(x, height - 1);
  }

  for (let y = 0; y < height; y += 1) {
    enqueue(0, y);
    enqueue(width - 1, y);
  }

  for (let i = 0; i < queue.length; i += 1) {
    const id = queue[i];
    const x = id % width;
    const y = Math.floor(id / width);
    enqueue(x + 1, y);
    enqueue(x - 1, y);
    enqueue(x, y + 1);
    enqueue(x, y - 1);
  }

  for (let id = 0; id < visited.length; id += 1) {
    if (visited[id]) {
      data[id * channels + 3] = 0;
    }
  }

  for (let y = Math.floor(height * 0.78); y < height; y += 1) {
    for (let x = Math.floor(width * 0.68); x < width; x += 1) {
      data[(y * width + x) * channels + 3] = 0;
    }
  }

  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const offset = (y * width + x) * channels;
      if (alphaAt(data, offset) > 8) {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }

  if (maxX < minX || maxY < minY) {
    throw new Error(`No visible pixels found in ${input}`);
  }

  const pad = Math.round(Math.max(maxX - minX, maxY - minY) * padRatio);
  const left = Math.max(0, minX - pad);
  const top = Math.max(0, minY - pad);
  const right = Math.min(width - 1, maxX + pad);
  const bottom = Math.min(height - 1, maxY + pad);

  await sharp(data, { raw: { width, height, channels } })
    .extract({
      left,
      top,
      width: right - left + 1,
      height: bottom - top + 1
    })
    .resize(
      square
        ? {
            width: targetWidth,
            height: targetHeight ?? targetWidth,
            fit: "contain",
            background: { r: 0, g: 0, b: 0, alpha: 0 }
          }
        : {
            width: targetWidth,
            height: targetHeight,
            fit: "contain",
            withoutEnlargement: true,
            background: { r: 0, g: 0, b: 0, alpha: 0 }
          }
    )
    .png()
    .toFile(output);
}

async function main() {
  await fs.mkdir(outputDir, { recursive: true });
  await transparentTrim(iconSource, path.join(outputDir, "teachlens-icon.png"), {
    width: 512,
    height: 512,
    square: true
  });
  await transparentTrim(logoSource, path.join(outputDir, "teachlens-horizontal-logo.png"), {
    width: 900,
    padRatio: 0.04
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
