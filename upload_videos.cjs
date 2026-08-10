const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const dir = 'd:\\Web design\\Portfolio website\\imagination-studio\\public\\videos';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.mp4'));
const results = [];

for (const file of files) {
    if (file === 'hero-background.mp4' || file === 'capabilities-background.mp4' || file === '3d_visualization.mp4') continue;
    
    console.log(`Uploading ${file}...`);
    try {
        const url = execSync(`curl.exe -s -F "reqtype=fileupload" -F "fileToUpload=@${path.join(dir, file)}" "https://catbox.moe/user/api.php"`).toString().trim();
        results.push({ Name: file, Url: url });
        console.log(`Success: ${url}`);
    } catch (e) {
        console.error(`Failed ${file}:`, e.message);
    }
}

fs.writeFileSync('d:\\Web design\\Portfolio website\\imagination-studio\\catbox_results2.json', JSON.stringify(results, null, 2));
