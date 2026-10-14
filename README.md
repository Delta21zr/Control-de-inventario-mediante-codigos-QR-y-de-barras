# 📱 Proyecto 04: Inventario QR

Sistema de control de existencias físicas mediante el escaneo de códigos QR y de barras utilizando un dispositivo móvil Android, con sincronización en tiempo real a un backend PHP/MySQL en red local (LAN).

---

## 1. Arquitectura Tecnológica
El proyecto sigue una arquitectura cliente-servidor en red local:
* **Frontend (App Móvil):** Ionic Framework con Angular (NgModules), TypeScript y HTML/SCSS.
* **Hardware Bridge:** `@capacitor/barcode-scanner` para acceso nativo a la cámara.
* **Cliente HTTP:** `axios` para peticiones RESTful.
* **Backend (API):** PHP 8.x nativo con arquitectura modular (PDO).
* **Base de Datos:** MySQL (Motor InnoDB con bloqueo transaccional `FOR UPDATE`).
* **Infraestructura:** XAMPP (Apache + MySQL) en entorno LAN (Wi-Fi local).

---

## 2. Requisitos Previos (Entorno de Desarrollo)
Para garantizar la compatibilidad y evitar errores de compilación, asegúrate de tener instaladas las siguientes versiones (o superiores):

* **Node.js:** v18.x o v20.x LTS
* **npm:** v9.x o superior
* **Ionic CLI:** `npm install -g @ionic/cli`
* **Java Development Kit (JDK):** JDK 17 (Requerido por las versiones recientes de Gradle/Android).
* **Android Studio:** Versión "Iguana" o superior (con Android SDK Platform 33 o 34 instalada).
* **XAMPP:** Con PHP 8.2.x y MySQL/MariaDB.

---

## 3. Configuración de la Base de Datos (MySQL)
1. Abre **XAMPP Control Panel** e inicia los módulos **Apache** y **MySQL**.
2. Ingresa a phpMyAdmin desde el navegador: `http://localhost/phpmyadmin/`.
3. Crea una nueva base de datos llamada `reto_inventario_qr` con el cotejamiento `utf8mb4_unicode_ci`.
4. Ve a la pestaña **Importar** y selecciona el archivo `database/schema.sql` provisto en el repositorio.
5. **Verificación:** Confirma que se crearon dos tablas (`productos` y `movimientos`).
6. **Datos Semilla:** Revisa la tabla `productos` y confirma que existen 3 registros iniciales (PRD001, PRD002, PRD003).

---

## 4. Despliegue del Backend (PHP API)
1. Copia la carpeta `backend/api` al directorio público de XAMPP: `C:\xampp\htdocs\inventario-qr\api`.
2. Dentro de la carpeta `api`, duplica el archivo `config.example.php` y renómbralo a `config.php`.
3. Edita `config.php` con tus credenciales locales:
   ```php
   <?php
   define('DB_HOST', 'localhost');
   define('DB_NAME', 'reto_inventario_qr');
   define('DB_USER', 'root'); // Tu usuario local
   define('DB_PASS', '');     // Tu contraseña (vacío por defecto en XAMPP)
   ```
4. **Verificación de Salud:** Abre tu navegador de escritorio y visita `http://localhost/inventario-qr/api/health.php`. 
   * **Esperado:** `{"success": true, "data": {"php": "8.x.x", "mysql": "ok"}}`

---

## 5. Configuración de Red LAN (¡CRÍTICO PARA ANDROID!)
> ⚠️ **REGLA DE ORO:** **NUNCA** uses `http://localhost` o `http://127.0.0.1` en la aplicación móvil. Para un teléfono Android, `localhost` significa "el propio teléfono", no tu computadora.

1. Conecta tu computadora y el dispositivo Android a la **misma red Wi-Fi**.
2. Encuentra la IP local de tu computadora:
   * **Windows:** Abre CMD y ejecuta `ipconfig`. Busca la "Dirección IPv4" (ej. `192.168.1.75`).
   * **Mac/Linux:** Abre la terminal y ejecuta `ifconfig` o `ip a`.
3. En la aplicación móvil (Pantalla de Configuración), deberás ingresar esta URL base:
   👉 `http://192.168.1.75/inventario-qr/api/`

---

## 6. Configuración y Compilación del Frontend (Ionic)
1. Abre una terminal y navega a la carpeta del frontend: `cd frontend`
2. Instala las dependencias del proyecto:
   ```bash
   npm install
   ```
3. Verifica que las dependencias clave estén presentes en tu `package.json`:
   ```bash
   npm install @capacitor/barcode-scanner axios
   ```
4. (Opcional para pruebas web) Inicia el servidor de desarrollo en el navegador para validar la UI: `ionic serve`. *Nota: El escáner nativo no funcionará en la web.*

---

## 7. Despliegue en Dispositivo Físico Android (APK)
El plugin de escáner requiere configuraciones específicas en Android. Sigue estos pasos al pie de la letra:

1. Genera la compilación de producción del frontend:
   ```bash
   ionic build --prod
   ```
2. Agrega la plataforma Android y sincroniza los archivos web y plugins nativos:
   ```bash
   npx cap add android
   npx cap sync android
   ```
3. **Ajuste de SDK (Obligatorio):** Abre el archivo `android/variables.gradle` y asegúrate de que el `minSdkVersion` sea **26** o superior (requerimiento de `@capacitor/barcode-scanner`):
   ```gradle
   ext {
       minSdkVersion = 26
       // ...
   }
   ```
4. Abre el proyecto en Android Studio:
   ```bash
   npx cap open android
   ```
5. En Android Studio, espera a que Gradle sincronice (barra de progreso en la parte inferior).
6. Conecta tu teléfono Android por USB (asegúrate de tener activada la "Depuración USB" en las opciones de desarrollador de tu teléfono).
7. Selecciona tu dispositivo en la barra superior y presiona el botón **Run (Play ▶️)** para compilar e instalar el APK en tu dispositivo.

---

## 8. Verificación Rápida de Endpoints (Pruebas API)

Usa estos comandos `curl` desde tu terminal para asegurar que el backend expone los datos correctamente antes de probar la app. *(Reemplaza `192.168.1.75` con tu IP LAN).*

| Endpoint | Comando cURL de Prueba | Respuesta Esperada (HTTP 200) |
| :--- | :--- | :--- |
| **Health Check** | `curl -X GET http://192.168.1.75/inventario-qr/api/health.php` | `{"success":true,"data":{"php":"8.2","mysql":"ok"}}` |
| **Listar Productos** | `curl -X GET http://192.168.1.75/inventario-qr/api/productos.php` | `{"success":true,"data":[{"id":1,"codigo":"PRD001"...}]}` |
| **Buscar Producto** | `curl -X GET http://192.168.1.75/inventario-qr/api/productos.php?codigo=PRD001` | `{"success":true,"data":{"id":1,"codigo":"PRD001","stock":10}}` |
| **Registrar Entrada** | `curl -X POST -H "Content-Type: application/json" -d "{\"codigo\":\"PRD001\",\"tipo\":\"entrada\",\"cantidad\":2}" http://192.168.1.75/inventario-qr/api/movimientos.php` | `{"success":true,"data":{"stock_actual":12}}` |
| **Listar Historial** | `curl -X GET http://192.168.1.75/inventario-qr/api/movimientos.php` | `{"success":true,"data":[{"producto":"Mouse...","tipo":"entrada"...}]}` |

> **Nota de Pruebas:** Para simular un error (P04: Sobregiro de stock), envía un POST con `"tipo":"salida"` y una `"cantidad"` mayor al stock actual. El servidor debe responder con HTTP 400.