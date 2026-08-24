import { useState } from "react";

import { cerrarSesion } from "../services/auth.service.js";
import "../styles/menu.css";

function MenuNavegacion({ usuario }) {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [error, setError] = useState("");
  const [cerrandoSesion, setCerrandoSesion] = useState(false);

  const esAdministrador = usuario.rol_id === 2;

  let claseMenu = "menu-lateral";

  if (menuAbierto) {
    claseMenu = "menu-lateral menu-lateral-abierto";
  }

  function abrirMenu() {
    setMenuAbierto(true);
  }

  function cerrarMenu() {
    setMenuAbierto(false);
  }

  function navegar(ruta) {
    setMenuAbierto(false);
    window.location.href = ruta;
  }

  async function manejarCerrarSesion() {
    try {
      setError("");
      setCerrandoSesion(true);

      await cerrarSesion();

      window.location.href = "/";
    } catch (errorSolicitud) {
      setError(errorSolicitud.message);
      setCerrandoSesion(false);
    }
  }

  return (
    <>
      <header className="barra-superior">
        <button
          className="boton-hamburguesa"
          type="button"
          onClick={abrirMenu}
          aria-label="Abrir menu"
        >
          <i className="bi bi-list"></i>
        </button>

        <h1 className="titulo-sistema">Sistema de Prestamos</h1>
      </header>

      {menuAbierto && <div className="fondo-menu" onClick={cerrarMenu}></div>}

      <aside className={claseMenu}>
        <div className="encabezado-menu">
          <h2>Menu</h2>

          <button
            className="boton-cerrar-menu"
            type="button"
            onClick={cerrarMenu}
            aria-label="Cerrar menu"
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <div className="usuario-menu">
          <i className="bi bi-person-circle"></i>

          <div>
            <span>Usuario</span>
            <strong>{usuario.nombre_usuario}</strong>
          </div>
        </div>

        <nav className="opciones-menu">
          <button type="button" onClick={() => navegar("/perfil")}>
            <i className="bi bi-person"></i>
            Perfil
          </button>

          <button type="button" onClick={() => navegar("/dispositivos")}>
            <i className="bi bi-phone"></i>
            Dispositivos
          </button>

          <button type="button" onClick={() => navegar("/marcas")}>
            <i className="bi bi-check-circle"></i>
            Marcas
          </button>

          {esAdministrador && (
            <>
              <div className="separador-menu">Administracion</div>

              <button type="button" onClick={() => navegar("/equipos")}>
                <i className="bi bi-pc-display"></i>
                Equipos
              </button>

              <button type="button" onClick={() => navegar("/prestamos")}>
                <i className="bi bi-arrow-left-right"></i>
                Prestamos
              </button>

              <button type="button" onClick={() => navegar("/departamentos")}>
                <i className="bi bi-building"></i>
                Departamentos
              </button>

              <button type="button" onClick={() => navegar("/reportes")}>
                <i className="bi bi-bar-chart"></i>
                Reportes
              </button>

              <button type="button" onClick={() => navegar("/configuracion")}>
                <i className="bi bi-gear"></i>
                Configuracion
              </button>
            </>
          )}

          <div className="separador-menu">Cuenta</div>

          <button type="button" onClick={() => navegar("/cambiar-contrasena")}>
            <i className="bi bi-key"></i>
            Cambiar contrasena
          </button>
        </nav>

        <div className="pie-menu">
          <button
            className="boton-cerrar-sesion"
            type="button"
            onClick={manejarCerrarSesion}
            disabled={cerrandoSesion}
          >
            <i className="bi bi-box-arrow-right"></i>
            Cerrar sesion
          </button>
        </div>
      </aside>

      <div className="espacio-barra"></div>

      {error && (
        <div className="container mt-3">
          <div className="alert alert-danger">{error}</div>
        </div>
      )}
    </>
  );
}

export default MenuNavegacion;
