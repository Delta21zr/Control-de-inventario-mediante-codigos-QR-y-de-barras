# CONTEXTO TÉCNICO UNIFICADO: PROYECTO 04 - INVENTARIO QR
> **Documento maestro para alimentar chats de IA (ChatGPT, Claude, Gemini, DeepSeek, etc.) en navegador sin saturar contexto ni requerir múltiples archivos.**
> **Destinado a:** Integrante 1 (Responsable de Documentación y Entregables del Reto).

---

## 1. IDENTIFICACIÓN Y ALCANCE DEL PROYECTO
- **Nombre del Reto:** Reto 04 · Inventario QR (Control de existencias con QR y códigos de barras).
- **Tipo de Aplicación:** Móvil híbrida con sincronización a backend local.
- **Duración del reto en laboratorio:** 3 horas (180 minutos).
- **Equipo:** 5 integrantes con roles asignados.
- **Propósito:** Permitir a un operador escanear códigos QR y barras físicos desde un dispositivo móvil Android, consultar en tiempo real las existencias en MySQL mediante una API PHP en red local, registrar transacciones atómicas de entrada y salida, y consultar el historial reciente de movimientos.
- **Fronteras y Límites Estrictos (QUÉ NO TIENE):**
  - **NO** incluye sistema de autenticación, usuarios ni login (fuera del alcance del reto de 3 horas).
  - **NO** incluye pasarela de pagos, compras, ventas ni precios (solo gestión de unidades físicas).
  - **NO** usa listas estáticas en memoria (mock data): la persistencia debe ser 100% MySQL en red local.
  - Extras solo si sobra tiempo: alta de productos, filtro de historial por producto, sonidos, resumen del día.

---

## 2. STACK TECNOLÓGICO Y VERSIONES
- **Frontend Móvil:** Ionic Framework con **Angular usando NgModules** (no standalone puro, adaptado como en la aplicación previa del laboratorio), TypeScript.
- **Librería HTTP:** **Axios** (mediante `ApiService` centralizado con timeout de 12s y configuración dinámica de Base URL).
- **Plugin de Escáner:** `@capacitor/barcode-scanner` (requiere `minSdkVersion 26` en `android/variables.gradle` y permisos de cámara en `AndroidManifest.xml`).
- **Backend:** **PHP 8.x** (arquitectura modular con PDO, sentencias preparadas, manejo de excepciones y cabeceras CORS).
- **Base de Datos:** **MySQL / MariaDB en XAMPP** (motor InnoDB con soporte transaccional y bloqueo pesimista).
- **Infraestructura de Red:** Red de Área Local (LAN / WiFi compartido). La app móvil se conecta a `http://IP_LAPTOP:PUERTO/RUTA/api/` (el dispositivo Android **NUNCA** usa `localhost`).

---

## 3. ESQUEMA DE BASE DE DATOS (schema.sql)
La base de datos se denomina `reto_inventario_qr` bajo UTF-8 multibyte (`utf8mb4_unicode_ci`):

```sql
CREATE DATABASE IF NOT EXISTS reto_inventario_qr CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE reto_inventario_qr;

-- Tabla de productos
CREATE TABLE IF NOT EXISTS productos (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  codigo VARCHAR(80) NOT NULL UNIQUE,
  nombre VARCHAR(160) NOT NULL,
  stock INT UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB;

-- Tabla de movimientos (kardex)
CREATE TABLE IF NOT EXISTS movimientos (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  producto_id INT UNSIGNED NOT NULL,
  tipo ENUM('entrada','salida') NOT NULL,
  cantidad INT UNSIGNED NOT NULL,
  stock_antes INT UNSIGNED NOT NULL,
  stock_despues INT UNSIGNED NOT NULL,
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE RESTRICT,
  INDEX idx_mov_producto (producto_id)
) ENGINE=InnoDB;

-- Datos semilla iniciales para pruebas
INSERT INTO productos (codigo, nombre, stock) VALUES
('PRD001', 'Mouse inalámbrico', 10),
('PRD002', 'Teclado USB', 5),
('PRD003', 'Cable HDMI', 12)
ON DUPLICATE KEY UPDATE nombre=VALUES(nombre);
```

---

