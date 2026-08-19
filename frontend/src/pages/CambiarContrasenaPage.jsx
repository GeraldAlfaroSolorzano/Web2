import { useState } from 'react';

import {
    cambiarContrasena
} from '../services/auth.service.js';


function CambiarContrasenaPage() {
    const [formulario, setFormulario] = useState({
        contrasena_actual: '',
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


    async function manejarEnvio(evento) {
        evento.preventDefault();

        setMensaje('');
        setError('');
        setCargando(true);

        try {
            const respuesta = await cambiarContrasena(
                formulario
            );

            setMensaje(respuesta.mensaje);

            setFormulario({
                contrasena_actual: '',
                nueva_contrasena: '',
                confirmar_nueva_contrasena: ''
            });
        } catch (error) {
            setError(error.message);
        } finally {
            setCargando(false);
        }
    }


    function volverPerfil() {
        window.location.href = '/perfil';
    }


    return (
        <main>
            <h1>Cambiar contrasena</h1>

            <form onSubmit={manejarEnvio}>
                <div>
                    <label htmlFor="contrasena_actual">
                        Contrasena actual
                    </label>

                    <input
                        id="contrasena_actual"
                        name="contrasena_actual"
                        type="password"
                        value={formulario.contrasena_actual}
                        onChange={manejarCambio}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="nueva_contrasena">
                        Nueva contrasena
                    </label>

                    <input
                        id="nueva_contrasena"
                        name="nueva_contrasena"
                        type="password"
                        value={formulario.nueva_contrasena}
                        onChange={manejarCambio}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="confirmar_nueva_contrasena">
                        Confirmar nueva contrasena
                    </label>

                    <input
                        id="confirmar_nueva_contrasena"
                        name="confirmar_nueva_contrasena"
                        type="password"
                        value={
                            formulario.confirmar_nueva_contrasena
                        }
                        onChange={manejarCambio}
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={cargando}
                >
                    Cambiar contrasena
                </button>
            </form>

            <button
                type="button"
                onClick={volverPerfil}
            >
                Volver al perfil
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


export default CambiarContrasenaPage;