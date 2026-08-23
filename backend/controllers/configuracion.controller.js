import {
    obtenerConfiguracion,
    crearConfiguracion,
    actualizarConfiguracion
} from '../models/configuracion.model.js';

export async function consultarConfiguracion(
    req,
    res
) {
    try {
        const configuracion =
            await obtenerConfiguracion();

        if (!configuracion) {
            return res.status(200).json({
                exito: true,
                mensaje: 'No hay configuracion registrada',
                datos: {
                    nombre_institucion: '',
                    rango_ip_inicio: '',
                    rango_ip_fin: '',
                    tiempo_maximo_sesion: '',
                    tamano_maximo_archivo: ''
                }
            });
        }

        return res.status(200).json({
            exito: true,
            mensaje: 'Configuracion obtenida correctamente',
            datos: configuracion
        });
    } catch (error) {
        return res.status(500).json({
            exito: false,
            mensaje: 'Ocurrio un error al consultar la configuracion'
        });
    }
}

export async function guardarConfiguracion(
    req,
    res
) {
    try {
        const {
            nombre_institucion,
            rango_ip_inicio,
            rango_ip_fin,
            tiempo_maximo_sesion,
            tamano_maximo_archivo
        } = req.body;

        const datosConfiguracion = {
            nombre_institucion,
            rango_ip_inicio,
            rango_ip_fin,
            tiempo_maximo_sesion,
            tamano_maximo_archivo
        };

        const configuracion =
            await obtenerConfiguracion();

        if (!configuracion) {
            const configuracionId =
                await crearConfiguracion(
                    datosConfiguracion
                );

            return res.status(201).json({
                exito: true,
                mensaje: 'Configuracion registrada correctamente',
                datos: {
                    id: configuracionId,
                    nombre_institucion,
                    rango_ip_inicio,
                    rango_ip_fin,
                    tiempo_maximo_sesion,
                    tamano_maximo_archivo
                }
            });
        }

        await actualizarConfiguracion(
            configuracion.id,
            datosConfiguracion
        );

        const configuracionActualizada =
            await obtenerConfiguracion();

        return res.status(200).json({
            exito: true,
            mensaje: 'Configuracion actualizada correctamente',
            datos: configuracionActualizada
        });
    } catch (error) {
        return res.status(500).json({
            exito: false,
            mensaje: 'Ocurrio un error al guardar la configuracion'
        });
    }
}