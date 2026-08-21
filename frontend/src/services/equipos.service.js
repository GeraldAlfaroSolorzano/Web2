import { API_URL } from '../config/api.js';


async function procesarRespuesta(respuesta) {
    const datos = await respuesta.json();

    if (!respuesta.ok) {
        throw new Error(
            datos.mensaje || 'Ocurrio un error en la solicitud'
        );
    }

    return datos;
}


export async function obtenerEquipos() {
    const respuesta = await fetch(
        `${API_URL}/equipos`,
        {
            method: 'GET',
            credentials: 'include'
        }
    );

    return procesarRespuesta(respuesta);
}


export async function obtenerEquipo(equipoId) {
    const respuesta = await fetch(
        `${API_URL}/equipos/${equipoId}`,
        {
            method: 'GET',
            credentials: 'include'
        }
    );

    return procesarRespuesta(respuesta);
}


export async function registrarEquipo(datosEquipo) {
    const formulario = new FormData();

    formulario.append(
        'codigo',
        datosEquipo.codigo
    );

    formulario.append(
        'descripcion',
        datosEquipo.descripcion
    );

    formulario.append(
        'estado',
        datosEquipo.estado
    );

    formulario.append(
        'imagen',
        datosEquipo.imagen
    );

    const respuesta = await fetch(
        `${API_URL}/equipos`,
        {
            method: 'POST',
            credentials: 'include',
            body: formulario
        }
    );

    return procesarRespuesta(respuesta);
}


export async function actualizarEquipo(
    equipoId,
    datosEquipo
) {
    const formulario = new FormData();

    formulario.append(
        'codigo',
        datosEquipo.codigo
    );

    formulario.append(
        'descripcion',
        datosEquipo.descripcion
    );

    formulario.append(
        'estado',
        datosEquipo.estado
    );

    if (datosEquipo.imagen) {
        formulario.append(
            'imagen',
            datosEquipo.imagen
        );
    }

    const respuesta = await fetch(
        `${API_URL}/equipos/${equipoId}`,
        {
            method: 'PUT',
            credentials: 'include',
            body: formulario
        }
    );

    return procesarRespuesta(respuesta);
}


export async function cambiarEstadoEquipo(
    equipoId,
    estado
) {
    const respuesta = await fetch(
        `${API_URL}/equipos/${equipoId}/estado`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                estado
            })
        }
    );

    return procesarRespuesta(respuesta);
}


export async function eliminarEquipo(equipoId) {
    const respuesta = await fetch(
        `${API_URL}/equipos/${equipoId}`,
        {
            method: 'DELETE',
            credentials: 'include'
        }
    );

    return procesarRespuesta(respuesta);
}