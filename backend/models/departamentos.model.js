import pool from '../config/database.js';

export async function obtenerDepartamentos() {
    const sql = `
        SELECT
            id,
            nombre,
            descripcion,
            encargado
        FROM departamentos
        ORDER BY nombre
    `;

    const [filas] = await pool.execute(sql);

    return filas;
}

export async function obtenerDepartamentoPorId(
    departamentoId
) {
    const sql = `
        SELECT
            id,
            nombre,
            descripcion,
            encargado
        FROM departamentos
        WHERE id = ?
        LIMIT 1
    `;

    const [filas] = await pool.execute(
        sql,
        [departamentoId]
    );

    return filas[0];
}

export async function obtenerDepartamentoPorNombre(
    nombre
) {
    const sql = `
        SELECT id
        FROM departamentos
        WHERE nombre = ?
        LIMIT 1
    `;

    const [filas] = await pool.execute(
        sql,
        [nombre]
    );

    return filas[0];
}

export async function crearDepartamento(
    datosDepartamento
) {
    const sql = `
        INSERT INTO departamentos (
            nombre,
            descripcion,
            encargado
        )
        VALUES (?, ?, ?)
    `;

    const valores = [
        datosDepartamento.nombre,
        datosDepartamento.descripcion,
        datosDepartamento.encargado
    ];

    const [resultado] = await pool.execute(
        sql,
        valores
    );

    return resultado.insertId;
}

export async function actualizarDepartamento(
    departamentoId,
    datosDepartamento
) {
    const sql = `
        UPDATE departamentos
        SET
            nombre = ?,
            descripcion = ?,
            encargado = ?
        WHERE id = ?
    `;

    const valores = [
        datosDepartamento.nombre,
        datosDepartamento.descripcion,
        datosDepartamento.encargado,
        departamentoId
    ];

    const [resultado] = await pool.execute(
        sql,
        valores
    );

    return resultado.affectedRows;
}

export async function contarUsuariosDepartamento(
    departamentoId
) {
    const sql = `
        SELECT COUNT(*) AS total
        FROM usuarios
        WHERE departamento_id = ?
    `;

    const [filas] = await pool.execute(
        sql,
        [departamentoId]
    );

    return filas[0].total;
}

export async function eliminarDepartamento(
    departamentoId
) {
    const sql = `
        DELETE FROM departamentos
        WHERE id = ?
    `;

    const [resultado] = await pool.execute(
        sql,
        [departamentoId]
    );

    return resultado.affectedRows;
}