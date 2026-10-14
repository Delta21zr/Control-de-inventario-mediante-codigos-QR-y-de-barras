# DOCUMENTO DE AUDITORÍA: USO DE INTELIGENCIA ARTIFICIAL
**Proyecto 04: Inventario QR**
**Responsable:** Integrante 1 (Líder de Documentación)

Este documento registra los prompts técnicos utilizados por el equipo de desarrollo, las respuestas iniciales de los modelos de IA, las correcciones arquitectónicas realizadas por los ingenieros del equipo y la metodología de comprobación en un entorno físico y local.

---

## CASO 1 (Backend): Bloqueo Transaccional para Movimientos

* **Prompt:** *"Escribe un endpoint en PHP 8 usando PDO que reciba un JSON con 'codigo', 'tipo' (entrada o salida) y 'cantidad'. Debe buscar el producto, calcular el nuevo stock, actualizar la tabla productos e insertar en la tabla movimientos. Si el stock es insuficiente, debe devolver error."*

* **Qué devolvió la IA:** La IA generó un script funcional que decodificaba el JSON y ejecutaba un `SELECT` para verificar el stock, seguido de un `UPDATE` y un `INSERT`. Sin embargo, las consultas se realizaban de forma independiente y sin ningún tipo de bloqueo, lo que permitía condiciones de carrera (race conditions) si dos peticiones llegaban al mismo tiempo. Además, el formato de respuesta no cumplía con nuestro `CONTRATO_API.md`.

* **Qué cambió el equipo (Integrante 3):** 
  1. Se envolvió toda la lógica dentro de un bloque `try-catch` con `$pdo->beginTransaction();`.
  2. Se modificó la consulta inicial añadiendo bloqueo pesimista: `SELECT id, stock FROM productos WHERE codigo = ? FOR UPDATE;`. Esto fuerza a MySQL a bloquear la fila, previniendo que otra petición lea el mismo stock simultáneamente.
  3. Se agregó la validación estricta en PHP que hace un `$pdo->rollBack();` y devuelve un HTTP 400 (`{"success": false, "error": "Stock insuficiente..."}`) si la operación es una salida que supera el stock disponible.
  4. Si todo es correcto, ejecuta `$pdo->commit();` para liberar la fila.

* **Cómo comprobó que sí funcionó:** Se validó ejecutando el **Caso de Prueba P10 (Concurrencia de salidas)** y el **Caso P04 (Rechazo de sobregiro)**. El Integrante 5 lanzó dos peticiones simultáneas de salida de 4 unidades sobre un stock de 5. Se comprobó en la base de datos física que la primera petición pasó (dejando stock en 1) y la segunda fue rechazada con HTTP 400 sin generar un movimiento fantasma.

---

## CASO 2 (Frameworks/Android): Servicio de Escáner y Cancelaciones

* **Prompt:** *"¿Cómo implemento el plugin @capacitor/barcode-scanner en un proyecto de Ionic Angular para leer códigos QR al presionar un botón?"*

* **Qué devolvió la IA:** La IA propuso un código basado en la arquitectura *Standalone Components* de las versiones más recientes de Angular. Proporcionó métodos básicos para `checkPermission()` y `startScan()`, alterando clases CSS para ocultar el fondo del HTML (`body { background: transparent; }`), pero el método no manejaba adecuadamente qué sucedía si el usuario denegaba los permisos o si presionaba el botón físico de "Atrás" en Android (cancelación).

* **Qué cambió el equipo (Integrante 2):** 
  1. Se refactorizó todo el código generado de *Standalone* a la arquitectura basada en **NgModules** (`app.module.ts`), ya que es el estándar exigido para este reto en el laboratorio.
  2. Se encapsuló la lógica en un `scanner.service.ts` inyectable de manera global.
  3. Se implementó una lógica de captura de estado que restaura el color de fondo de la aplicación (`document.querySelector('body').classList.remove('scanner-active')`) si el plugin devuelve un string vacío o si se dispara una excepción por cancelación de usuario. Esto evita que la app envíe una petición a la API con un código nulo.

* **Cómo comprobó que sí funcionó:** Se validó ejecutando el **Caso de Prueba P08 (Cancelación de cámara)** y el **P01 (Escaneo QR inicial)**. El Integrante 5 inició el escáner en el dispositivo físico Android, apuntó a una mesa vacía y presionó la tecla "Atrás". La cámara se cerró limpiamente, la interfaz de Angular volvió a ser visible y la consola de Android Studio confirmó que no se disparó ninguna petición HTTP mediante Axios.

