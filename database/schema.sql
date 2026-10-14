CREATE DATABASE IF NOT EXISTS reto_inventario_qr CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE reto_inventario_qr;
CREATE TABLE IF NOT EXISTS productos (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  codigo VARCHAR(80) NOT NULL UNIQUE,
  nombre VARCHAR(160) NOT NULL,
  stock INT UNSIGNED NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS movimientos (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  producto_id INT UNSIGNED NOT NULL,
  tipo ENUM('entrada','salida') NOT NULL,
  cantidad INT UNSIGNED NOT NULL,
  stock_antes INT UNSIGNED NOT NULL,
  stock_despues INT UNSIGNED NOT NULL,
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (producto_id) REFERENCES productos(id),
  INDEX idx_mov_producto (producto_id)
);
INSERT INTO productos (codigo,nombre,stock) VALUES
('PRD001','Mouse inalámbrico',10),('PRD002','Teclado USB',5),('PRD003','Cable HDMI',12)
ON DUPLICATE KEY UPDATE nombre=VALUES(nombre);
