import { findUserByEmail } from "./user.service.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function loginUser(email, password) {
  const user = await findUserByEmail(email);
  
  if (!user) {
    throw new Error("Credenciales inválidas");
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  
  if (!isValidPassword) {
    throw new Error("Credenciales inválidas");
  }

  // Crear token JWT
  const token = jwt.sign(
    { 
      sub: user.id, 
      email: user.email 
    },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      created_at: user.created_at
    }
  };
}