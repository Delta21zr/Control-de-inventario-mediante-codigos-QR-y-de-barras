import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'scanner', pathMatch: 'full' },
  {
    path: 'scanner',
    loadChildren: () => import('./pages/scanner/scanner.module').then((m) => m.ScannerPageModule),
  },
  {
    path: 'detalle',
    loadChildren: () => import('./pages/detalle/detalle.module').then((m) => m.DetallePageModule),
  },
  {
    path: 'historial',
    loadChildren: () => import('./pages/historial/historial.module').then((m) => m.HistorialPageModule),
  },
  {
    path: 'configuracion',
    loadChildren: () =>
      import('./pages/configuracion/configuracion.module').then((m) => m.ConfiguracionPageModule),
  },
  { path: '**', redirectTo: 'scanner' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
