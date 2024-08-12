import fs from 'node:fs/promises';
import path from 'node:path';


import { PUBLIC_DIR } from '../constants/index.js';
import env from './env.js';


export const saveFileToPublicDir = async (file, filePath) => {
    const newPath = path.join(PUBLIC_DIR, filePath, file.filename);
    await fs.rename(file.path, newPath);

    return `${env('APP_DOMAIN')}/src/public/${filePath}/${file.filename}`;
};
