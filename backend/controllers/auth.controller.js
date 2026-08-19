import bcrypt from 'bcrypt';
import crypto from 'crypto';

import {
    obtenerUsuarioPorCredencial,
    obtenerUsuarioRecuperacion,
    crearTokenRecuperacion,
    obtenerTokenRecuperacion,
    actualizarContrasenaRecuperacion,
    marcarTokenComoUsado
} from '../models/auth.model.js';

export async function login(req, res) {
    try {
        const {
            usuario_o_correo,
            contrasena
        } = req.body;

        const usuario = await obtenerUsuarioPorCredencial(
            usuario_o_correo
        );

        if (!usuario) {
            return res.status(401).json({
                exito: false,
                mensaje: 'Usuario o contrasena incorrectos'
            });
        }

        const contrasenaValida = await bcrypt.compare(
            contrasena,
            usuario.password_hash
        );

        if (!contrasenaValida) {
            return res.status(401).json({
                exito: false,
                mensaje: 'Usuario o contrasena incorrectos'
            });
        }

        req.session.usuario = {
            id: usuario.id,
            rol_id: usuario.rol_id,
            departamento_id: usuario.departamento_id,
            nombre_usuario: usuario.nombre_usuario
        };

        return res.status(200).json({
            exito: true,
            mensaje: 'Inicio de sesion correcto',
            datos: {
                id: usuario.id,
                rol_id: usuario.rol_id,
                departamento_id: usuario.departamento_id,
                nombre_completo: usuario.nombre_completo,
                correo: usuario.correo,
                nombre_usuario: usuario.nombre_usuario
            }
        });
    } catch (error) {
        return res.status(500).json({
            exito: false,
            mensaje: 'Ocurrio un error al iniciar sesion'
        });
    }
}

export function logout(req, res) {
    if (!req.session.usuario) {
        return res.status(401).json({
            exito: false,
            mensaje: 'No hay una sesion activa'
        });
    }

    req.session.destroy((error) => {
        if (error) {
            return res.status(500).json({
                exito: false,
                mensaje: 'Ocurrio un error al cerrar sesion'
            });
        }

        res.clearCookie(
            'web2.sid',
            {
                path: '/'
            }
        );

        return res.status(200).json({
            exito: true,
            mensaje: 'Sesion cerrada correctamente'
        });
    });
}

export async function solicitarRecuperacion(req, res) {
    try {
        const {
            usuario_o_correo
        } = req.body;

        const usuario = await obtenerUsuarioRecuperacion(
            usuario_o_correo
        );

        if (!usuario) {
            return res.status(404).json({
                exito: false,
                mensaje: 'El usuario no existe'
            });
        }

        const token = crypto
            .randomBytes(32)
            .toString('hex');

        const fechaExpiracion = new Date();

        fechaExpiracion.setMinutes(
            fechaExpiracion.getMinutes() + 15
        );

        await crearTokenRecuperacion(
            usuario.id,
            token,
            fechaExpiracion
        );

        const enlaceRecuperacion =
            `http://localhost:5173/restablecer-password?token=${token}`;

        return res.status(200).json({
            exito: true,
            mensaje: 'Token de recuperacion generado correctamente',
            datos: {
                enlace_recuperacion: enlaceRecuperacion
            }
        });
    } catch (error) {
        return res.status(500).json({
            exito: false,
            mensaje: 'Ocurrio un error al solicitar la recuperacion'
        });
    }
}

export async function restablecerContrasena(req, res) {
    try {
        const {
            token,
            nueva_contrasena
        } = req.body;

        const tokenRecuperacion = await obtenerTokenRecuperacion(
            token
        );

        if (!tokenRecuperacion) {
            return res.status(400).json({
                exito: false,
                mensaje: 'El token de recuperacion no es valido'
            });
        }

        if (tokenRecuperacion.usado) {
            return res.status(400).json({
                exito: false,
                mensaje: 'El token de recuperacion ya fue utilizado'
            });
        }

        const fechaActual = new Date();
        const fechaExpiracion = new Date(
            tokenRecuperacion.fecha_expiracion
        );

        if (fechaActual > fechaExpiracion) {
            return res.status(400).json({
                exito: false,
                mensaje: 'El token de recuperacion ha expirado'
            });
        }

        const passwordHash = await bcrypt.hash(
            nueva_contrasena,
            10
        );

        const filasAfectadas =
            await actualizarContrasenaRecuperacion(
                tokenRecuperacion.usuario_id,
                passwordHash
            );

        if (filasAfectadas === 0) {
            return res.status(500).json({
                exito: false,
                mensaje: 'No se pudo restablecer la contrasena'
            });
        }

        await marcarTokenComoUsado(
            tokenRecuperacion.id
        );

        return res.status(200).json({
            exito: true,
            mensaje: 'Contrasena restablecida correctamente'
        });
    } catch (error) {
        return res.status(500).json({
            exito: false,
            mensaje: 'Ocurrio un error al restablecer la contrasena'
        });
    }
}