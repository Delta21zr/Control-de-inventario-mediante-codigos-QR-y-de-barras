# Cascarón Ionic Angular con NgModules

Base mínima con Ionic 8, Angular 20, TypeScript y Capacitor 7. Todos los componentes propios usan `standalone: false`.

## Requisitos y ejecución en Visual Studio Code

Instala Node.js 22 (22.12 o superior) o Node.js 24. Abre la carpeta del proyecto en VS Code y ejecuta en su terminal:

```powershell
npm install
npm start
```

Abre la dirección que indique Angular (normalmente http://localhost:4200). No se necesita un archivo .bat ni Ionic CLI global. Para detener el servidor usa Ctrl+C.

Si ya usas Ionic CLI, también puedes ejecutar `ionic serve`.

## Estructura

- `src/main.ts`: arranca `AppModule` mediante `bootstrapModule`.
- `src/app/app.module.ts`: declara el componente raíz, importa Ionic y configura HttpClient.
- `src/app/app-routing.module.ts`: redirige a Inicio y carga su NgModule de forma diferida.
- `src/app/pages/inicio/`: página de ejemplo, módulo y rutas propios.
- `src/app/core/services/`: espacio para servicios de datos.
- `src/app/core/models/`: espacio para interfaces TypeScript.
- `src/app/shared/components/`: espacio para componentes reutilizables.
- `src/theme/variables.scss`: colores globales.
- `capacitor.config.ts`: configuración inicial para plataformas nativas.

La pantalla inicial permite escribir un nombre y pulsar un botón para verificar FormsModule y los eventos. No incluye backend, autenticación, almacenamiento ni escáner.

## Mantener NgModules

`angular.json` establece `standalone: false` en los generadores de componentes, directivas y pipes. Genera componentes con Angular CLI y decláralos en el módulo correspondiente:

```powershell
npx ng generate component shared/components/ejemplo --standalone=false --module=app
```

Para cada página nueva crea su componente con `standalone: false`, su `*.module.ts` y su módulo de rutas. En el módulo de página importa `CommonModule`, `FormsModule` e `IonicModule`; agrega la ruta con `loadChildren` en `AppRoutingModule`.

## Compilar

```powershell
npm run build
```

La salida web se genera en `www/`. Se incluye `package-lock.json` con las versiones usadas en la compilación verificada. Puedes usar `npm ci` en lugar de `npm install` para reproducir esa instalación.

## Preparar Android (opcional)

Instala Android Studio y configura su SDK/JDK. Cambia `appId` y `appName` en `capacitor.config.ts` antes de agregar Android:

```powershell
npm run build
npx cap add android
npx cap sync android
npx cap open android
```

Después de modificar el frontend, repite `npm run build` y `npx cap sync android`. El proyecto Android se genera localmente; no viene incluido en este cascarón.

## Validación realizada

Se instalaron las dependencias y `npm run build` finalizó correctamente. Se verificaron el arranque con AppModule, la carga diferida de Inicio y `standalone: false` en todos los componentes propios.
