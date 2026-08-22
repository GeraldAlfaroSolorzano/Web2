import { useEffect, useState } from "react";
import { API_URL } from "../config/api.js";

import {
  obtenerPrestamos,
  obtenerPrestamoPorId,
  registrarPrestamo,
  devolverEquipoPrestamo,
  devolverPrestamoCompleto,
} from "../services/prestamos.service.js";

function PrestamosPage() {
  const [prestamos, setPrestamos] = useState([]);
  const [equiposDisponibles, setEquiposDisponibles] = useState([]);
  const [numeroPrestamo, setNumeroPrestamo] = useState("");
  const [usuarioId, setUsuarioId] = useState("");
  const [equiposSeleccionados, setEquiposSeleccionados] = useState([]);
  const [prestamoSeleccionado, setPrestamoSeleccionado] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function cargarPrestamos() {
    try {
      const respuesta = await obtenerPrestamos();
      setPrestamos(respuesta.datos);
    } catch (err) {
      setError(err.message);
    }
  }

  async function cargarEquiposDisponibles() {
    try {
      const respuesta = await fetch(`${API_URL}/equipos`, {
        method: "GET",
        credentials: "include",
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        const texto = datos.mensaje || "Error al obtener los equipos";
        throw new Error(texto);
      }

      const disponibles = datos.datos.filter(
        (equipo) => equipo.estado === "DISPONIBLE",
      );

      setEquiposDisponibles(disponibles);
    } catch (err) {
      setError(err.message);
    }
  }

  async function cargarDatos() {
    setError("");

    await cargarPrestamos();
    await cargarEquiposDisponibles();
  }

  useEffect(() => {
    cargarDatos();
  }, []);

  function cambiarEquipo(equipoId, seleccionado) {
    if (seleccionado) {
      if (!equiposSeleccionados.includes(equipoId)) {
        setEquiposSeleccionados([...equiposSeleccionados, equipoId]);
      }

      return;
    }

    const nuevosEquipos = equiposSeleccionados.filter((id) => id !== equipoId);

    setEquiposSeleccionados(nuevosEquipos);
  }

  async function enviarPrestamo(evento) {
    evento.preventDefault();

    setMensaje("");
    setError("");

    if (!numeroPrestamo.trim()) {
      setError("Ingrese el numero de prestamo");
      return;
    }

    if (!usuarioId) {
      setError("Ingrese el id del usuario");
      return;
    }

    if (equiposSeleccionados.length === 0) {
      setError("Seleccione al menos un equipo");
      return;
    }

    const equipos = equiposSeleccionados.map((equipoId) => {
      return {
        equipo_id: equipoId,
      };
    });

    const datosPrestamo = {
      numero_prestamo: numeroPrestamo.trim(),
      usuario_id: Number(usuarioId),
      equipos,
    };

    try {
      setCargando(true);

      const respuesta = await registrarPrestamo(datosPrestamo);

      setMensaje(respuesta.mensaje);
      setNumeroPrestamo("");
      setUsuarioId("");
      setEquiposSeleccionados([]);

      await cargarDatos();
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  async function verPrestamo(id) {
    setMensaje("");
    setError("");

    try {
      const respuesta = await obtenerPrestamoPorId(id);
      setPrestamoSeleccionado(respuesta.datos);
    } catch (err) {
      setError(err.message);
    }
  }

  async function devolverEquipo(prestamoId, detalleId) {
    setMensaje("");
    setError("");

    try {
      setCargando(true);

      const respuesta = await devolverEquipoPrestamo(prestamoId, detalleId);

      setMensaje(respuesta.mensaje);
      setPrestamoSeleccionado(respuesta.datos);

      await cargarDatos();
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  async function devolverTodo(prestamoId) {
    setMensaje("");
    setError("");

    try {
      setCargando(true);

      const respuesta = await devolverPrestamoCompleto(prestamoId);

      setMensaje(respuesta.mensaje);
      setPrestamoSeleccionado(respuesta.datos);

      await cargarDatos();
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  function cerrarDetalle() {
    setPrestamoSeleccionado(null);
  }

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "24px",
      }}
    >
      <h1>Prestamos y devoluciones</h1>

      {mensaje && (
        <div
          style={{
            padding: "12px",
            marginBottom: "16px",
            border: "1px solid #198754",
            borderRadius: "6px",
          }}
        >
          {mensaje}
        </div>
      )}

      {error && (
        <div
          style={{
            padding: "12px",
            marginBottom: "16px",
            border: "1px solid #dc3545",
            borderRadius: "6px",
          }}
        >
          {error}
        </div>
      )}

      <section
        style={{
          marginBottom: "32px",
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "8px",
        }}
      >
        <h2>Registrar prestamo</h2>

        <form onSubmit={enviarPrestamo}>
          <div style={{ marginBottom: "16px" }}>
            <label htmlFor="numero_prestamo">Numero de prestamo</label>

            <input
              id="numero_prestamo"
              type="text"
              value={numeroPrestamo}
              onChange={(evento) => setNumeroPrestamo(evento.target.value)}
              style={{
                display: "block",
                width: "100%",
                padding: "10px",
                marginTop: "6px",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label htmlFor="usuario_id">Id del usuario</label>

            <input
              id="usuario_id"
              type="number"
              min="1"
              value={usuarioId}
              onChange={(evento) => setUsuarioId(evento.target.value)}
              style={{
                display: "block",
                width: "100%",
                padding: "10px",
                marginTop: "6px",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <h3>Equipos disponibles</h3>

            {equiposDisponibles.length === 0 && (
              <p>No hay equipos disponibles.</p>
            )}

            {equiposDisponibles.map((equipo) => (
              <label
                key={equipo.id}
                style={{
                  display: "block",
                  padding: "10px",
                  marginBottom: "8px",
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                }}
              >
                <input
                  type="checkbox"
                  checked={equiposSeleccionados.includes(equipo.id)}
                  onChange={(evento) =>
                    cambiarEquipo(equipo.id, evento.target.checked)
                  }
                />

                <span style={{ marginLeft: "10px" }}>
                  {equipo.codigo} - {equipo.descripcion}
                </span>
              </label>
            ))}
          </div>

          <button
            type="submit"
            disabled={cargando}
            style={{
              padding: "10px 18px",
              cursor: "pointer",
            }}
          >
            Registrar prestamo
          </button>
        </form>
      </section>

      <section>
        <h2>Historial de prestamos</h2>

        {prestamos.length === 0 && <p>No hay prestamos registrados.</p>}

        {prestamos.length > 0 && (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr>
                  <th
                    style={{
                      border: "1px solid #ddd",
                      padding: "10px",
                    }}
                  >
                    Numero
                  </th>

                  <th
                    style={{
                      border: "1px solid #ddd",
                      padding: "10px",
                    }}
                  >
                    Usuario
                  </th>

                  <th
                    style={{
                      border: "1px solid #ddd",
                      padding: "10px",
                    }}
                  >
                    Fecha
                  </th>

                  <th
                    style={{
                      border: "1px solid #ddd",
                      padding: "10px",
                    }}
                  >
                    Encargado
                  </th>

                  <th
                    style={{
                      border: "1px solid #ddd",
                      padding: "10px",
                    }}
                  >
                    Estado
                  </th>

                  <th
                    style={{
                      border: "1px solid #ddd",
                      padding: "10px",
                    }}
                  >
                    Acciones
                  </th>
                </tr>
              </thead>

              <tbody>
                {prestamos.map((prestamo) => (
                  <tr key={prestamo.id}>
                    <td
                      style={{
                        border: "1px solid #ddd",
                        padding: "10px",
                      }}
                    >
                      {prestamo.numero_prestamo}
                    </td>

                    <td
                      style={{
                        border: "1px solid #ddd",
                        padding: "10px",
                      }}
                    >
                      {prestamo.usuario}
                    </td>

                    <td
                      style={{
                        border: "1px solid #ddd",
                        padding: "10px",
                      }}
                    >
                      {prestamo.fecha}
                    </td>

                    <td
                      style={{
                        border: "1px solid #ddd",
                        padding: "10px",
                      }}
                    >
                      {prestamo.encargado}
                    </td>

                    <td
                      style={{
                        border: "1px solid #ddd",
                        padding: "10px",
                      }}
                    >
                      {prestamo.estado}
                    </td>

                    <td
                      style={{
                        border: "1px solid #ddd",
                        padding: "10px",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => verPrestamo(prestamo.id)}
                        style={{
                          marginRight: "8px",
                          padding: "7px 10px",
                        }}
                      >
                        Ver detalle
                      </button>

                      {prestamo.estado === "ACTIVO" && (
                        <button
                          type="button"
                          disabled={cargando}
                          onClick={() => devolverTodo(prestamo.id)}
                          style={{
                            padding: "7px 10px",
                          }}
                        >
                          Devolver todo
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {prestamoSeleccionado && (
        <section
          style={{
            marginTop: "32px",
            padding: "20px",
            border: "1px solid #ddd",
            borderRadius: "8px",
          }}
        >
          <h2>Detalle del prestamo</h2>

          <p>
            <strong>Numero: </strong>
            {prestamoSeleccionado.numero_prestamo}
          </p>

          <p>
            <strong>Usuario: </strong>
            {prestamoSeleccionado.usuario}
          </p>

          <p>
            <strong>Encargado: </strong>
            {prestamoSeleccionado.encargado}
          </p>

          <p>
            <strong>Fecha: </strong>
            {prestamoSeleccionado.fecha}
          </p>

          <p>
            <strong>Estado: </strong>
            {prestamoSeleccionado.estado}
          </p>

          <h3>Equipos</h3>

          {prestamoSeleccionado.equipos.map((equipo) => (
            <div
              key={equipo.id}
              style={{
                padding: "12px",
                marginBottom: "10px",
                border: "1px solid #ddd",
                borderRadius: "6px",
              }}
            >
              <p>
                <strong>Codigo: </strong>
                {equipo.codigo}
              </p>

              <p>
                <strong>Descripcion: </strong>
                {equipo.descripcion}
              </p>

              <p>
                <strong>Estado: </strong>
                {equipo.estado_devolucion}
              </p>

              {equipo.estado_devolucion === "PENDIENTE" && (
                <button
                  type="button"
                  disabled={cargando}
                  onClick={() =>
                    devolverEquipo(prestamoSeleccionado.id, equipo.id)
                  }
                  style={{
                    padding: "7px 10px",
                  }}
                >
                  Devolver equipo
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={cerrarDetalle}
            style={{
              marginTop: "10px",
              padding: "8px 12px",
            }}
          >
            Cerrar detalle
          </button>
        </section>
      )}
    </div>
  );
}

export default PrestamosPage;
