import { Component, OnInit } from '@angular/core';
import { AqiService } from '../aqi.service';
import { FormControl, FormGroup } from '@angular/forms';
import * as Highcharts from 'highcharts';

let incio_estacion: string = 'Spain';
let inicio_fechaFinal: string = '2020-12-31';
let inicio_fechaInicial: string = '2020-12-01';
let color: string = '';

@Component({
  selector: 'app-lineas-pm10',
  templateUrl: './lineas-pm10.component.html',
  styleUrls: ['./lineas-pm10.component.css']
})
export class LineasPm10Component implements OnInit {
  public options: any = {
    title: {
      text: 'Average daily values'
    },

    subtitle: {
      text: ''
    },

    yAxis: {
      title: {
        text: 'µg / m3'
      }
    },

    xAxis: {
      categories: []
    },
    tooltip: {
      formatter: function() {
        switch (this.series.name) {
          case 'SPAIN':
            return (
              '<small><= 35 µg/m3 = Good <br><= 50 µg/m3 = Acceptable <br>> 50 µg/m3 = Bad</small><br>' +
              '<table><tr><td style="color:' +
              this.series.color +
              '"><b>' +
              this.series.name +
              '</b>: </td>' +
              '<td style="text-align: right"><b>' +
              this.point.y +
              ' µg/m3 </b></td></tr>'
            );
            break;
          case 'GREECE':
            return (
              '<small><= 30 µg/m3 = Good <br><= 40 µg/m3 = Acceptable <br>> 40 µg/m3 = Bad</small><br>' +
              '<table><tr><td style="color:' +
              this.series.color +
              '"><b>' +
              this.series.name +
              '</b>: </td>' +
              '<td style="text-align: right"><b>' +
              this.point.y +
              ' µg/m3 </b></td></tr>'
            );
            break;
          case 'BULGARIA':
            return (
              '<small><= 75 µg/m3 = Good <br><=100 µg/m3 = Acceptable <br>> 100 µg/m3 = Bad </small> <br>' +
              '<table><tr><td style="color:' +
              this.series.color +
              '"><b>' +
              this.series.name +
              '</b>: </td>' +
              '<td style="text-align: right"><b>' +
              this.point.y +
              ' µg/m3 </b></td></tr>'
            );
            break;
        }
      }
    },
    legend: {
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'middle'
    },
    series: []

    // responsive: {
    //     rules: [{
    //         condition: {
    //             maxWidth: 500
    //         },
    //         chartOptions: {
    //             legend: {
    //                 layout: 'horizontal',
    //                 align: 'center',
    //                 verticalAlign: 'bottom'
    //             }
    //         }
    //     }]
    // }
  };

  createFormGroup() {
    return new FormGroup({
      estacion: new FormControl(incio_estacion),
      fechaInicial: new FormControl(inicio_fechaInicial),
      fechaFinal: new FormControl(inicio_fechaFinal)
    });
  }

  contactForm: FormGroup;
  constructor(private aqiService: AqiService) {
    this.contactForm = this.createFormGroup();
  }
  ngOnInit() {
    this.cargar(true);
  }

  onSaveForm() {
    this.cargar(false);
  }

