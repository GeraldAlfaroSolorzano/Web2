import fs from 'fs';
import path from 'path';

import {
    obtenerEquipos,
    obtenerEquipoPorId,
    obtenerEquipoPorCodigo,
    crearEquipo,
    actualizarEquipoConImagen,
    actualizarEquipoSinImagen,
    actualizarEstadoEquipo,
    contarPrestamosEquipo,
    eliminarEquipo
} from '../models/equipos.model.js';


function eliminarImagen(nombreImagen) {
    if (!nombreImagen) {
        return;
    }

    const rutaImagen = path.join(
        process.cwd(),
        'uploads',
        'equipos',
        nombreImagen
    );

    try {
        if (fs.existsSync(rutaImagen)) {
            fs.unlinkSync(
                rutaImagen
            );
        }
    } catch (error) {
        return;
    }
}


export async function listarEquipos(req, res) {
    try {
        const equipos = await obtenerEquipos();

        return res.status(200).json({
            exito: true,
            mensaje: 'Equipos obtenidos correctamente',
            datos: equipos
        });
    } catch (error) {
        return res.status(500).json({
            exito: false,
            mensaje: 'Ocurrio un error al consultar los equipos'
        });
    }
}


export async function consultarEquipo(req, res) {
    try {
        const equipoId = Number(
            req.params.id
        );

        const equipo = await obtenerEquipoPorId(
            equipoId
        );

        if (!equipo) {
            return res.status(404).json({
                exito: false,
                mensaje: 'El equipo no existe'
            });
        }

        return res.status(200).json({
            exito: true,
            mensaje: 'Equipo obtenido correctamente',
            datos: equipo
        });
    } catch (error) {
        return res.status(500).json({
            exito: false,
            mensaje: 'Ocurrio un error al consultar el equipo'
        });
    }
}


export async function registrarEquipo(req, res) {
    try {
        const {
            codigo,
            descripcion,
            estado
        } = req.body;

        const equipoExistente = await obtenerEquipoPorCodigo(
            codigo
        );

        if (equipoExistente) {
            eliminarImagen(
                req.file.filename
            );

            return res.status(409).json({
                exito: false,
                mensaje: 'El codigo del equipo ya se encuentra registrado'
            });
        }

        const datosEquipo = {
            codigo,
            descripcion,
            imagen: req.file.filename,
            estado
        };

        const equipoId = await crearEquipo(
            datosEquipo
        );

        const equipo = await obtenerEquipoPorId(
            equipoId
        );

        return res.status(201).json({
            exito: true,
            mensaje: 'Equipo registrado correctamente',
            datos: equipo
        });
    } catch (error) {
        if (req.file) {
            eliminarImagen(
                req.file.filename
            );
        }

        return res.status(500).json({
            exito: false,
            mensaje: 'Ocurrio un error al registrar el equipo'
        });
    }
}


export async function modificarEquipo(req, res) {
    try {
        const equipoId = Number(
            req.params.id
        );

        const {
            codigo,
            descripcion,
            estado
        } = req.body;

        const equipo = await obtenerEquipoPorId(
            equipoId
        );

        if (!equipo) {
            if (req.file) {
                eliminarImagen(
                    req.file.filename
                );
            }

            return res.status(404).json({
                exito: false,
                mensaje: 'El equipo no existe'
            });
        }

        if (equipo.estado === 'PRESTADO') {
            if (req.file) {
                eliminarImagen(
                    req.file.filename
                );
            }

            return res.status(409).json({
                exito: false,
                mensaje: 'No se puede modificar un equipo prestado'
            });
        }

        const equipoCodigo = await obtenerEquipoPorCodigo(
            codigo
        );

        if (
            equipoCodigo &&
            equipoCodigo.id !== equipoId
        ) {
            if (req.file) {
                eliminarImagen(
                    req.file.filename
                );
            }

            return res.status(409).json({
                exito: false,
                mensaje: 'El codigo del equipo ya se encuentra registrado'
            });
        }

        const datosEquipo = {
            codigo,
            descripcion,
            estado
        };

        if (req.file) {
            datosEquipo.imagen = req.file.filename;

            await actualizarEquipoConImagen(
                equipoId,
                datosEquipo
            );

            eliminarImagen(
                equipo.imagen
            );
        } else {
            await actualizarEquipoSinImagen(
                equipoId,
                datosEquipo
            );
        }

        const equipoActualizado = await obtenerEquipoPorId(
            equipoId
        );

        return res.status(200).json({
            exito: true,
            mensaje: 'Equipo actualizado correctamente',
            datos: equipoActualizado
        });
    } catch (error) {
        if (req.file) {
            eliminarImagen(
                req.file.filename
            );
        }

        return res.status(500).json({
            exito: false,
            mensaje: 'Ocurrio un error al actualizar el equipo'
        });
    }
}


export async function cambiarEstado(req, res) {
    try {
        const equipoId = Number(
            req.params.id
        );

        const {
            estado
        } = req.body;

        const equipo = await obtenerEquipoPorId(
            equipoId
        );

        if (!equipo) {
            return res.status(404).json({
                exito: false,
                mensaje: 'El equipo no existe'
            });
        }

        if (equipo.estado === 'PRESTADO') {
            return res.status(409).json({
                exito: false,
                mensaje: 'El estado de un equipo prestado se controla desde prestamos'
            });
        }

        const filasAfectadas = await actualizarEstadoEquipo(
            equipoId,
            estado
        );

        if (filasAfectadas === 0) {
            return res.status(400).json({
                exito: false,
                mensaje: 'No se pudo actualizar el estado del equipo'
            });
        }

        const equipoActualizado = await obtenerEquipoPorId(
            equipoId
        );

        return res.status(200).json({
            exito: true,
            mensaje: 'Estado del equipo actualizado correctamente',
            datos: equipoActualizado
        });
    } catch (error) {
        return res.status(500).json({
            exito: false,
            mensaje: 'Ocurrio un error al actualizar el estado del equipo'
        });
    }
}


export async function removerEquipo(req, res) {
    try {
        const equipoId = Number(
            req.params.id
        );

        const equipo = await obtenerEquipoPorId(
            equipoId
        );

        if (!equipo) {
            return res.status(404).json({
                exito: false,
                mensaje: 'El equipo no existe'
            });
        }

        if (equipo.estado === 'PRESTADO') {
            return res.status(409).json({
                exito: false,
                mensaje: 'No se puede eliminar un equipo prestado'
            });
        }

        const totalPrestamos = await contarPrestamosEquipo(
            equipoId
        );

        if (totalPrestamos > 0) {
            return res.status(409).json({
                exito: false,
                mensaje: 'No se puede eliminar el equipo porque tiene prestamos asociados'
            });
        }

        await eliminarEquipo(
            equipoId
        );

        eliminarImagen(
            equipo.imagen
        );

        return res.status(200).json({
            exito: true,
            mensaje: 'Equipo eliminado correctamente'
        });
    } catch (error) {
        return res.status(500).json({
            exito: false,
            mensaje: 'Ocurrio un error al eliminar el equipo'
        });
    }
}