import { useEffect, useState } from 'react';

import {
    registrarUsuario,
    obtenerDepartamentos
} from '../services/auth.service.js';

function RegistroPage() {
    const [formulario, setFormulario] = useState({
        nombre_completo: '',
        fecha_nacimiento: '',
        correo: '',
        departamento_id: '',
        nombre_usuario: '',
        contrasena: '',
        confirmar_contrasena: ''
    });

    const [departamentos, setDepartamentos] = useState([]);
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');
    const [cargando, setCargando] = useState(false);

    useEffect(() => {
        cargarDepartamentos();
    }, []);

    async function cargarDepartamentos() {
        try {
            const respuesta = await obtenerDepartamentos();

            setDepartamentos(respuesta.datos);
        } catch (error) {
            setError(
                'No se pudieron cargar los departamentos'
            );
        }
    }

    function manejarCambio(evento) {
        const { name, value } = evento.target;

        setFormulario({
            ...formulario,
            [name]: value
        });
    }

    function validarContrasena() {
        if (formulario.contrasena.length < 8) {
            setError(
                'La contraseña debe tener al menos 8 caracteres'
            );

            return false;
        }

        if (!/[A-Z]/.test(formulario.contrasena)) {
            setError(
                'La contraseña debe contener al menos una mayuscula'
            );

            return false;
        }

        if (!/[0-9]/.test(formulario.contrasena)) {
            setError(
                'La contraseña debe contener al menos un numero'
            );

            return false;
        }

        if (!/[^A-Za-z0-9]/.test(formulario.contrasena)) {
            setError(
                'La contraseña debe contener al menos un simbolo'
            );

            return false;
        }

        if (
            formulario.contrasena !==
            formulario.confirmar_contrasena
        ) {
            setError(
                'Las contraseñs no coinciden'
            );

            return false;
        }

        return true;
    }

    async function manejarEnvio(evento) {
        evento.preventDefault();

        setMensaje('');
        setError('');

        const contrasenaValida = validarContrasena();

        if (!contrasenaValida) {
            return;
        }

        setCargando(true);

        try {
            const datosUsuario = {
                nombre_completo:
                    formulario.nombre_completo,
                fecha_nacimiento:
                    formulario.fecha_nacimiento,
                correo:
                    formulario.correo,
                departamento_id: Number(
                    formulario.departamento_id
                ),
                nombre_usuario:
                    formulario.nombre_usuario,
                contrasena:
                    formulario.contrasena,
                confirmar_contrasena:
                    formulario.confirmar_contrasena
            };

            const respuesta = await registrarUsuario(
                datosUsuario
            );

            setMensaje(respuesta.mensaje);

            setFormulario({
                nombre_completo: '',
                fecha_nacimiento: '',
                correo: '',
                departamento_id: '',
                nombre_usuario: '',
                contrasena: '',
                confirmar_contrasena: ''
            });
        } catch (error) {
            setError(error.message);
        } finally {
            setCargando(false);
        }
    }

    return (
        <main>
            <h1>Registro de usuario</h1>

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
                        maxLength="150"
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
                    <label htmlFor="correo">
                        Correo electronico
                    </label>

                    <input
                        id="correo"
                        name="correo"
                        type="email"
                        value={formulario.correo}
                        onChange={manejarCambio}
                        maxLength="150"
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
                    <label htmlFor="nombre_usuario">
                        Nombre de usuario
                    </label>

                    <input
                        id="nombre_usuario"
                        name="nombre_usuario"
                        type="text"
                        value={formulario.nombre_usuario}
                        onChange={manejarCambio}
                        maxLength="80"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="contrasena">
                        Contraseña
                    </label>

                    <input
                        id="contrasena"
                        name="contrasena"
                        type="password"
                        value={formulario.contrasena}
                        onChange={manejarCambio}
                        minLength="8"
                        required
                    />

                    <p>
                        Minimo 8 caracteres, una mayuscula,
                        un numero y un simbolo.
                    </p>
                </div>

                <div>
                    <label htmlFor="confirmar_contrasena">
                        Confirmar contraseña
                    </label>

                    <input
                        id="confirmar_contrasena"
                        name="confirmar_contrasena"
                        type="password"
                        value={formulario.confirmar_contrasena}
                        onChange={manejarCambio}
                        minLength="8"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={cargando}
                >
                    Registrarse
                </button>
            </form>

            <div>
                <a href="/">
                    Volver al inicio de sesion
                </a>
            </div>

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

export default RegistroPage;