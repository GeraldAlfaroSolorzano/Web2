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


export async function registrarUsuario(datosUsuario) {
    const respuesta = await fetch(
        `${API_URL}/usuarios/registro`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosUsuario)
        }
    );

    return procesarRespuesta(respuesta);
}


export async function iniciarSesion(datosLogin) {
    const respuesta = await fetch(
        `${API_URL}/auth/login`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(datosLogin)
        }
    );

    return procesarRespuesta(respuesta);
}


export async function cerrarSesion() {
    const respuesta = await fetch(
        `${API_URL}/auth/logout`,
        {
            method: 'POST',
            credentials: 'include'
        }
    );

    return procesarRespuesta(respuesta);
}


export async function obtenerPerfil() {
    const respuesta = await fetch(
        `${API_URL}/usuarios/perfil`,
        {
            method: 'GET',
            credentials: 'include'
        }
    );

    return procesarRespuesta(respuesta);
}


export async function actualizarPerfil(datosPerfil) {
    const respuesta = await fetch(
        `${API_URL}/usuarios/perfil`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(datosPerfil)
        }
    );

    return procesarRespuesta(respuesta);
}


export async function cambiarContrasena(datosContrasena) {
    const respuesta = await fetch(
        `${API_URL}/usuarios/contrasena`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(datosContrasena)
        }
    );

    return procesarRespuesta(respuesta);
}


export async function solicitarRecuperacion(datosRecuperacion) {
    const respuesta = await fetch(
        `${API_URL}/auth/recuperar-contrasena`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosRecuperacion)
        }
    );

    return procesarRespuesta(respuesta);
}


export async function restablecerContrasena(datosRestablecimiento) {
    const respuesta = await fetch(
        `${API_URL}/auth/restablecer-contrasena`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosRestablecimiento)
        }
    );

    return procesarRespuesta(respuesta);
}

export async function obtenerDepartamentos() {
    const respuesta = await fetch(
        `${API_URL}/departamentos`,
        {
            method: 'GET'
        }
    );

    return procesarRespuesta(respuesta);
}