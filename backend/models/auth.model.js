import pool from '../config/database.js';

export async function obtenerUsuarioPorCredencial(
    usuarioOCorreo
) {
    const sql = `
        SELECT
            id,
            rol_id,
            departamento_id,
            nombre_completo,
            correo,
            nombre_usuario,
            password_hash
        FROM usuarios
        WHERE nombre_usuario = ?
        OR correo = ?
        LIMIT 1
    `;

    const valores = [
        usuarioOCorreo,
        usuarioOCorreo
    ];

    const [filas] = await pool.execute(
        sql,
        valores
    );

    return filas[0];
}

export async function obtenerUsuarioRecuperacion(
    usuarioOCorreo
) {
    const sql = `
        SELECT
            id,
            correo,
            nombre_usuario
        FROM usuarios
        WHERE nombre_usuario = ?
        OR correo = ?
        LIMIT 1
    `;

    const valores = [
        usuarioOCorreo,
        usuarioOCorreo
    ];

    const [filas] = await pool.execute(
        sql,
        valores
    );

    return filas[0];
}

export async function crearTokenRecuperacion(
    usuarioId,
    token,
    fechaExpiracion
) {
    const sql = `
        INSERT INTO tokens_recuperacion (
            usuario_id,
            token,
            fecha_expiracion,
            usado
        )
        VALUES (?, ?, ?, FALSE)
    `;

    const valores = [
        usuarioId,
        token,
        fechaExpiracion
    ];

    const [resultado] = await pool.execute(
        sql,
        valores
    );

    return resultado.insertId;
}

export async function obtenerTokenRecuperacion(token) {
    const sql = `
        SELECT
            id,
            usuario_id,
            token,
            fecha_expiracion,
            usado
        FROM tokens_recuperacion
        WHERE token = ?
        LIMIT 1
    `;

    const [filas] = await pool.execute(
        sql,
        [token]
    );

    return filas[0];
}

export async function actualizarContrasenaRecuperacion(
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

export async function marcarTokenComoUsado(tokenId) {
    const sql = `
        UPDATE tokens_recuperacion
        SET usado = TRUE
        WHERE id = ?
    `;

    const [resultado] = await pool.execute(
        sql,
        [tokenId]
    );

    return resultado.affectedRows;
}