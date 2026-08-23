import pool from '../config/database.js';

export async function obtenerReporteMarcas(filtros) {
    let sql = `
        SELECT
            MIN(m.id) AS id,
            u.nombre_usuario AS usuario,
            DATE_FORMAT(m.fecha, '%Y-%m-%d') AS fecha,
            MAX(
                CASE
                    WHEN m.tipo_marca = 'ENTRADA'
                    THEN m.hora
                END
            ) AS hora_entrada,
            MAX(
                CASE
                    WHEN m.tipo_marca = 'SALIDA'
                    THEN m.hora
                END
            ) AS hora_salida,
            d.nombre AS dispositivo,
            MAX(m.direccion_ip) AS direccion_ip
        FROM marcas m
        INNER JOIN usuarios u
            ON m.usuario_id = u.id
        INNER JOIN dispositivos d
            ON m.dispositivo_id = d.id
        WHERE 1 = 1
    `;

    const valores = [];

    if (filtros.usuario) {
        sql += `
            AND (
                u.nombre_usuario LIKE ?
                OR u.nombre_completo LIKE ?
                OR u.correo LIKE ?
            )
        `;

        const usuario = `%${filtros.usuario}%`;

        valores.push(
            usuario,
            usuario,
            usuario
        );
    }

    if (filtros.anio) {
        sql += `
            AND YEAR(m.fecha) = ?
        `;

        valores.push(filtros.anio);
    }

    if (filtros.mes) {
        sql += `
            AND MONTH(m.fecha) = ?
        `;

        valores.push(filtros.mes);
    }

    if (filtros.dia) {
        sql += `
            AND DAY(m.fecha) = ?
        `;

        valores.push(filtros.dia);
    }

    if (filtros.departamento_id) {
        sql += `
            AND u.departamento_id = ?
        `;

        valores.push(
            filtros.departamento_id
        );
    }

    sql += `
        GROUP BY
            u.id,
            u.nombre_usuario,
            m.fecha,
            d.id,
            d.nombre
        ORDER BY
            m.fecha DESC,
            hora_entrada DESC
    `;

    const [filas] = await pool.execute(
        sql,
        valores
    );

    return filas;
}