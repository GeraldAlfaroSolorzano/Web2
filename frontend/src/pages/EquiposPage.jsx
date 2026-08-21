import { useEffect, useState } from 'react';

import {
    obtenerEquipos,
    registrarEquipo,
    actualizarEquipo,
    cambiarEstadoEquipo,
    eliminarEquipo
} from '../services/equipos.service.js';

import {
    BACKEND_URL
} from '../config/api.js';

import '../styles/equipos.css';


function EquiposPage() {
    const [equipos, setEquipos] = useState([]);

    const [formulario, setFormulario] = useState({
        codigo: '',
        descripcion: '',
        estado: 'DISPONIBLE',
        imagen: null
    });

    const [equipoEditando, setEquipoEditando] =
        useState(null);

    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');
    const [cargando, setCargando] = useState(true);


    useEffect(() => {
        cargarEquipos();
    }, []);


    async function cargarEquipos() {
        try {
            const respuesta = await obtenerEquipos();

            setEquipos(
                respuesta.datos
            );
        } catch (error) {
            setError(
                error.message
            );
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


    function manejarImagen(evento) {
        const archivo = evento.target.files[0];

        if (!archivo) {
            return;
        }

        const tiposPermitidos = [
            'image/jpeg',
            'image/png',
            'image/webp'
        ];

        const extensionesPermitidas = [
            'jpg',
            'jpeg',
            'png',
            'webp'
        ];

        const partesNombre = archivo.name.split('.');

        const extension = partesNombre[
            partesNombre.length - 1
        ].toLowerCase();

        if (!tiposPermitidos.includes(archivo.type)) {
            setError(
                'El tipo de archivo no esta permitido'
            );

            evento.target.value = '';

            return;
        }

        if (!extensionesPermitidas.includes(extension)) {
            setError(
                'La extension del archivo no esta permitida'
            );

            evento.target.value = '';

            return;
        }

        if (archivo.size > 5 * 1024 * 1024) {
            setError(
                'La imagen no puede superar 5 MB'
            );

            evento.target.value = '';

            return;
        }

        setError('');

        setFormulario({
            ...formulario,
            imagen: archivo
        });
    }


    function limpiarFormulario() {
        setFormulario({
            codigo: '',
            descripcion: '',
            estado: 'DISPONIBLE',
            imagen: null
        });

        setEquipoEditando(null);

        const inputImagen =
            document.getElementById('imagen');

        if (inputImagen) {
            inputImagen.value = '';
        }
    }


    async function manejarEnvio(evento) {
        evento.preventDefault();

        setMensaje('');
        setError('');

        if (!equipoEditando && !formulario.imagen) {
            setError(
                'La imagen del equipo es requerida'
            );

            return;
        }

        try {
            let respuesta;

            if (equipoEditando) {
                respuesta = await actualizarEquipo(
                    equipoEditando,
                    formulario
                );
            } else {
                respuesta = await registrarEquipo(
                    formulario
                );
            }

            setMensaje(
                respuesta.mensaje
            );

            limpiarFormulario();

            await cargarEquipos();
        } catch (error) {
            setError(
                error.message
            );
        }
    }


    function seleccionarEditar(equipo) {
        setMensaje('');
        setError('');

        if (equipo.estado === 'PRESTADO') {
            setError(
                'No se puede modificar un equipo prestado'
            );

            return;
        }

        setEquipoEditando(
            equipo.id
        );

        setFormulario({
            codigo: equipo.codigo,
            descripcion: equipo.descripcion,
            estado: equipo.estado,
            imagen: null
        });

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }


    async function manejarEstado(
        equipoId,
        estadoActual
    ) {
        setMensaje('');
        setError('');

        if (estadoActual === 'PRESTADO') {
            setError(
                'El estado PRESTADO se controla desde prestamos'
            );

            return;
        }

        let nuevoEstado = 'DISPONIBLE';

        if (estadoActual === 'DISPONIBLE') {
            nuevoEstado = 'MANTENIMIENTO';
        }

        if (estadoActual === 'MANTENIMIENTO') {
            nuevoEstado = 'INACTIVO';
        }

        if (estadoActual === 'INACTIVO') {
            nuevoEstado = 'DISPONIBLE';
        }

        try {
            const respuesta = await cambiarEstadoEquipo(
                equipoId,
                nuevoEstado
            );

            setMensaje(
                respuesta.mensaje
            );

            await cargarEquipos();
        } catch (error) {
            setError(
                error.message
            );
        }
    }


    async function manejarEliminar(equipo) {
        setMensaje('');
        setError('');

        if (equipo.estado === 'PRESTADO') {
            setError(
                'No se puede eliminar un equipo prestado'
            );

            return;
        }

        const confirmar = window.confirm(
            'Desea eliminar este equipo?'
        );

        if (!confirmar) {
            return;
        }

        try {
            const respuesta = await eliminarEquipo(
                equipo.id
            );

            setMensaje(
                respuesta.mensaje
            );

            await cargarEquipos();
        } catch (error) {
            setError(
                error.message
            );
        }
    }


    function volverPerfil() {
        window.location.href = '/perfil';
    }


    if (cargando) {
        return (
            <main className="equipos-contenedor">
                <p>Cargando equipos...</p>
            </main>
        );
    }


    return (
        <main className="equipos-contenedor">
            <h1>Inventario de equipos</h1>

            <section className="equipos-seccion">
                <h2>
                    {equipoEditando && (
                        <span>Modificar equipo</span>
                    )}

                    {!equipoEditando && (
                        <span>Registrar equipo</span>
                    )}
                </h2>

                <form
                    className="equipos-formulario"
                    onSubmit={manejarEnvio}
                >
                    <div>
                        <label htmlFor="codigo">
                            Codigo
                        </label>

                        <input
                            id="codigo"
                            name="codigo"
                            type="text"
                            value={formulario.codigo}
                            onChange={manejarCambio}
                            maxLength="50"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="descripcion">
                            Descripcion
                        </label>

                        <textarea
                            id="descripcion"
                            name="descripcion"
                            value={formulario.descripcion}
                            onChange={manejarCambio}
                            maxLength="255"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="estado">
                            Estado
                        </label>

                        <select
                            id="estado"
                            name="estado"
                            value={formulario.estado}
                            onChange={manejarCambio}
                            required
                        >
                            <option value="DISPONIBLE">
                                DISPONIBLE
                            </option>

                            <option value="MANTENIMIENTO">
                                MANTENIMIENTO
                            </option>

                            <option value="INACTIVO">
                                INACTIVO
                            </option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="imagen">
                            Imagen
                        </label>

                        <input
                            id="imagen"
                            name="imagen"
                            type="file"
                            accept=".jpg,.jpeg,.png,.webp"
                            onChange={manejarImagen}
                        />

                        <p>
                            JPG, PNG o WEBP. Maximo 5 MB.
                        </p>
                    </div>

                    <button
                        className="equipos-boton"
                        type="submit"
                    >
                        {equipoEditando && (
                            <span>Guardar cambios</span>
                        )}

                        {!equipoEditando && (
                            <span>Registrar equipo</span>
                        )}
                    </button>

                    {equipoEditando && (
                        <button
                            className="equipos-boton"
                            type="button"
                            onClick={limpiarFormulario}
                        >
                            Cancelar edicion
                        </button>
                    )}
                </form>
            </section>

            <section className="equipos-seccion">
                <h2>Equipos registrados</h2>

                {equipos.length === 0 && (
                    <p>
                        No hay equipos registrados.
                    </p>
                )}

                {equipos.length > 0 && (
                    <div className="equipos-tabla-contenedor">
                        <table className="equipos-tabla">
                            <thead>
                                <tr>
                                    <th>Imagen</th>
                                    <th>Codigo</th>
                                    <th>Descripcion</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>

                            <tbody>
                                {equipos.map((equipo) => (
                                    <tr key={equipo.id}>
                                        <td>
                                            {equipo.imagen && (
                                                <img
                                                    className="equipo-imagen"
                                                    src={
                                                        `${BACKEND_URL}/uploads/equipos/${equipo.imagen}`
                                                    }
                                                    alt={
                                                        equipo.descripcion
                                                    }
                                                />
                                            )}
                                        </td>

                                        <td>
                                            {equipo.codigo}
                                        </td>

                                        <td>
                                            {equipo.descripcion}
                                        </td>

                                        <td>
                                            {equipo.estado}
                                        </td>

                                        <td>
                                            <div className="equipos-acciones">
                                                <button
                                                    className="equipos-boton"
                                                    type="button"
                                                    onClick={() =>
                                                        seleccionarEditar(
                                                            equipo
                                                        )
                                                    }
                                                    disabled={
                                                        equipo.estado ===
                                                        'PRESTADO'
                                                    }
                                                >
                                                    Editar
                                                </button>

                                                <button
                                                    className="equipos-boton"
                                                    type="button"
                                                    onClick={() =>
                                                        manejarEstado(
                                                            equipo.id,
                                                            equipo.estado
                                                        )
                                                    }
                                                    disabled={
                                                        equipo.estado ===
                                                        'PRESTADO'
                                                    }
                                                >
                                                    Cambiar estado
                                                </button>

                                                <button
                                                    className="equipos-boton"
                                                    type="button"
                                                    onClick={() =>
                                                        manejarEliminar(
                                                            equipo
                                                        )
                                                    }
                                                    disabled={
                                                        equipo.estado ===
                                                        'PRESTADO'
                                                    }
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            {mensaje && (
                <p className="equipos-mensaje">
                    {mensaje}
                </p>
            )}

            {error && (
                <p className="equipos-mensaje">
                    {error}
                </p>
            )}

            <div className="equipos-navegacion">
                <button
                    className="equipos-boton"
                    type="button"
                    onClick={volverPerfil}
                >
                    Volver al perfil
                </button>
            </div>
        </main>
    );
}


export default EquiposPage;