import LoginPage from "./pages/LoginPage.jsx";
import RegistroPage from "./pages/RegistroPage.jsx";
import PerfilPage from "./pages/PerfilPage.jsx";
import CambiarContrasenaPage from "./pages/CambiarContrasenaPage.jsx";
import RecuperarContrasenaPage from "./pages/RecuperarContrasenaPage.jsx";
import RestablecerContrasenaPage from "./pages/RestablecerContrasenaPage.jsx";
import DispositivosPage from "./pages/DispositivosPage.jsx";
import MarcasPage from "./pages/MarcasPage.jsx";

function App() {
  const ruta = window.location.pathname;

  if (ruta === "/registro") {
    return <RegistroPage />;
  }

  if (ruta === "/perfil") {
    return <PerfilPage />;
  }

  if (ruta === "/cambiar-contrasena") {
    return <CambiarContrasenaPage />;
  }

  if (ruta === "/recuperar-contrasena") {
    return <RecuperarContrasenaPage />;
  }

  if (ruta === "/restablecer-password") {
    return <RestablecerContrasenaPage />;
  }

  if (ruta === "/dispositivos") {
    return <DispositivosPage />;
  }

  if (ruta === "/marcas") {
    return <MarcasPage />;
  }

  return <LoginPage />;
}

export default App;
