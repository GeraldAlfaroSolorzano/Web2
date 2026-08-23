import { useEffect, useState } from "react";

import {
  obtenerDepartamentos,
  registrarDepartamento,
  actualizarDepartamento,
  eliminarDepartamento,
} from "../services/departamentos.service.js";

import "../styles/departamentos.css";

function DepartamentosPage() {
  const [departamentos, setDepartamentos] = useState([]);
  const [formulario, setFormulario] = useState({
    nombre: "",
    descripcion: "",
    encargado: "",
  });
  const [departamentoEditando, setDepartamentoEditando] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    cargarDepartamentos();
  }, []);

  async function cargarDepartamentos() {
    try {
      const respuesta = await obtenerDepartamentos();

      setDepartamentos(respuesta.datos);
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

  function limpiarFormulario() {
    setFormulario({
      nombre: "",
      descripcion: "",
      encargado: "",
    });

    setDepartamentoEditando(null);
  }

  async function manejarEnvio(evento) {
    evento.preventDefault();

    setMensaje("");
    setError("");

    if (!formulario.nombre.trim()) {
      setError("El nombre del departamento es requerido");

      return;
    }

    const datosDepartamento = {
      nombre: formulario.nombre.trim(),
      descripcion: formulario.descripcion.trim(),
      encargado: formulario.encargado.trim(),
    };

    try {
      setGuardando(true);

      let respuesta;

      if (departamentoEditando) {
        respuesta = await actualizarDepartamento(
          departamentoEditando,
          datosDepartamento,
        );
      } else {
        respuesta = await registrarDepartamento(datosDepartamento);
      }

      setMensaje(respuesta.mensaje);

      limpiarFormulario();

      await cargarDepartamentos();
    } catch (error) {
      setError(error.message);
    } finally {
      setGuardando(false);
    }
  }

  function seleccionarEditar(departamento) {
    setMensaje("");
    setError("");

    setDepartamentoEditando(departamento.id);

    setFormulario({
      nombre: departamento.nombre,
      descripcion: departamento.descripcion || "",
      encargado: departamento.encargado || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function manejarEliminar(departamentoId) {
    setMensaje("");
    setError("");

    const confirmar = window.confirm(
      "¿Desea eliminar este departamento?",
    );

    if (!confirmar) {
      return;
    }

    try {
      const respuesta = await eliminarDepartamento(departamentoId);

      setMensaje(respuesta.mensaje);

      if (departamentoEditando === departamentoId) {
        limpiarFormulario();
      }

      await cargarDepartamentos();
    } catch (error) {
      setError(error.message);
    }
  }

  function cancelarEdicion() {
    setMensaje("");
    setError("");

    limpiarFormulario();
  }

  function volverPerfil() {
    window.location.href = "/perfil";
  }

  if (cargando) {
    return (
      <main className="departamentos-contenedor">
        <p>Cargando departamentos...</p>
      </main>
    );
  }

  return (
    <main className="departamentos-contenedor">
      <h1>Administracion de departamentos</h1>

      <section className="departamentos-seccion">
        <h2>
          {!departamentoEditando && "Registrar departamento"}
          {departamentoEditando && "Editar departamento"}
        </h2>

        <form
          className="departamentos-formulario"
          onSubmit={manejarEnvio}
        >
          <div>
            <label htmlFor="nombre">Nombre</label>

            <input
              id="nombre"
              name="nombre"
              type="text"
              maxLength="150"
              value={formulario.nombre}
              onChange={manejarCambio}
              required
            />
          </div>

          <div>
            <label htmlFor="descripcion">Descripcion</label>

            <textarea
              id="descripcion"
              name="descripcion"
              maxLength="255"
              value={formulario.descripcion}
              onChange={manejarCambio}
            />
          </div>

          <div>
            <label htmlFor="encargado">Encargado</label>

            <input
              id="encargado"
              name="encargado"
              type="text"
              maxLength="150"
              value={formulario.encargado}
              onChange={manejarCambio}
            />
          </div>

          <div className="departamentos-acciones">
            <button
              className="departamentos-boton"
              type="submit"
              disabled={guardando}
            >
              {!departamentoEditando && "Registrar"}
              {departamentoEditando && "Guardar cambios"}
            </button>

            {departamentoEditando && (
              <button
                className="departamentos-boton"
                type="button"
                onClick={cancelarEdicion}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="departamentos-seccion">
        <h2>Departamentos registrados</h2>

        {departamentos.length === 0 && (
          <p>No hay departamentos registrados.</p>
        )}

        {departamentos.length > 0 && (
          <div className="departamentos-tabla-contenedor">
            <table className="departamentos-tabla">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Descripcion</th>
                  <th>Encargado</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {departamentos.map((departamento) => (
                  <tr key={departamento.id}>
                    <td>{departamento.nombre}</td>
                    <td>{departamento.descripcion}</td>
                    <td>{departamento.encargado}</td>

                    <td>
                      <div className="departamentos-acciones">
                        <button
                          className="departamentos-boton"
                          type="button"
                          onClick={() =>
                            seleccionarEditar(departamento)
                          }
                        >
                          Editar
                        </button>

                        <button
                          className="departamentos-boton"
                          type="button"
                          onClick={() =>
                            manejarEliminar(departamento.id)
                          }
                        >
                          Eliminar
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

      {mensaje && (
        <p className="departamentos-mensaje">{mensaje}</p>
      )}

      {error && (
        <p className="departamentos-mensaje">{error}</p>
      )}

      <div className="departamentos-navegacion">
        <button
          className="departamentos-boton"
          type="button"
          onClick={volverPerfil}
        >
          Volver al perfil
        </button>
      </div>
    </main>
  );
}

export default DepartamentosPage;