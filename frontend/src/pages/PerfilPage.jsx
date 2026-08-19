import { useEffect, useState } from 'react';

import {
    obtenerPerfil,
    actualizarPerfil,
    obtenerDepartamentos,
    cerrarSesion
} from '../services/auth.service.js';


function PerfilPage() {
    const [formulario, setFormulario] = useState({
        nombre_completo: '',
        fecha_nacimiento: '',
        correo: '',
        nombre_usuario: '',
        departamento_id: ''
    });

    const [departamentos, setDepartamentos] = useState([]);
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');
    const [cargando, setCargando] = useState(true);


    useEffect(() => {
        cargarDatos();
    }, []);


    async function cargarDatos() {
        try {
            const respuestaPerfil = await obtenerPerfil();
            const respuestaDepartamentos =
                await obtenerDepartamentos();

            const perfil = respuestaPerfil.datos;

            setFormulario({
                nombre_completo: perfil.nombre_completo,
                fecha_nacimiento: perfil.fecha_nacimiento,
                correo: perfil.correo,
                nombre_usuario: perfil.nombre_usuario,
                departamento_id: perfil.departamento_id
            });

            setDepartamentos(
                respuestaDepartamentos.datos
            );
        } catch (error) {
            setError(error.message);
        } finally {
            setCargando(false);
        }
    }


    function manejarCambio(evento) {
        const { name, value } = evento.target;

        setFormulario({
            ...formulario,
            [name]: value
        });
    }


    async function manejarEnvio(evento) {
        evento.preventDefault();

        setMensaje('');
        setError('');

        try {
            const datosPerfil = {
                nombre_completo:
                    formulario.nombre_completo,
                fecha_nacimiento:
                    formulario.fecha_nacimiento,
                departamento_id: Number(
                    formulario.departamento_id
                )
            };

            const respuesta = await actualizarPerfil(
                datosPerfil
            );

            setMensaje(respuesta.mensaje);

            const perfil = respuesta.datos;

            setFormulario({
                nombre_completo: perfil.nombre_completo,
                fecha_nacimiento: perfil.fecha_nacimiento,
                correo: perfil.correo,
                nombre_usuario: perfil.nombre_usuario,
                departamento_id: perfil.departamento_id
            });
        } catch (error) {
            setError(error.message);
        }
    }


    async function manejarCerrarSesion() {
        setMensaje('');
        setError('');

        try {
            await cerrarSesion();

            window.location.href = '/';
        } catch (error) {
            setError(error.message);
        }
    }


    function irCambiarContrasena() {
        window.location.href = '/cambiar-contrasena';
    }


    if (cargando) {
        return (
            <main>
                <p>Cargando perfil...</p>
            </main>
        );
    }


    return (
        <main>
            <h1>Mi perfil</h1>

            <form onSubmit={manejarEnvio}>
                <div>
                    <label htmlFor="nombre_completo">
                        Nombre completo
                    </label>

                    <input
                        id="nombre_completo"
                        name="nombre_completo"
                        type="text"
                        value={formulario.nombre_completo}
                        onChange={manejarCambio}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="fecha_nacimiento">
                        Fecha de nacimiento
                    </label>

                    <input
                        id="fecha_nacimiento"
                        name="fecha_nacimiento"
                        type="date"
                        value={formulario.fecha_nacimiento}
                        onChange={manejarCambio}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="departamento_id">
                        Departamento o carrera
                    </label>

                    <select
                        id="departamento_id"
                        name="departamento_id"
                        value={formulario.departamento_id}
                        onChange={manejarCambio}
                        required
                    >
                        <option value="">
                            Seleccione un departamento
                        </option>

                        {departamentos.map((departamento) => (
                            <option
                                key={departamento.id}
                                value={departamento.id}
                            >
                                {departamento.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="correo">
                        Correo electronico
                    </label>

                    <input
                        id="correo"
                        name="correo"
                        type="email"
                        value={formulario.correo}
                        readOnly
                    />
                </div>

                <div>
                    <label htmlFor="nombre_usuario">
                        Nombre de usuario
                    </label>

                    <input
                        id="nombre_usuario"
                        name="nombre_usuario"
                        type="text"
                        value={formulario.nombre_usuario}
                        readOnly
                    />
                </div>

                <button type="submit">
                    Guardar cambios
                </button>
            </form>

            <button
                type="button"
                onClick={irCambiarContrasena}
            >
                Cambiar contrasena
            </button>

            <button
                type="button"
                onClick={manejarCerrarSesion}
            >
                Cerrar sesion
            </button>

            {mensaje && (
                <p>
                    {mensaje}
                </p>
            )}

            {error && (
                <p>
                    {error}
                </p>
            )}
        </main>
    );
}


export default PerfilPage;