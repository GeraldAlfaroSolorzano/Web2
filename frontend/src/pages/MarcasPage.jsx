import { useEffect, useState } from "react";

import {
  obtenerMarcas,
  registrarMarca,
  obtenerIdentificadorDispositivo,
} from "../services/marcas.service.js";

import "../styles/marcas.css";

function MarcasPage() {
  const [marcas, setMarcas] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(true);
  const [registrando, setRegistrando] = useState(false);
  const [tieneDispositivo, setTieneDispositivo] = useState(false);

  useEffect(() => {
    verificarDispositivo();
    cargarMarcas();
  }, []);

  function verificarDispositivo() {
    const identificador = obtenerIdentificadorDispositivo();

    if (identificador) {
      setTieneDispositivo(true);

      return;
    }

    setTieneDispositivo(false);
  }

  async function cargarMarcas() {
    try {
      const respuesta = await obtenerMarcas();

      setMarcas(respuesta.datos);
    } catch (error) {
      setError(error.message);
    } finally {
      setCargando(false);
    }
  }

  async function manejarRegistroMarca() {
    setMensaje("");
    setError("");

    const identificador = obtenerIdentificadorDispositivo();

    if (!identificador) {
      setError("Debe seleccionar un dispositivo antes de realizar una marca");

      return;
    }

    setRegistrando(true);

    try {
      const respuesta = await registrarMarca();

      setMensaje(respuesta.mensaje);

      await cargarMarcas();
    } catch (error) {
      setError(error.message);
    } finally {
      setRegistrando(false);
    }
  }

  function irDispositivos() {
    window.location.href = "/dispositivos";
  }

  function irPerfil() {
    window.location.href = "/perfil";
  }

  let ultimaMarca = null;

  if (marcas.length > 0) {
    ultimaMarca = marcas[0];
  }

  if (cargando) {
    return (
      <main className="marcas-contenedor">
        <p>Cargando marcas...</p>
      </main>
    );
  }

  return (
    <main className="marcas-contenedor">
      <h1>Registro de marcas</h1>

      <section className="marcas-seccion">
        <h2>Realizar marca</h2>

        {tieneDispositivo && (
          <p>Este navegador tiene un dispositivo seleccionado.</p>
        )}

        {!tieneDispositivo && (
          <div>
            <p>No hay un dispositivo seleccionado en este navegador.</p>

            <button
              className="marcas-boton"
              type="button"
              onClick={irDispositivos}
            >
              Ir a dispositivos
            </button>
          </div>
        )}

        <button
          className="marcas-boton"
          type="button"
          onClick={manejarRegistroMarca}
          disabled={registrando || !tieneDispositivo}
        >
          Registrar marca
        </button>
      </section>

      {ultimaMarca && (
        <section className="marcas-seccion">
          <h2>Ultima marca</h2>

          <p>Tipo: {ultimaMarca.tipo_marca}</p>

          <p>Fecha: {ultimaMarca.fecha}</p>

          <p>Hora: {ultimaMarca.hora}</p>

          <p>Dispositivo: {ultimaMarca.dispositivo}</p>

          <p>IP: {ultimaMarca.direccion_ip}</p>
        </section>
      )}

      <section className="marcas-seccion">
        <h2>Mis marcas</h2>

        {marcas.length === 0 && <p>No hay marcas registradas.</p>}

        {marcas.length > 0 && (
          <div className="marcas-tabla-contenedor">
            <table className="marcas-tabla">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Hora</th>
                  <th>Tipo</th>
                  <th>Dispositivo</th>
                  <th>Direccion IP</th>
                </tr>
              </thead>

              <tbody>
                {marcas.map((marca) => (
                  <tr key={marca.id}>
                    <td>{marca.fecha}</td>

                    <td>{marca.hora}</td>

                    <td>{marca.tipo_marca}</td>

                    <td>{marca.dispositivo}</td>

                    <td>{marca.direccion_ip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {mensaje && <p className="marcas-mensaje">{mensaje}</p>}

      {error && <p className="marcas-mensaje">{error}</p>}

      <div className="marcas-navegacion">
        <button className="marcas-boton" type="button" onClick={irDispositivos}>
          Mis dispositivos
        </button>

        <button className="marcas-boton" type="button" onClick={irPerfil}>
          Volver al perfil
        </button>
      </div>
    </main>
  );
}

export default MarcasPage;
