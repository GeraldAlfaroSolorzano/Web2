import { API_URL } from "../config/api.js";

async function procesarRespuesta(respuesta) {
  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(datos.mensaje || "Ocurrio un error en la solicitud");
  }

  return datos;
}

export async function obtenerConfiguracion() {
  const respuesta = await fetch(`${API_URL}/configuracion`, {
    method: "GET",
    credentials: "include",
  });

  return procesarRespuesta(respuesta);
}

export async function actualizarConfiguracion(datosConfiguracion) {
  const respuesta = await fetch(`${API_URL}/configuracion`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(datosConfiguracion),
  });

  return procesarRespuesta(respuesta);
}