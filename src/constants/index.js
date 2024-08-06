import path from 'node:path';


export const emailRegexp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const genderTypeList = ['man', 'woman'];
export const ACCESS_LIFETIME = 15 * 60 * 1000;
export const REFRESH_LIFETIME = 30 * 24 * 3600 * 1000;

export const TEMP_UPLOAD_DIR = path.resolve("src", "temp");
export const PUBLIC_DIR = path.resolve("src", "public");
export const PUBLIC_PHOTO_DIR = path.resolve("src", "public", "photos");

export const SWAGGER_PATH = path.join(process.cwd(), 'docs', 'swagger.json');
