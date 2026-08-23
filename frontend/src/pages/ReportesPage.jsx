import { useEffect, useState } from "react";

import {
  obtenerReporteMarcas,
  exportarReporteMarcas,
} from "../services/reportes.service.js";

import {
  obtenerDepartamentos,
} from "../services/departamentos.service.js";

import "../styles/reportes.css";

function ReportesPage() {
  const [reporte, setReporte] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [filtros, setFiltros] = useState({
    usuario: "",
    anio: "",
    mes: "",
    dia: "",
    departamento_id: "",
  });
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(true);
  const [exportando, setExportando] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, []);

  async function cargarDatos() {
    setError("");

    try {
      const respuestaDepartamentos =
        await obtenerDepartamentos();

      setDepartamentos(
        respuestaDepartamentos.datos,
      );

      await cargarReporte();
    } catch (error) {
      setError(error.message);
    } finally {
      setCargando(false);
    }
  }

  async function cargarReporte(
    filtrosConsulta = filtros,
  ) {
    try {
      const respuesta =
        await obtenerReporteMarcas(
          filtrosConsulta,
        );

      setReporte(respuesta.datos);
    } catch (error) {
      setError(error.message);
    }
  }

  function manejarCambio(evento) {
    const { name, value } = evento.target;

    setFiltros({
      ...filtros,
      [name]: value,
    });
  }

  async function manejarFiltrar(evento) {
    evento.preventDefault();

    setMensaje("");
    setError("");
    setCargando(true);

    try {
      await cargarReporte();
    } finally {
      setCargando(false);
    }
  }

  async function limpiarFiltros() {
    const filtrosVacios = {
      usuario: "",
      anio: "",
      mes: "",
      dia: "",
      departamento_id: "",
    };

    setFiltros(filtrosVacios);
    setMensaje("");
    setError("");
    setCargando(true);

    try {
      await cargarReporte(
        filtrosVacios,
      );
    } finally {
      setCargando(false);
    }
  }

  async function manejarExportacion(formato) {
    setMensaje("");
    setError("");
    setExportando(true);

    try {
      const archivo =
        await exportarReporteMarcas(
          filtros,
          formato,
        );

      const url =
        URL.createObjectURL(archivo);

      const enlace =
        document.createElement("a");

      enlace.href = url;
      enlace.download =
        `reporte_marcas.${formato}`;

      document.body.appendChild(
        enlace,
      );

      enlace.click();

      document.body.removeChild(
        enlace,
      );

      URL.revokeObjectURL(url);

      setMensaje(
        "Reporte exportado correctamente",
      );
    } catch (error) {
      setError(error.message);
    } finally {
      setExportando(false);
    }
  }

  function mostrarValor(valor) {
    if (
      valor === null ||
      valor === undefined ||
      valor === ""
    ) {
      return "-";
    }

    return valor;
  }

  function volverPerfil() {
    window.location.href = "/perfil";
  }

  if (cargando) {
    return (
      <main className="reportes-contenedor">
        <p>Cargando reporte...</p>
      </main>
    );
  }

  return (
    <main className="reportes-contenedor">
      <h1>Reporte de marcas</h1>

      <section className="reportes-seccion">
        <h2>Filtros</h2>

        <form
          className="reportes-formulario"
          onSubmit={manejarFiltrar}
        >
          <div>
            <label htmlFor="usuario">
              Usuario
            </label>

            <input
              id="usuario"
              name="usuario"
              type="text"
              value={filtros.usuario}
              onChange={manejarCambio}
            />
          </div>

          <div>
            <label htmlFor="anio">
              Anio
            </label>

            <input
              id="anio"
              name="anio"
              type="number"
              min="2000"
              max="2100"
              value={filtros.anio}
              onChange={manejarCambio}
            />
          </div>

          <div>
            <label htmlFor="mes">
              Mes
            </label>

            <select
              id="mes"
              name="mes"
              value={filtros.mes}
              onChange={manejarCambio}
            >
              <option value="">
                Todos
              </option>

              <option value="1">
                Enero
              </option>

              <option value="2">
                Febrero
              </option>

              <option value="3">
                Marzo
              </option>

              <option value="4">
                Abril
              </option>

              <option value="5">
                Mayo
              </option>

              <option value="6">
                Junio
              </option>

              <option value="7">
                Julio
              </option>

              <option value="8">
                Agosto
              </option>

              <option value="9">
                Septiembre
              </option>

              <option value="10">
                Octubre
              </option>

              <option value="11">
                Noviembre
              </option>

              <option value="12">
                Diciembre
              </option>
            </select>
          </div>

          <div>
            <label htmlFor="dia">
              Dia
            </label>

            <input
              id="dia"
              name="dia"
              type="number"
              min="1"
              max="31"
              value={filtros.dia}
              onChange={manejarCambio}
            />
          </div>

          <div>
            <label htmlFor="departamento_id">
              Departamento
            </label>

            <select
              id="departamento_id"
              name="departamento_id"
              value={filtros.departamento_id}
              onChange={manejarCambio}
            >
              <option value="">
                Todos
              </option>

              {departamentos.map(
                (departamento) => (
                  <option
                    key={departamento.id}
                    value={departamento.id}
                  >
                    {departamento.nombre}
                  </option>
                ),
              )}
            </select>
          </div>

          <div className="reportes-acciones">
            <button
              className="reportes-boton"
              type="submit"
            >
              Filtrar
            </button>

            <button
              className="reportes-boton"
              type="button"
              onClick={limpiarFiltros}
            >
              Limpiar filtros
            </button>
          </div>
        </form>
      </section>

      <section className="reportes-seccion">
        <h2>Resultados</h2>

        {reporte.length === 0 && (
          <p>No hay marcas para mostrar.</p>
        )}

        {reporte.length > 0 && (
          <div className="reportes-tabla-contenedor">
            <table className="reportes-tabla">
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Fecha</th>
                  <th>Hora entrada</th>
                  <th>Hora salida</th>
                  <th>Dispositivo</th>
                  <th>Direccion IP</th>
                </tr>
              </thead>

              <tbody>
                {reporte.map(
                  (registro) => (
                    <tr key={registro.id}>
                      <td>
                        {mostrarValor(
                          registro.usuario,
                        )}
                      </td>

                      <td>
                        {mostrarValor(
                          registro.fecha,
                        )}
                      </td>

                      <td>
                        {mostrarValor(
                          registro.hora_entrada,
                        )}
                      </td>

                      <td>
                        {mostrarValor(
                          registro.hora_salida,
                        )}
                      </td>

                      <td>
                        {mostrarValor(
                          registro.dispositivo,
                        )}
                      </td>

                      <td>
                        {mostrarValor(
                          registro.direccion_ip,
                        )}
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="reportes-seccion">
        <h2>Exportar reporte</h2>

        <div className="reportes-acciones">
          <button
            className="reportes-boton"
            type="button"
            disabled={exportando}
            onClick={() =>
              manejarExportacion("json")
            }
          >
            Exportar JSON
          </button>

          <button
            className="reportes-boton"
            type="button"
            disabled={exportando}
            onClick={() =>
              manejarExportacion("xml")
            }
          >
            Exportar XML
          </button>
        </div>
      </section>

      {mensaje && (
        <p className="reportes-mensaje">
          {mensaje}
        </p>
      )}

      {error && (
        <p className="reportes-mensaje">
          {error}
        </p>
      )}

      <div className="reportes-navegacion">
        <button
          className="reportes-boton"
          type="button"
          onClick={volverPerfil}
        >
          Volver al perfil
        </button>
      </div>
    </main>
  );
}

export default ReportesPage;