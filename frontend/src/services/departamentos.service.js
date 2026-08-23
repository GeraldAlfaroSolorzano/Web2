import { API_URL } from "../config/api.js";

async function procesarRespuesta(respuesta) {
  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(datos.mensaje || "Ocurrio un error en la solicitud");
  }

  return datos;
}

export async function obtenerDepartamentos() {
  const respuesta = await fetch(`${API_URL}/departamentos`, {
    method: "GET",
    credentials: "include",
  });

  return procesarRespuesta(respuesta);
}

export async function obtenerDepartamento(departamentoId) {
  const respuesta = await fetch(
    `${API_URL}/departamentos/${departamentoId}`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  return procesarRespuesta(respuesta);
}

export async function registrarDepartamento(datosDepartamento) {
  const respuesta = await fetch(`${API_URL}/departamentos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(datosDepartamento),
  });

  return procesarRespuesta(respuesta);
}

export async function actualizarDepartamento(
  departamentoId,
  datosDepartamento,
) {
  const respuesta = await fetch(
    `${API_URL}/departamentos/${departamentoId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(datosDepartamento),
    },
  );

  return procesarRespuesta(respuesta);
}

export async function eliminarDepartamento(departamentoId) {
  const respuesta = await fetch(
    `${API_URL}/departamentos/${departamentoId}`,
    {
      method: "DELETE",
      credentials: "include",
    },
  );

  return procesarRespuesta(respuesta);
}