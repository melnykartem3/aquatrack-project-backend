import bcrypt from 'bcrypt';

export const hashValue = async (value) => {
  const hashPassword = await bcrypt.hash(value, 10);
  return hashPassword;
};

export const compareValue = (value, hash) => bcrypt.compare(value, hash);
