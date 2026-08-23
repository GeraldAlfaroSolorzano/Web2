import { API_URL } from "../config/api.js";

async function procesarRespuesta(respuesta) {
  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(datos.mensaje || "Ocurrio un error en la solicitud");
  }

  return datos;
}

function crearParametros(filtros) {
  const parametros = new URLSearchParams();

  if (filtros.usuario) {
    parametros.append("usuario", filtros.usuario);
  }

  if (filtros.anio) {
    parametros.append("anio", filtros.anio);
  }

  if (filtros.mes) {
    parametros.append("mes", filtros.mes);
  }

  if (filtros.dia) {
    parametros.append("dia", filtros.dia);
  }

  if (filtros.departamento_id) {
    parametros.append(
      "departamento_id",
      filtros.departamento_id,
    );
  }

  return parametros.toString();
}

export async function obtenerReporteMarcas(filtros) {
  const parametros = crearParametros(filtros);

  const respuesta = await fetch(
    `${API_URL}/reportes/marcas?${parametros}`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  return procesarRespuesta(respuesta);
}

export async function exportarReporteMarcas(filtros, formato) {
  const parametros = crearParametros(filtros);

  const respuesta = await fetch(
    `${API_URL}/reportes/marcas/exportar/${formato}?${parametros}`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  if (!respuesta.ok) {
    const datos = await respuesta.json();

    throw new Error(
      datos.mensaje || "No se pudo exportar el reporte",
    );
  }

  return respuesta.blob();
}