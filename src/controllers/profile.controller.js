import { handleSuccess, handleErrorClient } from "../Handlers/responseHandlers.js";
import { updateUser, deleteUser, findUserById } from "../services/user.service.js";

export function getPublicProfile(req, res) {
  handleSuccess(res, 200, "Perfil público obtenido exitosamente", {
    message: "¡Hola! Este es un perfil público. Cualquiera puede verlo.",
  });
}

export function getPrivateProfile(req, res) {
  const user = req.user;

  handleSuccess(res, 200, "Perfil privado obtenido exitosamente", {
    message: `¡Hola, ${user.email}! Este es tu perfil privado. Solo tú puedes verlo.`,
    userData: user,
  });
}

export async function updateProfile(req, res) {
  try {
    const userId = req.user.sub; // Viene del token JWT
    const { email, password } = req.body;

    if (!email && !password) {
      return handleErrorClient(
        res,
        400,
        "Debes enviar email y/o contraseña para actualizar"
      );
    }

    const updatedUser = await updateUser(userId, { email, password });
    
    // Eliminar la contraseña del objeto de respuesta
    const userResponse = { ...updatedUser };
    delete userResponse.password;

    handleSuccess(res, 200, "Perfil actualizado con éxito", userResponse);
  } catch (error) {
    if (error.message === "Usuario no encontrado") {
      return handleErrorClient(res, 404, error.message);
    }
    if (error.code === '23505') { // Violación de unique constraint (email duplicado)
      return handleErrorClient(res, 409, "El email ya está en uso");
    }
    handleErrorClient(res, 400, error.message);
  }
}

export async function deleteProfile(req, res) {
  try {
    const userId = req.user.sub; // Viene del token JWT
    await deleteUser(userId);

    handleSuccess(res, 200, "Perfil eliminado con éxito");
  } catch (error) {
    if (error.message === "Usuario no encontrado") {
      return handleErrorClient(res, 404, error.message);
    }
    handleErrorClient(res, 400, error.message);
  }
}