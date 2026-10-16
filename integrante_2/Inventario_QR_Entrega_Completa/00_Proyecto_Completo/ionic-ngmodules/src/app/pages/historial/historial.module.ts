import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { HistorialPage } from './historial.page';

const routes: Routes = [{ path: '', component: HistorialPage }];

@NgModule({
  imports: [CommonModule, IonicModule, RouterModule.forChild(routes)],
  declarations: [HistorialPage],
})
export class HistorialPageModule {}
