import { Component, OnInit } from '@angular/core';
import { AqiService } from '../aqi.service';
import * as Highcharts from 'highcharts';
import HC_more from 'highcharts/highcharts-more';
import {
  estaciones,
  typeSeries,
  seriesContaminates
} from '../parametros/burbujas';
HC_more(Highcharts);

interface ExtendedChart extends Highcharts.PlotPackedbubbleOptions {
  layoutAlgorithm: {
    splitSeries: any; // Para poner type a este campo, en otro caso se queja Angular
  };
}

let arraySeriesContaminantes: Array<seriesContaminates> //= new Array<seriesContaminates>();

@Component({
  selector: 'app-burbujas',
  templateUrl: './burbujas.component.html',
  styleUrls: ['./burbujas.component.css']
})
export class BurbujasComponent implements OnInit {
  //seriesContaminantes: Array<typeSeriesContamintates>;

  Highcharts: typeof Highcharts = Highcharts;

  chartOptions: Highcharts.Options = {
    chart: {
      type: 'packedbubble',
      height: '35%'
    },
    title: {
      text: ''
    },
    tooltip: {
      useHTML: true,
      pointFormat: '<b>{point.name}:</b> {point.value}micrg/m3 PM<sub>2.5</sub>'
    },
    plotOptions: {
      packedbubble: {
        minSize: '20%',
        maxSize: '100%',
        zMin: 0,
        zMax: 1000,
        layoutAlgorithm: {
          gravitationalConstant: 0.05,
          splitSeries: true,
          seriesInteraction: false,
          dragBetweenSeries: true,
          parentNodeLimit: true
        },

        dataLabels: {
          enabled: true,
          format: '{point.name}',
          filter: {
            property: 'y',
            operator: '>',
            value: 250
          },
          style: {
            color: 'black',
            textOutline: 'none',
            fontWeight: 'normal'
          }
        }
      } as ExtendedChart
    },
    series: []
  };
  constructor(private aqiService: AqiService) {}

  select: String = 'PM10';
  // 0.- PM10 1.- NO2 2.- O3
  contaminantes: Array<string> = ['PM10', 'O3', 'NO2'];

  async getSeries() {
    arraySeriesContaminantes = new Array<seriesContaminates>()

    //Creamos una pareja contaminante serie por cada contaminante que podamos elegir para mostrar
    for (let i: number = 0; i < 3; i++) {
      arraySeriesContaminantes.push({
        contaminate: this.contaminantes[i],
        serie: []
      });
    }

    // Inicializamos las series de las 3 ciudades con el mismo número de elementos que vamos a necesitar
    // Es necesario antes se asignar
    for (let ciudadEstacion of estaciones) {
      // Inicializamos los tres contemiantes
      // 0.- PM10 1.- NO2 2.- O3
      for (let i: number = 0; i < 3; i++) {
        arraySeriesContaminantes[i].serie.push({
          type: 'packedbubble',
          name: ciudadEstacion.ciudad,
          data: []
        });
      }

      for (let estacion of ciudadEstacion.estaciones) {
        // Inicializamos los nombres de las estaciones para los tres cont.

        //   arraySeriesContaminantes[0].serie[ciudadEstacion.indiceCiudad].data

        // 0.- PM10 1.- NO2 2.- O3
        for (let i: number = 0; i < 3; i++) {
          arraySeriesContaminantes[i].serie[
            ciudadEstacion.indiceCiudad
          ].data.push({
            name: estacion.nombre,
            value: 0
          });
        }
      }
    }

    // Fin Inicialización

    // Recorremos las ciudades que utilizamos
    for (let ciudadEstacion of estaciones) {
      // Recorremos las estaciones de cada una de las ciudades
      // de las que tenemos el nombre y el código
      // usaremos los indices establecidos en los parámetros

      //pruebaNO2[ciudadEstacion.indiceCiudad].type = "packedbubble";
      //pruebaNO2[ciudadEstacion.indiceCiudad].name = ciudadEstacion.ciudad;

      for (let estacion of ciudadEstacion.estaciones) {
        // Solicitamos los valores para cada estación
        // Y vamos preparando las series
        await this.aqiService.getEstacionPromise(estacion.codigo)
        .then(b => {
          /// Cargar aquí con push los valores de las series.
          /// Se declararían sin valores y aquí se pondrían todos los valores
          /// La duda es si se pueden cargar los arrays de documentos data
          /// en todo caso se inicializaría la estación completa al principio
          //// la idea es no tenerlas previamente cargadas para no repetir
          /// Ni nombres se estaciones ni cliudades. Que estén solo en los
          /// Parámetros. Que alguna vez podrían ser de entrada junto
          /// con los contaminantes.

          // 0.- PM10 1.- NO2 2.- O3
          arraySeriesContaminantes[0].serie[ciudadEstacion.indiceCiudad].data[
            estacion.indiceEstacion
          ].value = b.data.iaqi.pm10.v;

          arraySeriesContaminantes[1].serie[ciudadEstacion.indiceCiudad].data[
            estacion.indiceEstacion
          ].value = b.data.iaqi.no2.v;

          arraySeriesContaminantes[2].serie[ciudadEstacion.indiceCiudad].data[
            estacion.indiceEstacion
          ].value = b.data.iaqi.o3.v;
        })
        .catch(error => {console.log(error)})
      }
    }
  }

  async ngOnInit() {
    this.select = 'PM10';
    await this.getSeries(); // await para que espere
    console.log(arraySeriesContaminantes);
    this.cargar();
  }

  evento() {
    this.cargar();
  }

  onSubmit() {
    this.cargar();
  }

  async cargar() {
    if (this.select == 'PM10') {
      this.chartOptions.title.text = 'Current PM10 data';
      this.chartOptions.tooltip.pointFormat =
        '<b>{point.name}:</b> {point.value}µg/m<sup>3</sup> PM<sub>10</sub>';
      // hacemos un casting, que se comporte como tipo any y lo podamos asignar
      this.chartOptions.series = arraySeriesContaminantes[0].serie as any; //seriesPM10 as any //
    } else if (this.select == 'NO2') {
      this.chartOptions.title.text = 'Current N02 data';
      this.chartOptions.tooltip.pointFormat =
        '<b>{point.name}:</b> {point.value}µg/m<sup>3</sup> NO<sub>2</sub>';
      this.chartOptions.series = arraySeriesContaminantes[1].serie as any; // seriesNO2 as any //
    } else if (this.select == 'O3') {
      this.chartOptions.title.text = 'Current O<sub>3</sub> data ';
      this.chartOptions.tooltip.pointFormat =
        '<b>{point.name}:</b> {point.value}µg/m<sup>3</sup> O<sub>3</sub>';
      this.chartOptions.series = arraySeriesContaminantes[2].serie as any; // seriesO3 as any //
    }
    Highcharts.chart('miGrafico', this.chartOptions);
  }
}