## 4. CONTRATO DE API REST (CONTRATO_API.md)
Todas las respuestas son en formato JSON estándar con codificación UTF-8 y cabeceras CORS habilitadas.
- **Estructura de Éxito:** `{"success": true, "data": ...}`
- **Estructura de Error:** `{"success": false, "error": "Mensaje legible para el usuario"}` con código HTTP 4xx o 5xx.

### Endpoints Oficiales:
1. `GET api/health.php`
   - **Propósito:** Diagnóstico del servidor y de la base de datos.
   - **Respuesta 200 OK:** `{"success": true, "data": {"php": "8.2.x", "mysql": "ok"}}`
   - **Respuesta 503 Service Unavailable:** `{"success": false, "error": "No se pudo conectar a la base de datos."}` si MySQL está apagado.

2. `GET api/productos.php?codigo={codigo}`
   - **Con parámetro `codigo`:** Retorna el producto coincidente `{"success": true, "data": {"id": 1, "codigo": "PRD001", "nombre": "Mouse inalámbrico", "stock": 10}}`. Si no existe: HTTP 404 `{"success": false, "error": "Producto no encontrado"}`.
   - **Sin parámetro:** Retorna la lista completa de productos registrados.

3. `POST api/movimientos.php`
   - **Payload JSON:** `{"codigo": "PRD001", "tipo": "entrada"|"salida", "cantidad": 2}`
   - **Reglas de Negocio en Servidor:**
     - Valida tipos de datos: `cantidad` debe ser entero estrictamente mayor que 0.
     - Valida `tipo`: debe ser exactamente `'entrada'` o `'salida'`.
     - Inicia transacción SQL con aislamiento (`BEGIN TRANSACTION`).
     - Realiza lectura bloqueante: `SELECT id, stock FROM productos WHERE codigo = ? FOR UPDATE;`
     - Si es `'salida'` y `cantidad > stock`, aborta la transacción (`ROLLBACK`), responde HTTP 400 `{"success": false, "error": "Stock insuficiente para realizar la salida"}`.
     - Si es válido, calcula nuevo stock, ejecuta `UPDATE productos SET stock = ? WHERE id = ?`, inserta registro en `movimientos` (`stock_antes`, `stock_despues`) y confirma (`COMMIT`).
   - **Respuesta 200 OK:** `{"success": true, "data": {"id": 1, "codigo": "PRD001", "stock_anterior": 10, "stock_actual": 12, "movimiento_id": 5}}`

4. `GET api/movimientos.php`
   - **Propósito:** Listar los últimos movimientos con orden descendente por fecha (`creado_en DESC`).
   - **Respuesta 200 OK:** `{"success": true, "data": [{"id": 1, "producto": "Mouse inalámbrico", "tipo": "entrada", "cantidad": 2, "stock_antes": 10, "stock_despues": 12, "creado_en": "2026-10-14 10:15:00"}]}`

---

## 5. REPARTO DEL EQUIPO (5 INTEGRANTES)
- **Integrante 1 (Documentación):** Manuales, diagramas de arquitectura/ER/flujo, README de instalación, matriz de requisitos y pruebas, control de IA (`IA_USADA.md`), compilación de evidencias.
- **Integrante 2 (Frameworks y Android):** Inicialización de proyecto Ionic Angular con NgModules, configuración de `@capacitor/barcode-scanner`, `scanner.service.ts`, `models`, permisos Android, generación del APK.
- **Integrante 3 (Backend y Base de Datos):** Importación de `schema.sql`, configuración PDO (`db.php`, `config.php`), endpoints `health.php`, `productos.php`, `movimientos.php` con transacciones seguras `SELECT ... FOR UPDATE`.
- **Integrante 4 (Frontend e Interfaz):** Pantallas (Escáner, Detalle Producto, Historial, Configuración), consumo con `ApiService` (Axios), manejo de estados de carga, éxito y error legible (HTTP + URL + error).
- **Integrante 5 (Pruebas e Integración):** Verificación de red LAN, impresión de códigos físicos (QR y Code 128), ejecución de la batería de pruebas P01 a P11, pruebas de estrés y rollback, captura de evidencias en Android.

---

