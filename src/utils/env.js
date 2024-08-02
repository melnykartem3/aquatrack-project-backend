import 'dotenv/config';

const env = (key, defaultValue) => process.env[key] || defaultValue;

export default env;
