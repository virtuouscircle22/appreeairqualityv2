import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BurbujasComponent } from './burbujas/burbujas.component';
import { MapaCalorComponent } from './mapa-calor/mapa-calor.component';
import { DatosMensualesComponent } from './datos-mensuales/datos-mensuales.component';
import { Lineas3contComponent } from './lineas-3cont/lineas-3cont.component';
import { LineasPm10Component } from './lineas-pm10/lineas-pm10.component';
import { InformacionComponent } from './informacion/informacion.component';

const routes: Routes = [
  { path: 'Current', component: BurbujasComponent },
  { path: 'Monthly', component: MapaCalorComponent },
  { path: 'Annual', component: DatosMensualesComponent },
  { path: 'Comparision', component: Lineas3contComponent },
  { path: 'Evolution', component: LineasPm10Component },
  { path: 'Information', component: InformacionComponent },

  { path: '', redirectTo: 'Current', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