## 6. MATRIZ DE CASOS DE PRUEBA OFICIALES (P01 - P11)
| ID | Caso de Prueba | Precondición / Acción | Resultado Esperado | Responsable |
|---|---|---|---|---|
| **P01** | Escaneo QR inicial | Escanear código QR de `PRD001` (stock inicial 10) | La app muestra "Mouse inalámbrico" y stock 10 desde MySQL | Int 2, 4, 5 |
| **P02** | Entrada de stock | Registrar entrada de 2 unidades para `PRD001` | Stock pasa a 12 en BD y se inserta movimiento de entrada | Int 3, 4, 5 |
| **P03** | Salida de stock | Registrar salida de 1 unidad para `PRD001` | Stock pasa a 11 en BD y se inserta movimiento de salida | Int 3, 4, 5 |
| **P04** | Rechazo de sobregiro | Intentar salida de 12 unidades (stock disponible: 11) | PHP rechaza con HTTP 400; stock se mantiene en 11, sin movimiento | Int 3, 4, 5 |
| **P05** | Escaneo código de barras | Escanear código de barras físico Code 128 con `PRD001` | La app reconoce el código idéntico al QR y consulta el producto | Int 2, 5 |
| **P06** | Código inexistente | Escanear o ingresar código `PRD999` no registrado | Backend responde 404, app muestra mensaje claro sin tocar stock | Int 3, 4 |
| **P07** | Validación de cantidad | Enviar cantidad `0`, `-5` o `1.5` en formulario | Validación en frontend y backend rechaza operación sin alterar BD | Int 3, 4 |
| **P08** | Cancelación de cámara | Cancelar escáner o denegar permiso de cámara | La app vuelve a la pantalla anterior sin error ni peticiones a la API | Int 2, 4 |
| **P09** | Falla de infraestructura | Detener Apache o MySQL en XAMPP | `health.php` devuelve 503; app muestra error con URL, status y método | Int 3, 4, 5 |
| **P10** | Concurrencia de salidas | Dos salidas simultáneas de 4 unid. teniendo stock 5 | Bloqueo `FOR UPDATE`: 1ª acepta (stock 1), 2ª rechaza (insuficiente) | Int 3, 5 |
| **P11** | Persistencia real | Cerrar completamente la app y reabrirla | Los datos de stock e historial persisten intactos desde MySQL | Int 4, 5 |

---

## 7. MATRIZ DE ACTIVIDADES DEL INTEGRANTE 1 (DOCUMENTACIÓN)
El Integrante 1 debe elaborar y cerrar los siguientes 8 puntos y entregables:
1. **Revisión de requisitos:** Clasificar en obligatorios, extras y evidencias de entrega.
2. **Definición del proyecto:** Problema, objetivo general, objetivos específicos, usuarios y alcance acotado (sin login ni ventas).
3. **Matriz de trazabilidad:** Relación Requisito (REQ-01 a REQ-06) ↔ Responsable ↔ Caso de Prueba (P01-P11) ↔ Evidencia.
4. **Diagramas técnicos en formato Mermaid:**
   - Diagrama de Arquitectura de 4 capas: App Ionic/Angular -> `@capacitor/barcode-scanner` -> `ApiService` (Axios) -> PHP (Apache XAMPP) -> MySQL (InnoDB).
   - Diagrama Entidad-Relación (ER) de las tablas `productos` y `movimientos`.
   - Diagrama de Secuencia del flujo de Escaneo y Consulta de Producto.
   - Diagrama de Secuencia del flujo de Registro de Movimiento con bloqueo transaccional.
5. **README.md de Instalación y Despliegue:** Guía detallada paso a paso para clonar, configurar XAMPP, importar SQL, configurar IP LAN en la app, compilar y ejecutar en Android.
6. **Manual de Usuario y Guía de Errores:** Explicación pantalla por pantalla (Configuración, Escáner, Detalle, Historial) y guía de resolución de fallas (cámara denegada, servidor inaccesible, stock insuficiente).
7. **Documento de Uso de Inteligencia Artificial (IA_USADA.md):** 3 prompts reales documentando: prompt ingresado, respuesta de la IA, ajustes hechos por el equipo y método de comprobación funcional.
8. **Cierre de Documentación y Checklist:** Estructuración de carpetas `docs/evidencias/` y validación de aceptación (reproducibilidad por el Integrante 5).
