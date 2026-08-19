import { useState } from 'react';

import {
    iniciarSesion
} from '../services/auth.service.js';


function LoginPage() {
    const [formulario, setFormulario] = useState({
        usuario_o_correo: '',
        contrasena: ''
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


    async function manejarEnvio(evento) {
        evento.preventDefault();

        setMensaje('');
        setError('');
        setCargando(true);

        try {
            const respuesta = await iniciarSesion(
                formulario
            );

            setMensaje(respuesta.mensaje);

            window.location.href = '/perfil';
        } catch (error) {
            setError(error.message);
        } finally {
            setCargando(false);
        }
    }


    return (
        <main>
            <h1>Iniciar sesion</h1>

            <form onSubmit={manejarEnvio}>
                <div>
                    <label htmlFor="usuario_o_correo">
                        Usuario o correo
                    </label>

                    <input
                        id="usuario_o_correo"
                        name="usuario_o_correo"
                        type="text"
                        value={formulario.usuario_o_correo}
                        onChange={manejarCambio}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="contrasena">
                        Contrasena
                    </label>

                    <input
                        id="contrasena"
                        name="contrasena"
                        type="password"
                        value={formulario.contrasena}
                        onChange={manejarCambio}
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={cargando}
                >
                    Iniciar sesion
                </button>
            </form>

            <div>
                <a href="/registro">
                    Crear cuenta
                </a>
            </div>

            <div>
                <a href="/recuperar-contrasena">
                    Olvide mi contrasena
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


export default LoginPage;