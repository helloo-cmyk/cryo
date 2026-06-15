const fs = require('fs');
const path = require('path');

const files = fs.readdirSync(__dirname).filter(f => f.endsWith('.html'));

const headerPattern = /<!-- Top Bar -->[\s\S]*?<!-- Mobile Nav Overlay -->[\s\S]*?<\/div>\s*/;
const footerPattern = /<!-- Footer -->[\s\S]*?<footer[\s\S]*?<\/footer>[\s\S]*?<!-- Floating WhatsApp -->[\s\S]*?<\/a>\s*/;

for (const file of files) {
  const filePath = path.join(__dirname, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  if (content.includes('<!-- Top Bar -->')) {
    content = content.replace(headerPattern, '<site-header></site-header>\n\n  ');
  }

  if (content.includes('<!-- Footer -->')) {
    content = content.replace(footerPattern, '<site-footer></site-footer>\n\n  ');
  }

  if (!content.includes('js/components.js')) {
    content = content.replace('<script src="js/main.js"></script>', '<script src="js/components.js" defer></script>\n  <script src="js/main.js"></script>');
    if (!content.includes('js/components.js')) {
      content = content.replace('</body>', '  <script src="js/components.js" defer></script>\n</body>');
    }
  }

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
  }
}
