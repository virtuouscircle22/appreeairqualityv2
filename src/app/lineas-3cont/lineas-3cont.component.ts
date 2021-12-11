import { Component, OnInit } from '@angular/core';
import { AqiService } from '../aqi.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import * as Highcharts from 'highcharts';

declare var require: any;

//Datos iniciales:
let incio_estacion: string = '8495';
let inicio_fechaFinal: string = '2020-12-31';
let inicio_fechaInicial: string = '2020-12-01';
let color: string = '';

@Component({
  selector: 'app-lineas-3cont',
  templateUrl: './lineas-3cont.component.html',
  styleUrls: ['./lineas-3cont.component.css']
})
export class Lineas3contComponent implements OnInit {
  public options: any = {
    title: {
      text: 'Average daily values for each pollutant'
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
          case 'PM10':
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
          case 'NO2':
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
          case 'O3':
            return (
              '<small><= 75 µg/m3 = Good <br><=100 µg/m3 = Acceptable <br>> 100 µg/m3 = bad </small> <br>' +
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
  constructor(private _externos: AqiService) {
    this.contactForm = this.createFormGroup();
  }
  ngOnInit() {
    this.cargar(true);
  }

  onSaveForm() {
    this.cargar(false);
  }

  cargar(inicio: Boolean) {
    let datosCarga: any;
    if (inicio) {
      datosCarga = {
        estacion: incio_estacion,
        fechaFinal: inicio_fechaFinal,
        fechaInicial: inicio_fechaInicial
      };
    } else {
      datosCarga = this.contactForm.value;
    }

    /*
this.contactForm.value recibe, por ejemplo:
  {
    estacion: "8495"
    fechaFinal: "2021-05-14"
    fechaInicial: "2021-05-10"
  }

La API devuelve un array con:
    {
        "estacion": 8084,
        "fecha": "2021-02-01T00:00:00.000Z",
        "contaminante": "p",
        "valor": 1001.125
    },

    */
    interface dato {
      estacion: number;
      fecha: string;
      contaminante: string;
      valor: number;
    }

    let valor: dato;

    this._externos.postAPI(datosCarga).then(data => {
      /*
        Con la estructura:
        {
            color: string,
            name: string,
            data: [number]  // un valor para cada fecha
        }
      */
      // filtramos los contaminantes que vamos a usar
      let datosFiltrados = new Array();
      for (const elem of data) {
        if (
          elem.contaminante == 'pm10' ||
          elem.contaminante == 'o3' ||
          elem.contaminante == 'no2'
        ) {
          datosFiltrados.push(elem);
        }
      }

      data = datosFiltrados;

      let fechaAnt = '*******'; // inicializada para la primera vez
      let fechasDistintas = new Array<string>();
      let contaminantesDistintos = new Array<string>();
      let contValNew = new Array(); // Tantos elementos como series
      let indice: number;
      // fin filtrado
      // Recorremos cada uno de los elementos del array de entrada
      for (valor of data) {
        // Generación de fechas distintas para el eje x
        // Entran en orden creciente
        if (valor.fecha.substr(0, 10) != fechaAnt) {
          fechasDistintas.push(valor.fecha.substr(0, 10));
          fechaAnt = valor.fecha.substr(0, 10);
        }

        // Generación de contaminantes distintos que serán las series
        if (
          contaminantesDistintos.indexOf(valor.contaminante.toUpperCase()) == -1
        ) {
          // No encuentra el contaminate en el array, entonces lo añade
          contaminantesDistintos.push(valor.contaminante.toUpperCase());
          // asignamos un color a cada contaminante para que no sea aleatorio
          if (valor.contaminante.toUpperCase() == 'PM10') {
            color = '#2E2EFE';
          } else if (valor.contaminante.toUpperCase() == 'O3') {
            color = '#FE642E';
          } else {
            // Para el NO2
            color = '#298A08';
          }
          // Crea la serie con el primer valor
          contValNew.push({
            color: color,
            name: valor.contaminante.toUpperCase(),
            data: [Math.round(valor.valor)]
          });
        } else {
          // Ha encontrado el contaminante en el array
          // hay que añadirlo al array data en el índice apropiado
          // Primero localizamos el índice del elemento
          // que tiene el mismo contaminante que el que llega.
          // Lo hacemos con la función findIndex

          indice = contValNew.findIndex(function(element) {
            return element.name == valor.contaminante.toUpperCase();
          });
          // Ahora lo añadimos al array data
          contValNew[indice]['data'].push(Math.round(valor.valor));
        }
      }
      this.options.xAxis['categories'] = fechasDistintas;
      this.options.series = contValNew;
      let tituloEstacion: string;
      switch (datosCarga.estacion) {
        case '8495':
          tituloEstacion = `Station: 8495 Bermejales, Spain`;
          break;
        case '8084':
          tituloEstacion = `Station: 8084 Druzhba, Bulgaria`;
          break;
        case '12410':
          tituloEstacion = `Station: 12410 Patra-2, Greece`;
          break;
      }
      this.options.subtitle['text'] = tituloEstacion;
      Highcharts.chart('externos', this.options);
    });
  }
}
