import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET || "dev-secret";

// payload precisa ser um objeto que tenha, no mínimo, `sub`
export function signToken(
  payload: { sub: string },
  expiresIn?: number | `${number}${'s' | 'm' | 'h' | 'd'}` // exemplos: 60, '1h', '7d'
) {
  return jwt.sign(payload, secret, expiresIn ? { expiresIn } : undefined );
}

export function verifyToken(token: string) {
  return jwt.verify(token, secret) as { sub: string; iat: number; exp: number };
}
