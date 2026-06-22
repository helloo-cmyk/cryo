const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const faviconLink = '\n  <link rel="icon" type="image/png" href="/assets/images/favicon.png">\n';

function walkDir(dir) {
    fs.readdirSync(dir).forEach(file => {
        let fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (!fullPath.includes('node_modules') && !fullPath.includes('.git')) {
                walkDir(fullPath);
            }
        } else if (fullPath.endsWith('.html')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            if (!content.includes('<link rel="icon"') && content.includes('</head>')) {
                let newContent = content.replace('</head>', `${faviconLink}</head>`);
                fs.writeFileSync(fullPath, newContent, 'utf8');
                console.log(`Updated ${fullPath}`);
            }
        }
    });
}

walkDir(rootDir);