  async cargar(inicio: Boolean) {
    let datosCarga: any;
    if (inicio) {
      datosCarga = {
        estacion: incio_estacion,
        fechaFinal: inicio_fechaFinal,
        fechaInicial: inicio_fechaInicial
      };
    } else {
      datosCarga = {
        estacion: this.contactForm.value.estacion,
        fechaFinal: this.contactForm.value.fechaFinal,
        fechaInicial: this.contactForm.value.fechaInicial
      };
    }

    /*
        Por ejemplo this.contactForm.value recibe:
  {
    estacion: "8495"
    fechaFinal: "2021-05-14"
    fechaInicial: "2021-05-10"
  }

La API devuelve un array con:
{
contaminante: "PM10"
estacion: "Spain"
fecha: "2020-12-01T00:00:00.000Z"
valor: 10.375
  }

    */
    interface dato {
      estacion: string;
      fecha: string;
      contaminante: string;
      valor: number;
    }
    interface datoPropio {
      ID: number;
      PM10: number;
      date: string;
    }

    let valor: dato;
    let fechasDistintas = new Array<string>();
    let estacionesDistintas = new Array<string>();
    let contValNew = new Array(); // Tantos elementos como series
    let indice: number;

    // Cargar  Greece
    //datosCarga.estacion='Greece'
    await this.aqiService.postAPIPropios(datosCarga).then(data => {
      // filtramos los contaminantes que vamos a usar
      let datosFiltrados = new Array();
      for (const elem of data) {
        if (elem.contaminante == 'PM10') {
          datosFiltrados.push(elem);
        }
      }
      data = datosFiltrados;
      console.log(data);
      let fechaAnt = '*******'; // inicializada para la primera vez
      // fin filtrado
      // Recorremos cada uno de los elementos del array de entrada
      for (valor of data) {
        // Generación de fechas distintas para el eje x
        // Entran en orden creciente
        if (valor.fecha.substr(0, 10) != fechaAnt) {
          fechasDistintas.push(valor.fecha.substr(0, 10));
          fechaAnt = valor.fecha.substr(0, 10);
        }

        // Generación de estaciones distintasque serán las series
        // En este caso las series serán lo países por lo que hay que hacer
        // una lectura para cada país con la api actual
        if (estacionesDistintas.indexOf(valor.estacion.toUpperCase()) == -1) {
          // No encuentra el contaminate en el array, entonces lo añade
          estacionesDistintas.push(valor.estacion.toUpperCase());
          // asignamos un color a cada País.
          if (valor.estacion.toUpperCase() == 'SPAIN') {
            color = '#2E2EFE';
          } else if (valor.estacion.toUpperCase() == 'GREECE') {
            color = '#FE642E';
          } else {
            // Para el Bulgaria
            color = '#298A08';
          }
          // Crea la serie con el primer valor
          contValNew.push({
            color: color,
            name: valor.estacion.toUpperCase(),
            data: [Math.round(valor.valor)]
          });
        } else {
          // Ha encontrado la estacion en el array
          // hay que añadirlo al array data en el índice apropiado
          // Primero localizamos el índice del elemento
          // que tiene la misma estación que el que llega.
          // Lo hacemos con la función findIndex

          indice = contValNew.findIndex(function(element) {
            return element.name == valor.estacion.toUpperCase();
          });
          // Ahora lo añadimos al array data
          contValNew[indice]['data'].push(Math.round(valor.valor));
        }
      }
    });
    /*

    // Cargar  Spain
    datosCarga.estacion='Spain'
    await this.aqiService.postAPIPropios(datosCarga).then(data => {
      // filtramos los contaminantes que vamos a usar
      let datosFiltrados = new Array();
      for (const elem of data) {
        if (
          elem.contaminante == 'PM10'
        ) {
          datosFiltrados.push(elem);
        }
      }
      data = datosFiltrados;

      // fin filtrado
      // Recorremos cada uno de los elementos del array de entrada
      for (valor of data) {
        // Las fechas distintas solo se hacen una vez, en el primer país.

        // Generación de estaciones distintas que serán las series
        // En este caso las series serán lo países por lo que hay que hacer 
        // una lectura para cada país con la api actual
        if (
          estacionesDistintas.indexOf(valor.estacion.toUpperCase()) == -1
        ) {
          // No encuentra la estaión en el array, entonces lo añade
          estacionesDistintas.push(valor.estacion.toUpperCase());
          // asignamos un color a cada País.
          if (valor.estacion.toUpperCase() == 'SPAIN') {
            color = '#2E2EFE';
          } else if (valor.estacion.toUpperCase() == 'GREECE') {
            color = '#FE642E';
          } else {
            // Para el Bulgaria
            color = '#298A08';
          }
          // Crea la serie con el primer valor
          contValNew.push({
            color: color,
            name: valor.estacion.toUpperCase(),
            data: [Math.round(valor.valor)]
          });
        } else {
          // Ha encontrado la estación en el array
          // hay que añadirlo al array data en el índice apropiado
          // Primero localizamos el índice del elemento
          // que tiene la misma estación que el que llega.
          // Lo hacemos con la función findIndex

          indice = contValNew.findIndex(function(element) {
            return element.name == valor.estacion.toUpperCase();
          });
          // Ahora lo añadimos al array data
          contValNew[indice]['data'].push(Math.round(valor.valor));
        }
      }
    });
  */
    console.log(contValNew);
    this.options.xAxis['categories'] = fechasDistintas;
    this.options.series = contValNew;
    this.options.subtitle['text'] = 'Pollutant: PM10';
    Highcharts.chart('externos', this.options);
  }
}
