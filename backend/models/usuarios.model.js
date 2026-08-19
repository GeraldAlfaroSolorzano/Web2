import pool from '../config/database.js';

export async function obtenerUsuarioPorCorreo(correo) {
    const sql = `
        SELECT id
        FROM usuarios
        WHERE correo = ?
        LIMIT 1
    `;

    const [filas] = await pool.execute(
        sql,
        [correo]
    );

    return filas[0];
}

export async function obtenerUsuarioPorNombreUsuario(
    nombreUsuario
) {
    const sql = `
        SELECT id
        FROM usuarios
        WHERE nombre_usuario = ?
        LIMIT 1
    `;

    const [filas] = await pool.execute(
        sql,
        [nombreUsuario]
    );

    return filas[0];
}

export async function obtenerDepartamentoPorId(
    departamentoId
) {
    const sql = `
        SELECT id
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

export async function crearUsuario(datosUsuario) {
    const sql = `
        INSERT INTO usuarios (
            rol_id,
            departamento_id,
            nombre_completo,
            fecha_nacimiento,
            correo,
            nombre_usuario,
            password_hash
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const valores = [
        1,
        datosUsuario.departamento_id,
        datosUsuario.nombre_completo,
        datosUsuario.fecha_nacimiento,
        datosUsuario.correo,
        datosUsuario.nombre_usuario,
        datosUsuario.password_hash
    ];

    const [resultado] = await pool.execute(
        sql,
        valores
    );

    return resultado.insertId;
}

export async function obtenerUsuarioPorId(usuarioId) {
    const sql = `
        SELECT
            usuarios.id,
            usuarios.nombre_completo,
            usuarios.fecha_nacimiento,
            usuarios.correo,
            usuarios.nombre_usuario,
            usuarios.departamento_id,
            departamentos.nombre AS departamento
        FROM usuarios
        INNER JOIN departamentos
            ON usuarios.departamento_id = departamentos.id
        WHERE usuarios.id = ?
        LIMIT 1
    `;

    const [filas] = await pool.execute(
        sql,
        [usuarioId]
    );

    return filas[0];
}

export async function actualizarPerfil(
    usuarioId,
    datosPerfil
) {
    const sql = `
        UPDATE usuarios
        SET
            nombre_completo = ?,
            fecha_nacimiento = ?,
            departamento_id = ?
        WHERE id = ?
    `;

    const valores = [
        datosPerfil.nombre_completo,
        datosPerfil.fecha_nacimiento,
        datosPerfil.departamento_id,
        usuarioId
    ];

    const [resultado] = await pool.execute(
        sql,
        valores
    );

    return resultado.affectedRows;
}

export async function obtenerPasswordHashPorId(usuarioId) {
    const sql = `
        SELECT password_hash
        FROM usuarios
        WHERE id = ?
        LIMIT 1
    `;

    const [filas] = await pool.execute(
        sql,
        [usuarioId]
    );

    return filas[0];
}

export async function actualizarPasswordHash(
    usuarioId,
    passwordHash
) {
    const sql = `
        UPDATE usuarios
        SET password_hash = ?
        WHERE id = ?
    `;

    const [resultado] = await pool.execute(
        sql,
        [
            passwordHash,
            usuarioId
        ]
    );

    return resultado.affectedRows;
}