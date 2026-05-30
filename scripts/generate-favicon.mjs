import { readFileSync, writeFileSync } from "node:fs";
import sharp from "sharp";

const source = new URL("../public/market-snap-favicon.png", import.meta.url);
const transparentSource = new URL("../public/market-snap-favicon-transparent.png", import.meta.url);
const favicon = new URL("../app/favicon.ico", import.meta.url);
const appIcon = new URL("../app/icon.png", import.meta.url);
const sizes = [16, 32, 48, 64, 128, 256];

const sourceBuffer = readFileSync(source);
const transparentBuffer = await removeWhiteBackground(sourceBuffer);
writeFileSync(transparentSource, transparentBuffer);

const pngEntries = await Promise.all(sizes.map((size) => resizePng(transparentBuffer, size)));
writeFileSync(favicon, encodeIco(pngEntries));

const largeIcon = await sharp(transparentBuffer)
  .resize(512, 512, { fit: "contain" })
  .ensureAlpha()
  .png()
  .toBuffer();
writeFileSync(appIcon, largeIcon);

async function resizePng(buffer, size) {
  const png = await sharp(buffer)
    .resize(size, size, { fit: "cover" })
    .ensureAlpha()
    .png()
    .toBuffer();
  return { size, png };
}

async function removeWhiteBackground(buffer) {
  const image = sharp(buffer).ensureAlpha();
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;

  for (let i = 0; i < data.length; i += 4) {
    const red = data[i];
    const green = data[i + 1];
    const blue = data[i + 2];
    const max = Math.max(red, green, blue);
    const min = Math.min(red, green, blue);
    const isNeutralBright = max > 208 && max - min < 38;
    const isSoftWhiteHalo = red > 226 && green > 226 && blue > 226;

    if (isNeutralBright || isSoftWhiteHalo) {
      data[i + 3] = 0;
    }
  }

  return sharp(data, { raw: { width, height, channels: 4 } }).png().toBuffer();
}

function encodeIco(entries) {
  const headerSize = 6 + entries.length * 16;
  const totalSize = headerSize + entries.reduce((sum, item) => sum + item.png.length, 0);
  const ico = Buffer.alloc(totalSize);
  let offset = headerSize;

  ico.writeUInt16LE(0, 0);
  ico.writeUInt16LE(1, 2);
  ico.writeUInt16LE(entries.length, 4);

  entries.forEach((entry, index) => {
    const cursor = 6 + index * 16;
    ico[cursor] = entry.size === 256 ? 0 : entry.size;
    ico[cursor + 1] = entry.size === 256 ? 0 : entry.size;
    ico[cursor + 2] = 0;
    ico[cursor + 3] = 0;
    ico.writeUInt16LE(1, cursor + 4);
    ico.writeUInt16LE(32, cursor + 6);
    ico.writeUInt32LE(entry.png.length, cursor + 8);
    ico.writeUInt32LE(offset, cursor + 12);
    entry.png.copy(ico, offset);
    offset += entry.png.length;
  });

  return ico;
}
