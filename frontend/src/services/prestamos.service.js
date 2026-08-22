import { API_URL } from "../config/api.js";

async function procesarRespuesta(respuesta) {
  const datos = await respuesta.json();

  if (!respuesta.ok) {
    const mensaje = datos.mensaje || "Ocurrio un error";
    throw new Error(mensaje);
  }

  return datos;
}

export async function obtenerPrestamos() {
  const respuesta = await fetch(`${API_URL}/prestamos`, {
    method: "GET",
    credentials: "include",
  });

  return procesarRespuesta(respuesta);
}

export async function obtenerPrestamoPorId(id) {
  const respuesta = await fetch(`${API_URL}/prestamos/${id}`, {
    method: "GET",
    credentials: "include",
  });

  return procesarRespuesta(respuesta);
}

export async function registrarPrestamo(datosPrestamo) {
  const respuesta = await fetch(`${API_URL}/prestamos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(datosPrestamo),
  });

  return procesarRespuesta(respuesta);
}

export async function devolverEquipoPrestamo(prestamoId, detalleId) {
  const respuesta = await fetch(
    `${API_URL}/prestamos/${prestamoId}/detalle/${detalleId}/devolver`,
    {
      method: "PUT",
      credentials: "include",
    },
  );

  return procesarRespuesta(respuesta);
}

export async function devolverPrestamoCompleto(prestamoId) {
  const respuesta = await fetch(
    `${API_URL}/prestamos/${prestamoId}/devolver-completo`,
    {
      method: "PUT",
      credentials: "include",
    },
  );

  return procesarRespuesta(respuesta);
}
