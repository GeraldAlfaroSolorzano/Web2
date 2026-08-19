import bcrypt from 'bcrypt';

import {
    obtenerUsuarioPorCorreo,
    obtenerUsuarioPorNombreUsuario,
    obtenerDepartamentoPorId,
    crearUsuario,
    obtenerUsuarioPorId,
    actualizarPerfil,
    obtenerPasswordHashPorId,
    actualizarPasswordHash
} from '../models/usuarios.model.js';

export async function registrarUsuario(req, res) {
    try {
        const {
            nombre_completo,
            fecha_nacimiento,
            correo,
            departamento_id,
            nombre_usuario,
            contrasena
        } = req.body;

        const correoExistente = await obtenerUsuarioPorCorreo(
            correo
        );

        if (correoExistente) {
            return res.status(409).json({
                exito: false,
                mensaje: 'El correo ya se encuentra registrado'
            });
        }

        const usuarioExistente = await obtenerUsuarioPorNombreUsuario(
            nombre_usuario
        );

        if (usuarioExistente) {
            return res.status(409).json({
                exito: false,
                mensaje: 'El nombre de usuario ya se encuentra registrado'
            });
        }

        const departamento = await obtenerDepartamentoPorId(
            departamento_id
        );

        if (!departamento) {
            return res.status(404).json({
                exito: false,
                mensaje: 'El departamento seleccionado no existe'
            });
        }

        const passwordHash = await bcrypt.hash(
            contrasena,
            10
        );

        const datosUsuario = {
            nombre_completo,
            fecha_nacimiento,
            correo,
            departamento_id,
            nombre_usuario,
            password_hash: passwordHash
        };

        const usuarioId = await crearUsuario(
            datosUsuario
        );

        return res.status(201).json({
            exito: true,
            mensaje: 'Usuario registrado correctamente',
            datos: {
                id: usuarioId,
                nombre_completo,
                fecha_nacimiento,
                correo,
                departamento_id,
                nombre_usuario
            }
        });
    } catch (error) {
        return res.status(500).json({
            exito: false,
            mensaje: 'Ocurrio un error al registrar el usuario'
        });
    }
}

export async function consultarPerfil(req, res) {
    try {
        const usuarioId = req.session.usuario.id;

        const usuario = await obtenerUsuarioPorId(
            usuarioId
        );

        if (!usuario) {
            return res.status(404).json({
                exito: false,
                mensaje: 'El usuario no existe'
            });
        }

        return res.status(200).json({
            exito: true,
            mensaje: 'Perfil obtenido correctamente',
            datos: usuario
        });
    } catch (error) {
        return res.status(500).json({
            exito: false,
            mensaje: 'Ocurrio un error al consultar el perfil'
        });
    }
}


export async function modificarPerfil(req, res) {
    try {
        const usuarioId = req.session.usuario.id;

        const {
            nombre_completo,
            fecha_nacimiento,
            departamento_id
        } = req.body;

        const departamento = await obtenerDepartamentoPorId(
            departamento_id
        );

        if (!departamento) {
            return res.status(404).json({
                exito: false,
                mensaje: 'El departamento seleccionado no existe'
            });
        }

        const datosPerfil = {
            nombre_completo,
            fecha_nacimiento,
            departamento_id
        };

        const filasAfectadas = await actualizarPerfil(
            usuarioId,
            datosPerfil
        );

        if (filasAfectadas === 0) {
            return res.status(404).json({
                exito: false,
                mensaje: 'No se pudo actualizar el perfil'
            });
        }

        const perfilActualizado = await obtenerUsuarioPorId(
            usuarioId
        );

        return res.status(200).json({
            exito: true,
            mensaje: 'Perfil actualizado correctamente',
            datos: perfilActualizado
        });
    } catch (error) {
        return res.status(500).json({
            exito: false,
            mensaje: 'Ocurrio un error al actualizar el perfil'
        });
    }
}


export async function cambiarContrasena(req, res) {
    try {
        const usuarioId = req.session.usuario.id;

        const {
            contrasena_actual,
            nueva_contrasena
        } = req.body;

        const usuario = await obtenerPasswordHashPorId(
            usuarioId
        );

        if (!usuario) {
            return res.status(404).json({
                exito: false,
                mensaje: 'El usuario no existe'
            });
        }

        const contrasenaCorrecta = await bcrypt.compare(
            contrasena_actual,
            usuario.password_hash
        );

        if (!contrasenaCorrecta) {
            return res.status(400).json({
                exito: false,
                mensaje: 'La contrasena actual es incorrecta'
            });
        }

        const nuevoPasswordHash = await bcrypt.hash(
            nueva_contrasena,
            10
        );

        const filasAfectadas = await actualizarPasswordHash(
            usuarioId,
            nuevoPasswordHash
        );

        if (filasAfectadas === 0) {
            return res.status(500).json({
                exito: false,
                mensaje: 'No se pudo actualizar la contrasena'
            });
        }

        return res.status(200).json({
            exito: true,
            mensaje: 'Contrasena actualizada correctamente'
        });
    } catch (error) {
        return res.status(500).json({
            exito: false,
            mensaje: 'Ocurrio un error al cambiar la contrasena'
        });
    }
}