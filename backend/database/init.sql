CREATE DATABASE IF NOT EXISTS sistema_marcas_prestamos
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE sistema_marcas_prestamos;


CREATE TABLE IF NOT EXISTS roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);


CREATE TABLE IF NOT EXISTS departamentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL UNIQUE,
    descripcion VARCHAR(255) NULL,
    encargado VARCHAR(150) NULL
);


CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rol_id INT NOT NULL,
    departamento_id INT NOT NULL,
    nombre_completo VARCHAR(150) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    correo VARCHAR(150) NOT NULL UNIQUE,
    nombre_usuario VARCHAR(80) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,

    CONSTRAINT fk_usuarios_roles
    FOREIGN KEY (rol_id) REFERENCES roles(id),

    CONSTRAINT fk_usuarios_departamentos
    FOREIGN KEY (departamento_id) REFERENCES departamentos(id)
);


CREATE TABLE IF NOT EXISTS sesiones (
    session_id VARCHAR(128) PRIMARY KEY,
    expires INT NOT NULL,
    data MEDIUMTEXT NULL
);


CREATE TABLE IF NOT EXISTS tokens_recuperacion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    fecha_expiracion DATETIME NOT NULL,
    usado BOOLEAN NOT NULL DEFAULT FALSE,

    CONSTRAINT fk_tokens_recuperacion_usuarios
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);


CREATE TABLE IF NOT EXISTS dispositivos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    identificador VARCHAR(100) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(255) NULL,
    fecha_registro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    usuario_id INT NOT NULL,
    estado ENUM(
        'ACTIVO',
        'INACTIVO'
    ) NOT NULL DEFAULT 'ACTIVO',

    CONSTRAINT fk_dispositivos_usuarios
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);


CREATE TABLE IF NOT EXISTS marcas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    tipo_marca ENUM(
        'ENTRADA',
        'SALIDA'
    ) NOT NULL,
    direccion_ip VARCHAR(45) NOT NULL,
    dispositivo_id INT NOT NULL,

    CONSTRAINT fk_marcas_usuarios
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),

    CONSTRAINT fk_marcas_dispositivos
    FOREIGN KEY (dispositivo_id) REFERENCES dispositivos(id)
);


CREATE TABLE IF NOT EXISTS equipos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(50) NOT NULL UNIQUE,
    descripcion VARCHAR(255) NOT NULL,
    imagen VARCHAR(255) NULL,
    estado ENUM(
        'DISPONIBLE',
        'PRESTADO',
        'MANTENIMIENTO',
        'INACTIVO'
    ) NOT NULL DEFAULT 'DISPONIBLE'
);


CREATE TABLE IF NOT EXISTS prestamos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numero_prestamo VARCHAR(50) NOT NULL UNIQUE,
    usuario_id INT NOT NULL,
    fecha DATE NOT NULL,
    encargado_id INT NOT NULL,
    estado ENUM(
        'ACTIVO',
        'FINALIZADO'
    ) NOT NULL DEFAULT 'ACTIVO',

    CONSTRAINT fk_prestamos_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),

    CONSTRAINT fk_prestamos_encargado
    FOREIGN KEY (encargado_id) REFERENCES usuarios(id)
);


CREATE TABLE IF NOT EXISTS prestamo_detalle (
    id INT AUTO_INCREMENT PRIMARY KEY,
    prestamo_id INT NOT NULL,
    equipo_id INT NOT NULL,
    descripcion VARCHAR(255) NOT NULL,
    estado_devolucion ENUM(
        'PENDIENTE',
        'DEVUELTO'
    ) NOT NULL DEFAULT 'PENDIENTE',

    CONSTRAINT fk_prestamo_detalle_prestamos
    FOREIGN KEY (prestamo_id) REFERENCES prestamos(id),

    CONSTRAINT fk_prestamo_detalle_equipos
    FOREIGN KEY (equipo_id) REFERENCES equipos(id),

    CONSTRAINT uq_prestamo_detalle_equipo
    UNIQUE (prestamo_id, equipo_id)
);


CREATE TABLE IF NOT EXISTS configuracion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_institucion VARCHAR(150) NULL,
    rango_ip_inicio VARCHAR(45) NULL,
    rango_ip_fin VARCHAR(45) NULL,
    tiempo_maximo_sesion INT NULL,
    tamano_maximo_archivo INT NULL
);


INSERT IGNORE INTO roles (
    id,
    nombre
)
VALUES
    (
        1,
        'USUARIO'
    ),
    (
        2,
        'ADMINISTRADOR'
    );


CREATE INDEX idx_usuarios_rol ON usuarios(rol_id);
CREATE INDEX idx_usuarios_departamento ON usuarios(departamento_id);
CREATE INDEX idx_tokens_recuperacion_usuario ON tokens_recuperacion(usuario_id);
CREATE INDEX idx_dispositivos_usuario ON dispositivos(usuario_id);
CREATE INDEX idx_marcas_usuario ON marcas(usuario_id);
CREATE INDEX idx_marcas_fecha ON marcas(fecha);
CREATE INDEX idx_marcas_dispositivo ON marcas(dispositivo_id);
CREATE INDEX idx_prestamos_usuario ON prestamos(usuario_id);
CREATE INDEX idx_prestamos_fecha ON prestamos(fecha);
CREATE INDEX idx_prestamos_estado ON prestamos(estado);
CREATE INDEX idx_prestamo_detalle_prestamo ON prestamo_detalle(prestamo_id);
CREATE INDEX idx_prestamo_detalle_equipo ON prestamo_detalle(equipo_id);