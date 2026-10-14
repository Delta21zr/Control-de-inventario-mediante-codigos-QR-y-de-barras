# 📖 Manual de Usuario y Guía de Operación
**Proyecto 04: Inventario QR**

Bienvenido al manual oficial de operación del sistema **Inventario QR**. Esta aplicación móvil ha sido diseñada para optimizar y asegurar el registro de entradas y salidas de almacén mediante el escaneo físico de códigos, operando en tiempo real contra una base de datos central.

---

## 1. Introducción y Requisitos Mínimos

La aplicación "Inventario QR" es una herramienta móvil corporativa de uso interno. No requiere creación de cuentas ni inicio de sesión, ya que opera de manera acotada en un entorno de red local seguro.

Para garantizar un funcionamiento fluido, el dispositivo móvil debe cumplir con los siguientes **requisitos mínimos**:

* **Sistema Operativo:** Android 8.0 (Oreo) o superior (Nivel de API 26 mínimo).
* **Hardware:** Cámara trasera funcional con capacidad de autoenfoque (esencial para lectura rápida de códigos de barras finos).
* **Conectividad:** Conexión activa a la red Wi-Fi local (LAN) donde se encuentra alojado el servidor principal (XAMPP).

---

## 2. Guía de Uso Pantalla por Pantalla

### 📱 Pantalla 1: Configuración de Conexión
*Esta es la primera pantalla que debes visitar antes de iniciar cualquier operación.*

1. **Ingreso de la URL:** En el campo de texto, introduce la dirección IP de la computadora que actúa como servidor, seguida del puerto y la ruta de la API (ejemplo: `http://192.168.1.75/inventario-qr/api/`).
2. **Botón "Probar Conexión":** Toca este botón para ejecutar un diagnóstico (`health.php`). 
3. **Guardar:** Si la prueba es exitosa (muestra un indicador visual verde), guarda la configuración. La aplicación recordará esta ruta para futuras sesiones.

### 📱 Pantalla 2: Módulo de Escáner
*El corazón de la aplicación para identificar productos físicos.*

1. **Acceso:** Desde el menú principal, selecciona "Escanear Producto".
2. **Posición de la Cámara:** La pantalla mostrará el visor de la cámara. Sostén el dispositivo a unos 10-15 centímetros del código.
3. **Tipos de Código:** El escáner está configurado para reconocer instantáneamente:
   * **Códigos QR:** Ideales para etiquetas cuadradas.
   * **Códigos de Barras (Code 128):** Formato estándar de barras verticales largas.
4. **Lectura:** No es necesario presionar ningún botón para capturar; al enfocar correctamente, el sistema leerá el código automáticamente, emitirá un breve aviso (si está configurado) y te llevará a la siguiente pantalla.

### 📱 Pantalla 3: Detalle del Producto y Control de Existencias
*Aquí se toman las decisiones de inventario sobre el producto escaneado.*

1. **Información en Tiempo Real:** Al cargar, verás el **Código**, **Nombre del Producto** y, lo más importante, el **Stock Actual** consultado directamente desde la base de datos en ese mismo segundo.
2. **Selección de Movimiento:** Toca el selector para elegir la operación a realizar:
   * **Entrada:** Para añadir unidades al almacén.
   * **Salida:** Para retirar unidades del almacén.
3. **Ingreso de Cantidad:** Toca el campo numérico y digita la cantidad. **Debe ser un número entero mayor a cero** (ej. 1, 5, 20).
4. **Confirmación:** Presiona el botón "Registrar Movimiento". La pantalla mostrará un indicador de carga y, al finalizar, actualizará el "Stock Actual" reflejando el nuevo saldo.

### 📱 Pantalla 4: Historial de Movimientos (Kardex)
*Pantalla de auditoría para supervisar la actividad reciente.*

1. **Visualización:** Muestra una lista cronológica descendente (los movimientos más recientes aparecen arriba).
2. **Datos por Registro:** Cada tarjeta en el historial detalla:
   * Fecha y hora exacta de la operación.
   * Tipo de movimiento (marcado en verde para Entrada, rojo para Salida).
   * Cantidad movida.
   * Saldo Anterior y Saldo Nuevo (garantizando la trazabilidad perfecta).

---

## 3. Matriz de Solución de Problemas (Troubleshooting)

A continuación, se detallan los escenarios de error más comunes, su causa técnica y cómo el operador debe resolverlos.

| Incidencia / Escenario | Causa Técnica | Mensaje Visual en Pantalla | Acción de Recuperación (Operador) |
| :--- | :--- | :--- | :--- |
| **Código no reconocido** | El código físico escaneado (ej. `PRD999`) no existe en la tabla `productos` de MySQL (HTTP 404). | *"Producto no encontrado. Verifique el código escaneado."* | Revisa que la etiqueta no esté dañada. Si es un producto nuevo, solicita al administrador que lo registre en la base de datos. |
| **Pantalla de cámara en negro / Cancelación** | Permisos de cámara revocados en Android, o el usuario presionó el botón "Atrás" de su teléfono (Interrupción del plugin). | *"Escaneo cancelado"* o directamente retorna al menú sin mensajes. | Si cancelaste por error, vuelve a tocar "Escanear". Si la cámara no abre, ve a `Ajustes de Android > Aplicaciones > Inventario QR > Permisos` y otorga acceso a la Cámara. |
| **Fallo general de red** | El dispositivo no alcanza el servidor. Apache/MySQL están apagados, o el teléfono cambió a datos móviles (HTTP 503 / Timeout). | *"Error de Red. Servidor no disponible (503)."* o muestra la URL fallida. | 1. Verifica que tu teléfono esté conectado al Wi-Fi de la empresa.<br>2. Confirma en la *Pantalla 1* que la IP no haya cambiado.<br>3. Pide a sistemas que verifique XAMPP. |
| **Rechazo por Sobregiro** | Intento de realizar una Salida donde la `cantidad` es mayor al `stock` actual. El backend aborta la transacción (HTTP 400). | *"Stock insuficiente para realizar la salida."* | Verifica físicamente cuántas unidades tienes en la mano. El sistema no permite inventarios negativos. Ajusta la cantidad a un número menor o igual al stock disponible. |
| **Datos Inválidos en formulario** | El usuario intentó ingresar números negativos (`-5`), decimales (`1.5`) o cero (`0`). | *"Por favor, ingresa una cantidad entera mayor a 0."* | El botón de "Registrar" suele desactivarse preventivamente. Corrige el campo digitando un número entero válido (1, 2, 3...) para habilitar el envío. |