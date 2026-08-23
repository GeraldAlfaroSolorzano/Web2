import { useEffect, useState } from "react";

import {
  obtenerConfiguracion,
  actualizarConfiguracion,
} from "../services/configuracion.service.js";

import "../styles/configuracion.css";

function ConfiguracionPage() {
  const [formulario, setFormulario] = useState({
    nombre_institucion: "",
    rango_ip_inicio: "",
    rango_ip_fin: "",
    tiempo_maximo_sesion: "",
    tamano_maximo_archivo: "",
  });
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    cargarConfiguracion();
  }, []);

  async function cargarConfiguracion() {
    try {
      const respuesta = await obtenerConfiguracion();
      const configuracion = respuesta.datos;

      setFormulario({
        nombre_institucion: configuracion.nombre_institucion || "",
        rango_ip_inicio: configuracion.rango_ip_inicio || "",
        rango_ip_fin: configuracion.rango_ip_fin || "",
        tiempo_maximo_sesion:
          configuracion.tiempo_maximo_sesion || "",
        tamano_maximo_archivo:
          configuracion.tamano_maximo_archivo || "",
      });
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

  async function manejarEnvio(evento) {
    evento.preventDefault();

    setMensaje("");
    setError("");

    if (!formulario.nombre_institucion.trim()) {
      setError("El nombre de la institucion es requerido");
      return;
    }

    if (!formulario.rango_ip_inicio.trim()) {
      setError("La IP inicial es requerida");
      return;
    }

    if (!formulario.rango_ip_fin.trim()) {
      setError("La IP final es requerida");
      return;
    }

    if (!formulario.tiempo_maximo_sesion) {
      setError("El tiempo maximo de sesion es requerido");
      return;
    }

    if (!formulario.tamano_maximo_archivo) {
      setError("El tamano maximo de archivo es requerido");
      return;
    }

    const datosConfiguracion = {
      nombre_institucion: formulario.nombre_institucion.trim(),
      rango_ip_inicio: formulario.rango_ip_inicio.trim(),
      rango_ip_fin: formulario.rango_ip_fin.trim(),
      tiempo_maximo_sesion: Number(
        formulario.tiempo_maximo_sesion,
      ),
      tamano_maximo_archivo: Number(
        formulario.tamano_maximo_archivo,
      ),
    };

    try {
      setGuardando(true);

      const respuesta =
        await actualizarConfiguracion(datosConfiguracion);

      setMensaje(respuesta.mensaje);
    } catch (error) {
      setError(error.message);
    } finally {
      setGuardando(false);
    }
  }

  function volverPerfil() {
    window.location.href = "/perfil";
  }

  if (cargando) {
    return (
      <main className="configuracion-contenedor">
        <p>Cargando configuracion...</p>
      </main>
    );
  }

  return (
    <main className="configuracion-contenedor">
      <h1>Configuracion del sistema</h1>

      <section className="configuracion-seccion">
        <form
          className="configuracion-formulario"
          onSubmit={manejarEnvio}
        >
          <div>
            <label htmlFor="nombre_institucion">
              Nombre de la institucion
            </label>

            <input
              id="nombre_institucion"
              name="nombre_institucion"
              type="text"
              maxLength="150"
              value={formulario.nombre_institucion}
              onChange={manejarCambio}
              required
            />
          </div>

          <div>
            <label htmlFor="rango_ip_inicio">
              Rango IP inicial
            </label>

            <input
              id="rango_ip_inicio"
              name="rango_ip_inicio"
              type="text"
              maxLength="45"
              value={formulario.rango_ip_inicio}
              onChange={manejarCambio}
              required
            />
          </div>

          <div>
            <label htmlFor="rango_ip_fin">
              Rango IP final
            </label>

            <input
              id="rango_ip_fin"
              name="rango_ip_fin"
              type="text"
              maxLength="45"
              value={formulario.rango_ip_fin}
              onChange={manejarCambio}
              required
            />
          </div>

          <div>
            <label htmlFor="tiempo_maximo_sesion">
              Tiempo maximo de sesion
            </label>

            <input
              id="tiempo_maximo_sesion"
              name="tiempo_maximo_sesion"
              type="number"
              min="1"
              value={formulario.tiempo_maximo_sesion}
              onChange={manejarCambio}
              required
            />
          </div>

          <div>
            <label htmlFor="tamano_maximo_archivo">
              Tamano maximo de archivo
            </label>

            <input
              id="tamano_maximo_archivo"
              name="tamano_maximo_archivo"
              type="number"
              min="1"
              value={formulario.tamano_maximo_archivo}
              onChange={manejarCambio}
              required
            />
          </div>

          <button
            className="configuracion-boton"
            type="submit"
            disabled={guardando}
          >
            Guardar configuracion
          </button>
        </form>
      </section>

      {mensaje && (
        <p className="configuracion-mensaje">{mensaje}</p>
      )}

      {error && (
        <p className="configuracion-mensaje">{error}</p>
      )}

      <div className="configuracion-navegacion">
        <button
          className="configuracion-boton"
          type="button"
          onClick={volverPerfil}
        >
          Volver al perfil
        </button>
      </div>
    </main>
  );
}

export default ConfiguracionPage;