import fs from 'fs';
import path from 'path';

// Let's copy the uploaded file to public/
const srcPath = 'C:/Users/Amal/.gemini/antigravity/brain/a606e07b-4a7c-44de-be52-c39101b479cf/.user_uploaded/media_1788054130533.png';
const targetDir = './public';
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

fs.copyFileSync(srcPath, path.join(targetDir, 'dinerato-logo-original.png'));
console.log('Copied original logo to public/dinerato-logo-original.png');
