import { useEffect, useState } from "react";

import LoginPage from "./pages/LoginPage.jsx";
import RegistroPage from "./pages/RegistroPage.jsx";
import PerfilPage from "./pages/PerfilPage.jsx";
import CambiarContrasenaPage from "./pages/CambiarContrasenaPage.jsx";
import RecuperarContrasenaPage from "./pages/RecuperarContrasenaPage.jsx";
import RestablecerContrasenaPage from "./pages/RestablecerContrasenaPage.jsx";
import DispositivosPage from "./pages/DispositivosPage.jsx";
import MarcasPage from "./pages/MarcasPage.jsx";
import EquiposPage from "./pages/EquiposPage.jsx";
import PrestamosPage from "./pages/PrestamosPage.jsx";
import DepartamentosPage from "./pages/DepartamentosPage.jsx";
import ConfiguracionPage from "./pages/ConfiguracionPage.jsx";
import ReportesPage from "./pages/ReportesPage.jsx";
import MenuNavegacion from "./components/MenuNavegacion.jsx";

import { obtenerPerfil } from "./services/auth.service.js";

function App() {
  const pathname = window.location.pathname;

  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    verificarAcceso();
  }, []);

  async function verificarAcceso() {
    if (
      pathname === "/" ||
      pathname === "/login" ||
      pathname === "/registro" ||
      pathname === "/recuperar-contrasena" ||
      pathname === "/restablecer-password"
    ) {
      setCargando(false);
      return;
    }

    try {
      const respuesta = await obtenerPerfil();

      setUsuario(respuesta.datos);
      setCargando(false);
    } catch (error) {
      window.location.href = "/";
    }
  }

  if (pathname === "/registro") {
    return <RegistroPage />;
  }

  if (pathname === "/recuperar-contrasena") {
    return <RecuperarContrasenaPage />;
  }

  if (pathname === "/restablecer-password") {
    return <RestablecerContrasenaPage />;
  }

  if (pathname === "/" || pathname === "/login") {
    return <LoginPage />;
  }

  if (cargando) {
    return (
      <div className="container mt-5 text-center">
        <p>Cargando...</p>
      </div>
    );
  }

  const esAdministrador = usuario.rol_id === 2;

  if (!esAdministrador) {
    if (
      pathname === "/equipos" ||
      pathname === "/prestamos" ||
      pathname === "/departamentos" ||
      pathname === "/reportes" ||
      pathname === "/configuracion"
    ) {
      window.location.href = "/perfil";
      return null;
    }
  }

  let pagina = null;

  if (pathname === "/perfil") {
    pagina = <PerfilPage />;
  }

  if (pathname === "/cambiar-contrasena") {
    pagina = <CambiarContrasenaPage />;
  }

  if (pathname === "/dispositivos") {
    pagina = <DispositivosPage />;
  }

  if (pathname === "/marcas") {
    pagina = <MarcasPage />;
  }

  if (pathname === "/equipos") {
    pagina = <EquiposPage />;
  }

  if (pathname === "/prestamos") {
    pagina = <PrestamosPage />;
  }

  if (pathname === "/departamentos") {
    pagina = <DepartamentosPage />;
  }

  if (pathname === "/reportes") {
    pagina = <ReportesPage />;
  }

  if (pathname === "/configuracion") {
    pagina = <ConfiguracionPage />;
  }

  if (!pagina) {
    window.location.href = "/perfil";
    return null;
  }

  return (
    <>
      <MenuNavegacion usuario={usuario} />
      {pagina}
    </>
  );
}

export default App;
