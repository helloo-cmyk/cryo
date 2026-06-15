const { Jimp } = require('jimp');

async function main() {
  const image = await Jimp.read('d:/cryo/assets/images/cryo-logo.png');
  
  const width = image.bitmap.width;
  const height = image.bitmap.height;
  
  let splitY = Math.floor(height / 2);
  let emptyRows = [];
  
  for (let y = 0; y < height; y++) {
    let rowEmpty = true;
    for (let x = 0; x < width; x++) {
      let color = image.getPixelColor(x, y);
      let a = color & 0xff; 
      if (a > 10) {
        rowEmpty = false;
        break;
      }
    }
    if (rowEmpty) {
      emptyRows.push(y);
    }
  }
  
  if (emptyRows.length > 0) {
    let gaps = [];
    let currentGap = [];
    for (let y of emptyRows) {
      if (currentGap.length === 0 || y === currentGap[currentGap.length - 1] + 1) {
        currentGap.push(y);
      } else {
        gaps.push(currentGap);
        currentGap = [y];
      }
    }
    if (currentGap.length > 0) gaps.push(currentGap);
    
    // We expect two major gaps (after icon, and after CRYO). 
    // Let's filter out gaps that are very small (e.g. < 5px).
    gaps = gaps.filter(g => g.length > 3 && g[0] > 10 && g[g.length-1] < height - 10);
    
    // The first gap should be the one after the icon!
    if (gaps.length > 0) {
      splitY = gaps[0][Math.floor(gaps[0].length / 2)];
    }
  } else {
    splitY = Math.min(width, height - 10);
  }
  
  const icon = image.clone().crop({ x: 0, y: 0, w: width, h: splitY }).autocrop();
  const text = image.clone().crop({ x: 0, y: splitY, w: width, h: height - splitY }).autocrop();
  
  // Scale the icon to better match the text size
  // Let's make the icon height 1.75x the text height for a balanced look
  const targetIconHeight = Math.floor(text.bitmap.height * 1.75);
  const targetIconWidth = Math.floor(icon.bitmap.width * (targetIconHeight / icon.bitmap.height));
  icon.resize({ w: targetIconWidth, h: targetIconHeight });
  
  const gap = 20; // 20px gap
  const newWidth = icon.bitmap.width + gap + text.bitmap.width;
  const newHeight = Math.max(icon.bitmap.height, text.bitmap.height);
  
  const newImage = new Jimp({ width: newWidth, height: newHeight, color: 0x00000000 });
  
  const iconY = Math.floor((newHeight - icon.bitmap.height) / 2);
  newImage.composite(icon, 0, iconY);
  
  const textY = Math.floor((newHeight - text.bitmap.height) / 2);
  newImage.composite(text, icon.bitmap.width + gap, textY);
  
  await newImage.write('d:/cryo/assets/images/cryo-logo-horizontal.png');
  console.log("Success! Created scaled cryo-logo-horizontal.png");
}

main().catch(console.error);
