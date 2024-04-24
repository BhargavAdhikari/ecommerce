import bcrypt from "bcrypt";

export const generateHashPassword = async (plainPassword) => {
  const saltRounds = 10;
  const hashPassword = await bcrypt.hash(plainPassword, saltRounds);

  return hashPassword;
};

export const comparePassword = async (plainPassword, hashPassword) => {
  const isPasswordMatch = await bcrypt.compare(plainPassword, hashPassword);

  return isPasswordMatch;
};
