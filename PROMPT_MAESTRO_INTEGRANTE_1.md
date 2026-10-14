# GUÍA Y PROMPT MAESTRO PARA EL INTEGRANTE 1 (DOCUMENTACIÓN)
> **Diseñado para usar directamente en chats de Inteligencia Artificial desde el navegador (ChatGPT, Claude, Gemini, DeepSeek, etc.) de forma gratuita, sin consumir tokens de API y sin subir múltiples archivos dispersos.**

---

## CÓMO UTILIZAR ESTE MATERIAL EN TU NAVEGADOR (Paso a Paso)

1. **Abre tu IA favorita en el navegador:**
   - [ChatGPT](https://chatgpt.com)
   - [Claude](https://claude.ai)
   - [Google Gemini](https://gemini.google.com)
   - [DeepSeek](https://chat.deepseek.com)

2. **Carga el archivo de contexto:**
   - **Opción A (Recomendada):** Sube o adjunta el archivo `CONTEXTO_PROYECTO_INTEGRANTE_1.md` en el chat web (es un solo archivo limpio y ordenado).
   - **Opción B (Si no quieres subir archivos):** Abre `CONTEXTO_PROYECTO_INTEGRANTE_1.md`, copia todo su contenido y pégalo al inicio de la conversación.

3. **Envía el Prompt Maestro:**
   - Puedes usar el **Modo Todo-en-Uno** (si el modelo tiene buen límite de salida como Claude 3.5 Sonnet o GPT-4o).
   - O bien, usa los **Prompts Modulares por Fases** (Recomendado para obtener la máxima profundidad, código Mermaid impecable y formato sin que el chat corte la respuesta).

---

---

# OPCIÓN 1: PROMPT MAESTRO "TODO-EN-UNO"
*(Copia y pega este bloque en el chat web después de adjuntar o pegar `CONTEXTO_PROYECTO_INTEGRANTE_1.md`)*

```text
Actúa como un Ingeniero de Software Senior y Líder Técnico de Documentación. He adjuntado/pegado el archivo "CONTEXTO_PROYECTO_INTEGRANTE_1.md" que contiene toda la información técnica, esquema de base de datos, contrato REST y casos de prueba del proyecto "04_InventarioQR".

Mi rol en el equipo es el INTEGRANTE 1 (DOCUMENTACIÓN) y tengo la responsabilidad de redactar todo el paquete documental oficial del reto de 3 horas para entregarlo al docente y coordinar con el Integrante 5 (Pruebas).

Genera de manera completa, rigurosa y en formato Markdown profesional los siguientes 6 entregables clave, siguiendo estrictamente el stack real (Ionic Angular con NgModules, Capacitor @capacitor/barcode-scanner, Axios, PHP PDO con transacciones FOR UPDATE, MySQL en XAMPP y red LAN):

1. DOCUMENTO DESCRIPTIVO DEL SISTEMA:
   - Planteamiento del problema (control manual de inventario vs escaneo automatizado).
   - Objetivo general y 4 objetivos específicos cuantificables.
   - Usuarios objetivo y roles operativos.
   - Alcance y límites estrictos (aclarar explícitamente que NO incluye autenticación/login ni pasarelas de ventas/precios por tratarse de un reto acotado de 3 horas).
   - Reparto de responsabilidades entre los 5 integrantes del equipo.

2. MATRIZ DE REQUISITOS Y TRAZABILIDAD:
   - Tabla completa con columnas: ID Requisito | Tipo (Obligatorio/Extra) | Descripción | Responsable | Caso de Prueba Vinculado (P01-P11) | Evidencia de Validación.
   - Incluir los 6 requisitos obligatorios y los 3 extras del enunciado.

3. DIAGRAMAS TÉCNICOS EN FORMATO MERMAID:
   - Diagrama 1 (Mermaid flowchart TD): Arquitectura física y lógica en 4 capas (Android + Capacitor -> Ionic Frontend con Axios -> Red LAN -> Apache PHP -> MySQL InnoDB).
   - Diagrama 2 (Mermaid erDiagram): Modelo Entidad-Relación entre 'productos' y 'movimientos' con cardinalidades y tipos de datos exactos de schema.sql.
   - Diagrama 3 (Mermaid sequenceDiagram): Flujo de Escaneo QR y Consulta de Producto (Cámara -> Plugin -> Axios -> productos.php -> MySQL -> Renderizado).
   - Diagrama 4 (Mermaid sequenceDiagram): Flujo de Registro Atómico de Movimiento (Validación -> BEGIN TRANSACTION -> SELECT FOR UPDATE -> Verificación de stock negativo -> UPDATE + INSERT -> COMMIT -> Retorno 200).

4. README.md DE INSTALACIÓN Y DESPLIEGUE:
   - Requisitos previos del sistema con versiones recomendadas.
   - Paso a paso para importar schema.sql en MySQL/XAMPP.
   - Configuración del backend PHP (db.php, config.php, utils.php, CORS y prueba con health.php).
   - Configuración del frontend Ionic Angular (instalación de paquetes, inyección de ApiService con Axios).
   - Configuración crítica de red LAN (obtener IP con ipconfig, base URL en la app, explicar por qué NO usar localhost).
   - Preparación y despliegue en Android (minSdkVersion 26, variables.gradle, sincronización con Capacitor y ejecución en dispositivo físico).

5. MANUAL DE USUARIO Y GUÍA DE CONTINGENCIA:
   - Guía paso a paso por pantallas: 1) Configuración de URL del servidor; 2) Escáner QR / Barras; 3) Detalle del Producto y Formulario de Entradas/Salidas; 4) Historial de Movimientos.
   - Guía de Contingencia ante Errores Críticos (qué hace el sistema y qué debe hacer el operador):
     a) Producto no registrado (código inexistente como PRD999).
     b) Permiso de cámara denegado o escaneo cancelado.
     c) Servidor o base de datos inaccesible (HTTP 503 / caída de Apache o MySQL).
     d) Intento de salida que supera el stock disponible (Rechazo transaccional HTTP 400).

6. DOCUMENTO OFICIAL IA_USADA.md:
   - Siguiendo exactamente la plantilla oficial del proyecto, redacta 3 ejemplos reales y altamente técnicos de uso de IA durante el desarrollo del reto:
     * Ejemplo 1: Backend PHP - Transacción atómica con bloqueo SELECT ... FOR UPDATE y control de saldo insuficiente.
     * Ejemplo 2: Frameworks/Android - Servicio scanner.service.ts adaptado a NgModules con control de errores de cámara.
     * Ejemplo 3: Frontend - Manejo de errores Axios (explainError) con notificación amigable y reporte de status HTTP.
   - Para cada uno incluye: Prompt exacto, Qué devolvió la IA, Qué adaptó el equipo y Cómo se comprobó funcionalmente mediante los casos de prueba (P01-P11).

No uses marcadores de posición genéricos ni resúmenes superficiales. Redáctalo listo para copiar y organizar en los archivos finales del proyecto.
```

---

---

# OPCIÓN 2: PROMPTS MODULARES EN 4 FASES (MÁXIMA CALIDAD)
*(Recomendado para ir generando documento por documento sin saturar la respuesta de la IA web)*

### FASE 1: Definición del Proyecto, Matriz de Trazabilidad y Diagramas Mermaid
**Pega en el chat:**
```text
Actúa como Líder de Documentación Técnica para el proyecto "04_InventarioQR". Con base en el archivo "CONTEXTO_PROYECTO_INTEGRANTE_1.md":

Genera la FASE 1 de la documentación (Actividades 2, 3 y 4 del Integrante 1):
1. Documento de Definición del Proyecto:
   - Problema, Justificación, Objetivo General, 4 Objetivos Específicos.
   - Usuarios, Alcance acotado (resaltar que no hay login ni ventas).
   - Tabla de asignación de roles entre los 5 integrantes.
2. Matriz de Requisitos y Trazabilidad (Tabla Markdown con ID, Tipo, Descripción, Responsable, Caso de Prueba P01-P11 y Evidencia).
3. 4 Diagramas en código Mermaid listos para renderizar:
   - Arquitectura en capas (Android/Capacitor -> Frontend Axios -> LAN -> PHP -> MySQL).
   - Diagrama ER de base de datos (productos ||--o{ movimientos).
   - Secuencia de Escaneo y Consulta de Producto.
   - Secuencia de Registro Atómico con bloqueo SELECT ... FOR UPDATE.

Entrega todo en formato Markdown limpio y profesional.
```

---

### FASE 2: README.md Técnico de Instalación y Despliegue
**Pega en el chat:**
```text
Actúa como Ingeniero DevOps y Documentador Técnico. Con base en el contexto de "04_InventarioQR":

Genera el archivo "README.md" completo y exhaustivo (Actividad 5 del Integrante 1) para que el Integrante 5 o cualquier evaluador pueda clonar, instalar, configurar y ejecutar el sistema completo desde cero.

El README debe incluir:
1. Encabezado del proyecto, descripción general y arquitectura tecnológica.
2. Requisitos previos de software con versiones específicas (Node.js, npm, Ionic CLI, JDK 17, Android Studio, XAMPP).
3. Guía paso a paso para la Base de Datos (importación de schema.sql, verificación de tablas y datos semilla).
4. Despliegue del Backend PHP en XAMPP (copia en htdocs, configuración de config.php desde config.example.php, verificación con health.php).
5. Configuración y compilación del Frontend Ionic (npm install, ajuste de dependencias @capacitor/barcode-scanner y axios).
6. Configuración de Red LAN (cómo hallar la IP local con ipconfig, cómo configurar la URL en la app y por qué NO usar localhost en Android).
7. Compilación y despliegue del APK en Android físico (configuración de minSdkVersion 26 en variables.gradle, sincronización con npx cap sync android y ejecución).
8. Tabla de verificación rápida de endpoints con comandos curl o ejemplos de respuesta esperada.
```

---

### FASE 3: Manual de Usuario y Guía de Manejo de Errores
**Pega en el chat:**
```text
Actúa como Diseñador de Experiencia y Documentador de Software. Con base en el contexto de "04_InventarioQR":

Genera el "Manual de Usuario y Guía de Operación" (Actividad 6 del Integrante 1):
1. Introducción al sistema y requisitos mínimos del dispositivo móvil (Android 8.0+ / API 26, cámara operativa, conexión WiFi al servidor local).
2. Guía de uso pantalla por pantalla con instrucciones claras y formato estructurado:
   - Pantalla 1: Configuración de Conexión (Guardar IP/puerto del backend y botón de comprobación health.php).
   - Pantalla 2: Módulo de Escáner (Cómo posicionar la cámara, lectura de códigos QR y códigos de barra Code 128).
   - Pantalla 3: Detalle del Producto y Control de Existencias (Lectura de stock, selección de Entrada o Salida, ingreso de cantidad entera y confirmación).
   - Pantalla 4: Historial de Movimientos (Visualización de kardex con fecha, tipo, cantidad y saldos antes/después).
3. Matriz de Solución de Problemas (Troubleshooting y Contingencias):
   - Detallar causa técnica, mensaje visual en pantalla y acción de recuperación para:
     * Código escaneado no encontrado en el catálogo (ej. PRD999).
     * Permiso de cámara revocado o escaneo cancelado por el usuario.
     * Servidor o base de datos fuera de línea (Error 503 / Timeout).
     * Salida con cantidad superior a las existencias reales (Rechazo HTTP 400).
     * Entrada de datos inválidos (cantidades negativas, ceros o decimales).
```

---

### FASE 4: IA_USADA.md y Organización de Evidencias
**Pega en el chat:**
```text
Actúa como Auditor Técnico de Software. Con base en el contexto de "04_InventarioQR":

Genera el archivo oficial "IA_USADA.md" (Actividad 7 del Integrante 1), respetando exactamente la plantilla institucional pero completando 3 casos de uso reales, profundos y verificables:

Estructura obligatoria para cada uno de los 3 casos:
- **Prompt:** El prompt técnico real que el equipo le formuló a la IA.
- **Qué devolvió la IA:** Resumen de la solución técnica inicial proporcionada por la IA.
- **Qué cambió el equipo:** Explicación de los ajustes, correcciones de arquitectura o adaptaciones al contrato de API realizadas por los integrantes (ej. cambio a NgModules, adición de SELECT FOR UPDATE, tipado de errores Axios).
- **Cómo comprobó que sí funcionó:** El caso de prueba específico (P01-P11) ejecutado en red local y Android físico que validó el resultado.

Casos a documentar:
1. Caso 1 (Backend): Implementación del endpoint movimientos.php con transacción PDO, bloqueo FOR UPDATE y prevención de saldo negativo.
2. Caso 2 (Frameworks/Android): Implementación de scanner.service.ts con @capacitor/barcode-scanner para Ionic Angular NgModules y control de cancelación.
3. Caso 3 (Frontend): Manejo unificado de errores HTTP de Axios en ApiService para mostrar diagnósticos legibles (código HTTP + URL + detalle del error).

Adicionalmente, añade la estructura recomendada para la carpeta `docs/evidencias/` con el checklist de entrega para validar con el Integrante 5 antes de la demostración docente.
```

---

## CONSEJOS CLAVE PARA EL INTEGRANTE 1 EN EL RETO DE 3 HORAS
1. **Mantén sincronizada la documentación con el código real:** Apenas el Integrante 2 defina las versiones exactas de Ionic y Angular, y el Integrante 3 confirme la ruta en XAMPP, actualízalas en tu README.
2. **Usa los diagramas Mermaid:** La mayoría de plataformas como GitHub, GitLab o visualizadores Markdown (VS Code, Obsidian) renderizan los bloques `mermaid` automáticamente en gráficos vectoriales sin necesidad de dibujar imágenes a mano.
3. **Pide al Integrante 5 las capturas a tiempo:** En el minuto 140-160 del reto, el Integrante 5 tendrá las pruebas P01 a P11 listas. Vincula cada requisito de tu matriz con el nombre de archivo de la captura correspondiente (ej. `docs/evidencias/P01_escanear_prd001.png`).
