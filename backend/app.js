import "dotenv/config";

import express from "express";
import cors from "cors";
import session from "express-session";
import MySQLStoreFactory from "express-mysql-session";

import usuariosRoutes from "./routes/usuarios.routes.js";
import authRoutes from "./routes/auth.routes.js";
import departamentosRoutes from "./routes/departamentos.routes.js";
import dispositivosRoutes from "./routes/dispositivos.routes.js";
import marcasRoutes from "./routes/marcas.routes.js";

const app = express();

const MySQLStore = MySQLStoreFactory(session);

const sessionStore = new MySQLStore({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  createDatabaseTable: false,
  schema: {
    tableName: "sesiones",
    columnNames: {
      session_id: "session_id",
      expires: "expires",
      data: "data",
    },
  },
});

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());

app.use(
  session({
    name: "web2.sid",
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 60 * 60 * 1000,
    },
  }),
);

app.use("/api/usuarios", usuariosRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/departamentos", departamentosRoutes);

app.use("/api/dispositivos", dispositivosRoutes);

app.use("/api/marcas", marcasRoutes);

app.use((req, res) => {
  return res.status(404).json({
    exito: false,
    mensaje: "Ruta no encontrada",
  });
});

export default app;