---

## CASO 3 (Frontend): Manejo Unificado de Errores Axios

* **Prompt:** *"Crea un servicio en Angular usando Axios para hacer peticiones GET y POST a una API en PHP. Necesito que capture los errores HTTP y devuelva un mensaje limpio para mostrarlo en la interfaz de Ionic."*

* **Qué devolvió la IA:** La IA entregó un servicio básico que instanciaba Axios y envolvía cada llamada en bloques `try/catch`. En el bloque `catch`, retornaba `error.message`. Esto devolvía mensajes genéricos de Axios como *"Network Error"* o *"Request failed with status code 400"*, los cuales no son útiles ni descriptivos para el usuario final del almacén, ignorando por completo los mensajes de error enviados desde el backend en formato JSON.

* **Qué cambió el equipo (Integrante 4):**
  1. Se configuró una instancia centralizada de Axios en `ApiService` estableciendo un `timeout` de 12000 ms.
  2. Se implementó un método privado `handleError(error: any)` que parsea dinámicamente el objeto de error.
  3. Se ajustó el servicio para extraer y combinar tres datos críticos exigidos por el contrato: el código HTTP (`error.response.status`), la ruta afectada (`error.config.url`) y el mensaje específico de nuestra API PHP (`error.response.data.error`). 
  4. Si no hay `error.response` (por ejemplo, si MySQL o Apache caen), el sistema intercepta el fallo de red y devuelve un diagnóstico estandarizado (Ej: *"503 - Servidor inaccesible"*).

* **Cómo comprobó que sí funcionó:** Se validó mediante el **Caso de Prueba P09 (Falla de infraestructura)** y **P06 (Código inexistente)**. El Integrante 5 detuvo el servicio Apache desde el panel de XAMPP y tocó el botón de probar conexión. La aplicación mostró correctamente en pantalla un cuadro de diálogo rojo con el texto: *"Error de Red. Servidor no disponible. [URL: /api/health.php | Status: Timeout/503]"*, demostrando que la app no colapsa y orienta al operador.

---

## ESTRUCTURA DE EVIDENCIAS Y CHECKLIST DE ENTREGA

Para asegurar que el proyecto cumple con los criterios de evaluación antes de la demostración docente, la carpeta de documentación debe contener la siguiente estructura.

### Estructura de Directorios Recomendada
```text
docs/
├── DEFINICION_Y_DIAGRAMAS.md  # Problema, matriz y diagramas Mermaid
├── MANUAL_USUARIO.md          # Guía operativa y troubleshooting
├── IA_USADA.md                # Este documento de auditoría
└── evidencias/
    ├── evt_01_arquitectura.png        # Captura de pantalla del diagrama renderizado
    ├── evt_02_bd_schema.png           # Captura de phpMyAdmin mostrando la BD y datos semilla
    ├── evt_03_app_android.mp4         # Video corto (o capturas secuenciales) del APK leyendo código físico
    ├── evt_04_error_conexion.png      # Captura de la app manejando el servidor caído (P09)
    ├── evt_05_rechazo_sobregiro.png   # Captura de la app impidiendo un stock negativo (P04)
    └── evt_06_codigo_fuente_zip/      # Zip final depurado (sin node_modules ni contraseñas)
```

### Checklist Final (Validación con Integrante 5)

- [ ] **1. Limpieza de Repositorio:** ¿Se eliminó la carpeta `node_modules` y directorios de compilación (`.angular`, `www`)?
- [ ] **2. Credenciales Seguras:** ¿El archivo `config.php` del backend contiene parámetros por defecto (`root`, contraseña vacía) compatibles con XAMPP genérico?
- [ ] **3. Reproducibilidad:** ¿El Integrante 5 pudo compilar e instalar el APK utilizando únicamente las instrucciones del `README.md` redactado por el Integrante 1?
- [ ] **4. Pruebas Críticas (P01-P11):** ¿Se ejecutó el barrido de pruebas obligatorio con códigos de barras físicos sobre el dispositivo Android conectado por red LAN al XAMPP?
- [ ] **5. Restricción de Localhost:** ¿Se verificó en la configuración de la App que el endpoint apunta a la IP de la red LAN (Ej. `192.168.X.X`) y en ningún lugar dice `localhost`?