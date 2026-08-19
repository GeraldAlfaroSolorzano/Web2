import {
    obtenerDepartamentos,
    obtenerDepartamentoPorId,
    obtenerDepartamentoPorNombre,
    crearDepartamento,
    actualizarDepartamento,
    contarUsuariosDepartamento,
    eliminarDepartamento
} from '../models/departamentos.model.js';

export async function listarDepartamentos(
    req,
    res
) {
    try {
        const departamentos =
            await obtenerDepartamentos();

        return res.status(200).json({
            exito: true,
            mensaje: 'Departamentos obtenidos correctamente',
            datos: departamentos
        });
    } catch (error) {
        return res.status(500).json({
            exito: false,
            mensaje: 'Ocurrio un error al consultar los departamentos'
        });
    }
}

export async function consultarDepartamento(
    req,
    res
) {
    try {
        const departamentoId = Number(
            req.params.id
        );

        const departamento =
            await obtenerDepartamentoPorId(
                departamentoId
            );

        if (!departamento) {
            return res.status(404).json({
                exito: false,
                mensaje: 'El departamento no existe'
            });
        }

        return res.status(200).json({
            exito: true,
            mensaje: 'Departamento obtenido correctamente',
            datos: departamento
        });
    } catch (error) {
        return res.status(500).json({
            exito: false,
            mensaje: 'Ocurrio un error al consultar el departamento'
        });
    }
}

export async function registrarDepartamento(
    req,
    res
) {
    try {
        const {
            nombre,
            descripcion,
            encargado
        } = req.body;

        const departamentoExistente =
            await obtenerDepartamentoPorNombre(
                nombre
            );

        if (departamentoExistente) {
            return res.status(409).json({
                exito: false,
                mensaje: 'El departamento ya se encuentra registrado'
            });
        }

        const datosDepartamento = {
            nombre,
            descripcion,
            encargado
        };

        const departamentoId =
            await crearDepartamento(
                datosDepartamento
            );

        return res.status(201).json({
            exito: true,
            mensaje: 'Departamento registrado correctamente',
            datos: {
                id: departamentoId,
                nombre,
                descripcion,
                encargado
            }
        });
    } catch (error) {
        return res.status(500).json({
            exito: false,
            mensaje: 'Ocurrio un error al registrar el departamento'
        });
    }
}

export async function modificarDepartamento(
    req,
    res
) {
    try {
        const departamentoId = Number(
            req.params.id
        );

        const {
            nombre,
            descripcion,
            encargado
        } = req.body;

        const departamento =
            await obtenerDepartamentoPorId(
                departamentoId
            );

        if (!departamento) {
            return res.status(404).json({
                exito: false,
                mensaje: 'El departamento no existe'
            });
        }

        const departamentoNombre =
            await obtenerDepartamentoPorNombre(
                nombre
            );

        if (
            departamentoNombre &&
            departamentoNombre.id !== departamentoId
        ) {
            return res.status(409).json({
                exito: false,
                mensaje: 'Ya existe un departamento con ese nombre'
            });
        }

        const datosDepartamento = {
            nombre,
            descripcion,
            encargado
        };

        await actualizarDepartamento(
            departamentoId,
            datosDepartamento
        );

        const departamentoActualizado =
            await obtenerDepartamentoPorId(
                departamentoId
            );

        return res.status(200).json({
            exito: true,
            mensaje: 'Departamento actualizado correctamente',
            datos: departamentoActualizado
        });
    } catch (error) {
        return res.status(500).json({
            exito: false,
            mensaje: 'Ocurrio un error al actualizar el departamento'
        });
    }
}

export async function removerDepartamento(
    req,
    res
) {
    try {
        const departamentoId = Number(
            req.params.id
        );

        const departamento =
            await obtenerDepartamentoPorId(
                departamentoId
            );

        if (!departamento) {
            return res.status(404).json({
                exito: false,
                mensaje: 'El departamento no existe'
            });
        }

        const totalUsuarios =
            await contarUsuariosDepartamento(
                departamentoId
            );

        if (totalUsuarios > 0) {
            return res.status(409).json({
                exito: false,
                mensaje: 'No se puede eliminar el departamento porque tiene usuarios asociados'
            });
        }

        await eliminarDepartamento(
            departamentoId
        );

        return res.status(200).json({
            exito: true,
            mensaje: 'Departamento eliminado correctamente'
        });
    } catch (error) {
        return res.status(500).json({
            exito: false,
            mensaje: 'Ocurrio un error al eliminar el departamento'
        });
    }
}