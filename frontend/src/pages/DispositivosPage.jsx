import { useEffect, useState } from "react";

import {
  obtenerDispositivos,
  registrarDispositivo,
  cambiarEstadoDispositivo,
  obtenerIdentificadorDispositivo,
  guardarIdentificadorDispositivo,
} from "../services/marcas.service.js";

import "../styles/marcas.css";

function DispositivosPage() {
  const [formulario, setFormulario] = useState({
    nombre: "",
    descripcion: "",
  });

  const [dispositivos, setDispositivos] = useState([]);
  const [identificadorActual, setIdentificadorActual] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarDispositivos();

    const identificador = obtenerIdentificadorDispositivo();

    if (identificador) {
      setIdentificadorActual(identificador);
    }
  }, []);

  async function cargarDispositivos() {
    try {
      const respuesta = await obtenerDispositivos();

      setDispositivos(respuesta.datos);
    } catch (error) {
      setError(error.message);
    } finally {
      setCargando(false);
    }
  }

  function manejarCambio(evento) {
    const { name, value } = evento.target;

    setFormulario({
      ...formulario,
      [name]: value,
    });
  }

  async function manejarRegistro(evento) {
    evento.preventDefault();

    setMensaje("");
    setError("");

    try {
      const respuesta = await registrarDispositivo(formulario);

      setMensaje(respuesta.mensaje);

      setIdentificadorActual(respuesta.datos.identificador);

      setFormulario({
        nombre: "",
        descripcion: "",
      });

      await cargarDispositivos();
    } catch (error) {
      setError(error.message);
    }
  }

  async function manejarEstado(dispositivoId, estadoActual) {
    setMensaje("");
    setError("");

    let nuevoEstado = "ACTIVO";

    if (estadoActual === "ACTIVO") {
      nuevoEstado = "INACTIVO";
    }

    try {
      const respuesta = await cambiarEstadoDispositivo(
        dispositivoId,
        nuevoEstado,
      );

      setMensaje(respuesta.mensaje);

      await cargarDispositivos();
    } catch (error) {
      setError(error.message);
    }
  }

  function seleccionarDispositivo(identificador, estado) {
    setMensaje("");
    setError("");

    if (estado !== "ACTIVO") {
      setError("No se puede seleccionar un dispositivo inactivo");

      return;
    }

    guardarIdentificadorDispositivo(identificador);

    setIdentificadorActual(identificador);

    setMensaje("Dispositivo seleccionado correctamente");
  }

  function irMarcas() {
    window.location.href = "/marcas";
  }

  function irPerfil() {
    window.location.href = "/perfil";
  }

  if (cargando) {
    return (
      <main className="marcas-contenedor">
        <p>Cargando dispositivos...</p>
      </main>
    );
  }

  return (
    <main className="marcas-contenedor">
      <h1>Mis dispositivos</h1>

      <section className="marcas-seccion">
        <h2>Registrar dispositivo</h2>

        <form className="marcas-formulario" onSubmit={manejarRegistro}>
          <div>
            <label htmlFor="nombre">Nombre</label>

            <input
              id="nombre"
              name="nombre"
              type="text"
              value={formulario.nombre}
              onChange={manejarCambio}
              maxLength="100"
              required
            />
          </div>

          <div>
            <label htmlFor="descripcion">Descripcion</label>

            <textarea
              id="descripcion"
              name="descripcion"
              value={formulario.descripcion}
              onChange={manejarCambio}
              maxLength="255"
            />
          </div>

          <button className="marcas-boton" type="submit">
            Registrar dispositivo
          </button>
        </form>
      </section>

      <section className="marcas-seccion">
        <h2>Dispositivos registrados</h2>

        {dispositivos.length === 0 && <p>No hay dispositivos registrados.</p>}

        {dispositivos.length > 0 && (
          <div className="marcas-tabla-contenedor">
            <table className="marcas-tabla">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Descripcion</th>
                  <th>Fecha de registro</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {dispositivos.map((dispositivo) => (
                  <tr key={dispositivo.id}>
                    <td>{dispositivo.nombre}</td>

                    <td>{dispositivo.descripcion}</td>

                    <td>{dispositivo.fecha_registro}</td>

                    <td>{dispositivo.estado}</td>

                    <td>
                      <div className="marcas-acciones">
                        <button
                          className="marcas-boton"
                          type="button"
                          onClick={() =>
                            seleccionarDispositivo(
                              dispositivo.identificador,
                              dispositivo.estado,
                            )
                          }
                        >
                          Seleccionar
                        </button>

                        <button
                          className="marcas-boton"
                          type="button"
                          onClick={() =>
                            manejarEstado(dispositivo.id, dispositivo.estado)
                          }
                        >
                          Cambiar estado
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {identificadorActual && (
        <p className="marcas-mensaje">
          Este navegador tiene un dispositivo seleccionado.
        </p>
      )}

      {mensaje && <p className="marcas-mensaje">{mensaje}</p>}

      {error && <p className="marcas-mensaje">{error}</p>}

      <div className="marcas-navegacion">
        <button className="marcas-boton" type="button" onClick={irMarcas}>
          Ir a marcas
        </button>

        <button className="marcas-boton" type="button" onClick={irPerfil}>
          Volver al perfil
        </button>
      </div>
    </main>
  );
}

export default DispositivosPage;
