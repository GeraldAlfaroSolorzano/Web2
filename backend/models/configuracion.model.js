import pool from '../config/database.js';

export async function obtenerConfiguracion() {
    const sql = `
        SELECT
            id,
            nombre_institucion,
            rango_ip_inicio,
            rango_ip_fin,
            tiempo_maximo_sesion,
            tamano_maximo_archivo
        FROM configuracion
        LIMIT 1
    `;

    const [filas] = await pool.execute(sql);

    return filas[0];
}

export async function crearConfiguracion(
    datosConfiguracion
) {
    const sql = `
        INSERT INTO configuracion (
            nombre_institucion,
            rango_ip_inicio,
            rango_ip_fin,
            tiempo_maximo_sesion,
            tamano_maximo_archivo
        )
        VALUES (?, ?, ?, ?, ?)
    `;

    const valores = [
        datosConfiguracion.nombre_institucion,
        datosConfiguracion.rango_ip_inicio,
        datosConfiguracion.rango_ip_fin,
        datosConfiguracion.tiempo_maximo_sesion,
        datosConfiguracion.tamano_maximo_archivo
    ];

    const [resultado] = await pool.execute(
        sql,
        valores
    );

    return resultado.insertId;
}

export async function actualizarConfiguracion(
    configuracionId,
    datosConfiguracion
) {
    const sql = `
        UPDATE configuracion
        SET
            nombre_institucion = ?,
            rango_ip_inicio = ?,
            rango_ip_fin = ?,
            tiempo_maximo_sesion = ?,
            tamano_maximo_archivo = ?
        WHERE id = ?
    `;

    const valores = [
        datosConfiguracion.nombre_institucion,
        datosConfiguracion.rango_ip_inicio,
        datosConfiguracion.rango_ip_fin,
        datosConfiguracion.tiempo_maximo_sesion,
        datosConfiguracion.tamano_maximo_archivo,
        configuracionId
    ];

    const [resultado] = await pool.execute(
        sql,
        valores
    );

    return resultado.affectedRows;
}