import {
    obtenerReporteMarcas
} from '../models/reportes.model.js';

function obtenerFiltros(req) {
    return {
        usuario: req.query.usuario,
        anio: req.query.anio,
        mes: req.query.mes,
        dia: req.query.dia,
        departamento_id: req.query.departamento_id
    };
}

function escaparXml(valor) {
    if (
        valor === null ||
        valor === undefined
    ) {
        return '';
    }

    return String(valor)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&apos;');
}

function crearXmlReporte(registros) {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>';
    xml += '<reporte_marcas>';

    for (const registro of registros) {
        xml += '<marca>';
        xml += `<id>${escaparXml(registro.id)}</id>`;
        xml += `<usuario>${escaparXml(registro.usuario)}</usuario>`;
        xml += `<fecha>${escaparXml(registro.fecha)}</fecha>`;
        xml += `<hora_entrada>${escaparXml(
            registro.hora_entrada
        )}</hora_entrada>`;
        xml += `<hora_salida>${escaparXml(
            registro.hora_salida
        )}</hora_salida>`;
        xml += `<dispositivo>${escaparXml(
            registro.dispositivo
        )}</dispositivo>`;
        xml += `<direccion_ip>${escaparXml(
            registro.direccion_ip
        )}</direccion_ip>`;
        xml += '</marca>';
    }

    xml += '</reporte_marcas>';

    return xml;
}

export async function consultarReporteMarcas(
    req,
    res
) {
    try {
        const filtros = obtenerFiltros(req);

        const registros =
            await obtenerReporteMarcas(
                filtros
            );

        return res.status(200).json({
            exito: true,
            mensaje: 'Reporte obtenido correctamente',
            datos: registros
        });
    } catch (error) {
        return res.status(500).json({
            exito: false,
            mensaje: 'Ocurrio un error al consultar el reporte'
        });
    }
}

export async function exportarReporteMarcas(
    req,
    res
) {
    try {
        const filtros = obtenerFiltros(req);
        const formato = req.params.formato;

        const registros =
            await obtenerReporteMarcas(
                filtros
            );

        if (formato === 'json') {
            res.setHeader(
                'Content-Type',
                'application/json'
            );

            res.setHeader(
                'Content-Disposition',
                'attachment; filename="reporte_marcas.json"'
            );

            return res.status(200).send(
                JSON.stringify(
                    registros,
                    null,
                    2
                )
            );
        }

        if (formato === 'xml') {
            const xml = crearXmlReporte(
                registros
            );

            res.setHeader(
                'Content-Type',
                'application/xml'
            );

            res.setHeader(
                'Content-Disposition',
                'attachment; filename="reporte_marcas.xml"'
            );

            return res.status(200).send(xml);
        }

        return res.status(400).json({
            exito: false,
            mensaje: 'El formato de exportacion no es valido'
        });
    } catch (error) {
        return res.status(500).json({
            exito: false,
            mensaje: 'Ocurrio un error al exportar el reporte'
        });
    }
}