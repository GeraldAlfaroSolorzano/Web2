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

function App() {
  const pathname = window.location.pathname;

  if (pathname === "/registro") {
    return <RegistroPage />;
  }

  if (pathname === "/perfil") {
    return <PerfilPage />;
  }

  if (pathname === "/cambiar-contrasena") {
    return <CambiarContrasenaPage />;
  }

  if (pathname === "/recuperar-contrasena") {
    return <RecuperarContrasenaPage />;
  }

  if (pathname === "/restablecer-password") {
    return <RestablecerContrasenaPage />;
  }

  if (pathname === "/dispositivos") {
    return <DispositivosPage />;
  }

  if (pathname === "/marcas") {
    return <MarcasPage />;
  }

  if (pathname === "/equipos") {
    return <EquiposPage />;
  }

  if (pathname === "/prestamos") {
    return <PrestamosPage />;
  }

  if (pathname === "/departamentos") {
  return <DepartamentosPage />;
}

if (pathname === "/configuracion") {
  return <ConfiguracionPage />;
}

if (pathname === "/reportes") {
  return <ReportesPage />;
}
  return <LoginPage />;
}

export default App;
