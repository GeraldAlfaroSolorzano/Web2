import { useState } from 'react';

import {
    solicitarRecuperacion
} from '../services/auth.service.js';

function RecuperarContrasenaPage() {
    const [usuarioOCorreo, setUsuarioOCorreo] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');
    const [enlaceRecuperacion, setEnlaceRecuperacion] = useState('');
    const [cargando, setCargando] = useState(false);

    function manejarCambio(evento) {
        setUsuarioOCorreo(
            evento.target.value
        );
    }

    async function manejarEnvio(evento) {
        evento.preventDefault();

        setMensaje('');
        setError('');
        setEnlaceRecuperacion('');

        if (!usuarioOCorreo.trim()) {
            setError(
                'El usuario o correo es requerido'
            );

            return;
        }

        setCargando(true);

        try {
            const respuesta = await solicitarRecuperacion({
                usuario_o_correo: usuarioOCorreo
            });

            setMensaje(
                respuesta.mensaje
            );

            if (
                respuesta.datos &&
                respuesta.datos.enlace_recuperacion
            ) {
                setEnlaceRecuperacion(
                    respuesta.datos.enlace_recuperacion
                );
            }
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
            <h1>Recuperar contraseña</h1>

            <p>
                Ingrese su nombre de usuario o correo electronico.
            </p>

            <form onSubmit={manejarEnvio}>
                <div>
                    <label htmlFor="usuario_o_correo">
                        Usuario o correo
                    </label>

                    <input
                        id="usuario_o_correo"
                        name="usuario_o_correo"
                        type="text"
                        value={usuarioOCorreo}
                        onChange={manejarCambio}
                        maxLength="150"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={cargando}
                >
                    Solicitar recuperacion
                </button>
            </form>

            {mensaje && (
                <p>
                    {mensaje}
                </p>
            )}

            {enlaceRecuperacion && (
                <div>
                    <p>
                        Enlace de recuperacion:
                    </p>

                    <a href={enlaceRecuperacion}>
                        Restablecer contraseña
                    </a>
                </div>
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

export default RecuperarContrasenaPage;