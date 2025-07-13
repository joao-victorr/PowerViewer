import bcrypt from "bcrypt";

export function hash(password: string) {
  return bcrypt.hash(password, 8);
}

export function compare(password: string, hashed: string) {
  return bcrypt.compare(password, hashed);
}
