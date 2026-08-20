import { API_URL } from "../config/api.js";

async function procesarRespuesta(respuesta) {
  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(datos.mensaje || "Ocurrio un error en la solicitud");
  }

  return datos;
}

export async function obtenerDispositivos() {
  const respuesta = await fetch(`${API_URL}/dispositivos`, {
    method: "GET",
    credentials: "include",
  });

  return procesarRespuesta(respuesta);
}

export async function obtenerDispositivo(dispositivoId) {
  const respuesta = await fetch(`${API_URL}/dispositivos/${dispositivoId}`, {
    method: "GET",
    credentials: "include",
  });

  return procesarRespuesta(respuesta);
}

export async function registrarDispositivo(datosDispositivo) {
  const respuesta = await fetch(`${API_URL}/dispositivos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(datosDispositivo),
  });

  const datos = await procesarRespuesta(respuesta);

  if (datos.datos && datos.datos.identificador) {
    localStorage.setItem(
      "identificador_dispositivo",
      datos.datos.identificador,
    );
  }

  return datos;
}

export async function cambiarEstadoDispositivo(dispositivoId, estado) {
  const respuesta = await fetch(
    `${API_URL}/dispositivos/${dispositivoId}/estado`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        estado,
      }),
    },
  );

  return procesarRespuesta(respuesta);
}

export function obtenerIdentificadorDispositivo() {
  return localStorage.getItem("identificador_dispositivo");
}

export function guardarIdentificadorDispositivo(identificador) {
  localStorage.setItem("identificador_dispositivo", identificador);
}

export async function obtenerMarcas() {
  const respuesta = await fetch(`${API_URL}/marcas`, {
    method: "GET",
    credentials: "include",
  });

  return procesarRespuesta(respuesta);
}

export async function registrarMarca() {
  const identificador = obtenerIdentificadorDispositivo();

  if (!identificador) {
    throw new Error("No hay un dispositivo registrado en este navegador");
  }

  const respuesta = await fetch(`${API_URL}/marcas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      identificador_dispositivo: identificador,
    }),
  });

  return procesarRespuesta(respuesta);
}
