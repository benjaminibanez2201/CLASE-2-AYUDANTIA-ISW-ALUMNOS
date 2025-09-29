import { AppDataSource } from "../config/configDB.js";
import { User } from "../entities/user.entity.js";
import bcrypt from "bcrypt";

const userRepository = AppDataSource.getRepository(User);

export async function createUser(data) {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  const newUser = userRepository.create({
    email: data.email,
    password: hashedPassword,
  });

  return await userRepository.save(newUser);
}

export async function findUserByEmail(email) {
  return await userRepository.findOneBy({ email });
}

export async function findUserById(id) {
  return await userRepository.findOneBy({ id });
}

export async function updateUser(id, data) {
  const user = await findUserById(id);
  if (!user) {
    throw new Error("Usuario no encontrado");
  }

  const updateData = {};
  
  if (data.email) {
    updateData.email = data.email;
  }
  
  if (data.password) {
    updateData.password = await bcrypt.hash(data.password, 10);
  }

  await userRepository.update(id, updateData);
  
  // Retornar el usuario actualizado
  return await findUserById(id);
}

export async function deleteUser(id) {
  const user = await findUserById(id);
  if (!user) {
    throw new Error("Usuario no encontrado");
  }

  return await userRepository.delete(id);
}