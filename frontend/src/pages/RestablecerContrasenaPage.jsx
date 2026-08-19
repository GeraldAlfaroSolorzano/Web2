import { useState } from 'react';

import {
    restablecerContrasena
} from '../services/auth.service.js';


function RestablecerContrasenaPage() {
    const parametros = new URLSearchParams(
        window.location.search
    );

    const token = parametros.get('token');

    const [formulario, setFormulario] = useState({
        nueva_contrasena: '',
        confirmar_nueva_contrasena: ''
    });

    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');
    const [cargando, setCargando] = useState(false);


    function manejarCambio(evento) {
        const { name, value } = evento.target;

        setFormulario({
            ...formulario,
            [name]: value
        });
    }


    function validarContrasena() {
        if (formulario.nueva_contrasena.length < 8) {
            setError(
                'La contraseña debe tener al menos 8 caracteres'
            );

            return false;
        }

        if (!/[A-Z]/.test(formulario.nueva_contrasena)) {
            setError(
                'La contraseña debe contener al menos una mayuscula'
            );

            return false;
        }

        if (!/[0-9]/.test(formulario.nueva_contrasena)) {
            setError(
                'La contraseña debe contener al menos un numero'
            );

            return false;
        }

        if (!/[^A-Za-z0-9]/.test(formulario.nueva_contrasena)) {
            setError(
                'La contraseña debe contener al menos un simbolo'
            );

            return false;
        }

        if (
            formulario.nueva_contrasena !==
            formulario.confirmar_nueva_contrasena
        ) {
            setError(
                'Las contraseñas no coinciden'
            );

            return false;
        }

        return true;
    }

    async function manejarEnvio(evento) {
        evento.preventDefault();

        setMensaje('');
        setError('');

        if (!token) {
            setError(
                'El token de recuperacion no es valido'
            );

            return;
        }

        const contrasenaValida = validarContrasena();

        if (!contrasenaValida) {
            return;
        }

        setCargando(true);

        try {
            const respuesta = await restablecerContrasena({
                token,
                nueva_contrasena:
                    formulario.nueva_contrasena,
                confirmar_nueva_contrasena:
                    formulario.confirmar_nueva_contrasena
            });

            setMensaje(
                respuesta.mensaje
            );

            setFormulario({
                nueva_contrasena: '',
                confirmar_nueva_contrasena: ''
            });
        } catch (error) {
            setError(
                error.message
            );
        } finally {
            setCargando(false);
        }
    }


    return (
        <main>
            <h1>Restablecer contraseña</h1>

            {!token && (
                <p>
                    El enlace de recuperacion no es valido.
                </p>
            )}

            {token && (
                <form onSubmit={manejarEnvio}>
                    <div>
                        <label htmlFor="nueva_contrasena">
                            Nueva contraseña
                        </label>

                        <input
                            id="nueva_contrasena"
                            name="nueva_contrasena"
                            type="password"
                            value={formulario.nueva_contrasena}
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
                        <label htmlFor="confirmar_nueva_contrasena">
                            Confirmar nueva contraseña
                        </label>

                        <input
                            id="confirmar_nueva_contrasena"
                            name="confirmar_nueva_contrasena"
                            type="password"
                            value={
                                formulario.confirmar_nueva_contrasena
                            }
                            onChange={manejarCambio}
                            minLength="8"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={cargando}
                    >
                        Restablecer contraseña
                    </button>
                </form>
            )}

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

            <div>
                <a href="/">
                    Volver al inicio de sesion
                </a>
            </div>
        </main>
    );
}


export default RestablecerContrasenaPage;