const { Jimp } = require('jimp');
const path = require('path');

const inputPath = path.join(__dirname, 'images', 'worker_green.png');
const outputPath = path.join(__dirname, 'images', 'worker_cutout.png');

function isGreen(r, g, b) {
  // Relaxed green keying
  return (g > 150 && r < 120 && b < 120) || (g > 180 && r < 140 && b < 140) || (g > 100 && r < 50 && b < 50);
}

async function processImage() {
  console.log("Loading image...");
  const image = await Jimp.read(inputPath);
  
  console.log("Processing pixels...");
  image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
    var r = this.bitmap.data[idx + 0];
    var g = this.bitmap.data[idx + 1];
    var b = this.bitmap.data[idx + 2];

    if (isGreen(r, g, b)) {
      this.bitmap.data[idx + 3] = 0; 
    }
  });

  console.log("Saving image...");
  await image.write(outputPath);
  console.log("Done!");
}

processImage().catch(console.error);
