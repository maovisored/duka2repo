import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "duka2_secret";

/* ===================== */
/* GENERATE TOKEN */
/* ===================== */
export function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      phone: user.phone,
      role: user.role,
    },
    SECRET,
    {
      expiresIn: "7d",
    }
  );
}

/* ===================== */
/* VERIFY TOKEN (UTILITY) */
/* ===================== */
export function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch (err) {
    return null;
  }
}