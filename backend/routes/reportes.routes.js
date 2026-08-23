import { Router } from 'express';

import {
    consultarReporteMarcas,
    exportarReporteMarcas
} from '../controllers/reportes.controller.js';

import {
    validarFiltrosReporte,
    validarFormatoExportacion
} from '../middlewares/reportes.middleware.js';

import {
    verificarSesion
} from '../middlewares/sesion.middleware.js';

import {
    verificarAdministrador
} from '../middlewares/rol.middleware.js';

const router = Router();

router.get(
    '/marcas',
    verificarSesion,
    verificarAdministrador,
    validarFiltrosReporte,
    consultarReporteMarcas
);

router.get(
    '/marcas/exportar/:formato',
    verificarSesion,
    verificarAdministrador,
    validarFormatoExportacion,
    validarFiltrosReporte,
    exportarReporteMarcas
);

export default router;