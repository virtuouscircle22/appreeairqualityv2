import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { HighchartsChartModule } from 'highcharts-angular';
import { AppRoutingModule } from './app-routing.module';

import { MaterialModule } from './material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AppComponent } from './app.component';
import { AqiService } from './aqi.service';
import { BurbujasComponent } from './burbujas/burbujas.component';
import { MapaCalorComponent } from './mapa-calor/mapa-calor.component';
import { DatosMensualesComponent } from './datos-mensuales/datos-mensuales.component';
import { Lineas3contComponent } from './lineas-3cont/lineas-3cont.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LineasPm10Component } from './lineas-pm10/lineas-pm10.component';
import { InformacionComponent } from './informacion/informacion.component';
import {APP_BASE_HREF} from '@angular/common';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    MaterialModule,
    HighchartsChartModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    FlexLayoutModule
  ],
  declarations: [
    AppComponent,
    BurbujasComponent,
    MapaCalorComponent,
    DatosMensualesComponent,
    Lineas3contComponent,
    LineasPm10Component,
    InformacionComponent
  ],
  bootstrap: [AppComponent],
  providers: [AqiService, {provide:
    APP_BASE_HREF, useValue: '/'}]
})
export class AppModule {}
