import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { AqiService } from '../aqi.service';
import { Select } from '../seleccion';
import HeatmapModule from 'highcharts/modules/heatmap';
HeatmapModule(Highcharts);

const getPointCategoryName = (point: any, dimension: any) => {
  var series = point.series,
    isY = dimension === 'y',
    axis = series[isY ? 'yAxis' : 'xAxis'];
  return axis.categories[point[isY ? 'y' : 'x']];
};

const colorEU = (contaminante: number, valor: number): string => {
  let miColor: string;
  // Códigos aceptados [0.- PM10, 2.- NO2, 3.- O3]
  const limtesCont = [
    [20, 40, 50, 100, 150, 1200],
    [40, 90, 120, 230, 340, 1000],
    [50, 100, 130, 240, 380, 800]
  ];

  // ORDEN PARA colores
  //  "Good",  "Fair", "Moderate", "Poor", "VeryPoor", "ExtremelyPoor",
  const coloresAQI: any = [
    '#50F0E6',
    '#50CCAA',
    '#F0E641',
    '#FF5050',
    '#960032',
    '#7D2181'
  ];

  if (valor == 0) {
    miColor = '#BEBEBE';
  } else if (valor < limtesCont[contaminante][0]) {
    miColor = coloresAQI[0];
  } else if (valor < limtesCont[contaminante][1]) {
    miColor = coloresAQI[1];
  } else if (valor < limtesCont[contaminante][2]) {
    miColor = coloresAQI[2];
  } else if (valor < limtesCont[contaminante][3]) {
    miColor = coloresAQI[3];
  } else if (valor < limtesCont[contaminante][4]) {
    miColor = coloresAQI[4];
  } else {
    miColor = coloresAQI[5];
  }

  return miColor;
};

@Component({
  selector: 'app-mapa-calor',
  templateUrl: './mapa-calor.component.html',
  styleUrls: ['./mapa-calor.component.css']
})
export class MapaCalorComponent implements OnInit {
  Highcharts: typeof Highcharts = Highcharts;

  chartOptions: Highcharts.Options = {
    chart: {
      type: 'heatmap',
    },

    title: {
      text: 'Monthly Data'
    },

    xAxis: {
      categories: [
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '10',
        '11',
        '12',
        '13',
        '14',
        '15',
        '16',
        '17',
        '18',
        '19',
        '20',
        '21',
        '22',
        '23',
        '24',
        '25',
        '26',
        '27',
        '28',
        '29',
        '30',
        '31'
      ]
    },

    yAxis: {
      categories: ['PM 10', 'NO2', 'O3'],
      title: null,
      reversed: true
    },

    accessibility: {
      point: {
        descriptionFormatter: function(point) {
          var ix = point.index + 1,
            xName = getPointCategoryName(point, 'x'),
            yName = getPointCategoryName(point, 'y'),
            val = point.value;
          return ix + '. ' + xName + ' sales ' + yName + ', ' + val + '.';
        }
      }
    },

    colorAxis: {
      min: 0,
      minColor: '#FFFFFF',
      maxColor: Highcharts.getOptions().colors[0]
    },

    legend: {
      enabled: false,
      align: 'right',
      layout: 'vertical',
      margin: 0,
      verticalAlign: 'top',
      y: 25,
      symbolHeight: 280
    },

    tooltip: {
      formatter: function() {
        return (
          '<b>' +
          getPointCategoryName(this.point, 'x') +
          '</b>: Pollutant value: <br><b>' +
          this.point.value +
          '</b> for  <br><b>' +
          getPointCategoryName(this.point, 'y') +
          '</b>'
        );
      }
    },

    series: [
      {
        /*
      IMPORTANTE PONER EL TYPE
      */
        type: 'heatmap',
        name: 'Sales per employee',
        borderWidth: 1,
        data: [],
        dataLabels: {
          enabled: true,
          color: '#000000'
        }
      }
    ]
  };

  constructor(private aqiService: AqiService) {}

  select1: string = 'spain';
  //paises: Array<string> = ['greece', 'bulgaria', 'spain'];
  paisesOpcion: Array<Object> = 
    [
      {
        pais: 'greece',
        estacion: 'Greece, Patra-2'
      },
      {
        pais: 'bulgaria',
        estacion: 'Bulgaria, Druzhba'
      },
      {
        pais: 'spain',
        estacion: 'Spain, Bermejales'
      }
    ]

  select2: string = '2021';
  anyos: Array<string> = [];

  select3: string = 'May';
  meses: Array<string> = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];

  dias: Array<string> = [
    '01',
    '02',
    '03',
    '04',
    '05',
    '06',
    '07',
    '08',
    '09',
    '10',
    '11',
    '12',
    '13',
    '14',
    '15',
    '16',
    '17',
    '18',
    '19',
    '20',
    '21',
    '22',
    '23',
    '24',
    '25',
    '26',
    '27',
    '28',
    '29',
    '30',
    '31'
  ];

  submitted = false;

  async ngOnInit() {
    await this.getAnyos();
    this.select1 = 'spain';
    this.select2 = '2021';
    this.select3 = 'May';
    this.cargar();
  }

  async getAnyos() {
    await this.aqiService.getAnyos().then(b => {
      for (let i of b) {
        this.anyos.push(i._id);
      }
    });
  }

  onSubmit() {
    this.cargar();
  }

  async cargar() {
    let mimes = '01';
    if (this.select3 == 'January') {
      mimes = '01';
    } else if (this.select3 == 'February') {
      mimes = '02';
    } else if (this.select3 == 'March') {
      mimes = '03';
    } else if (this.select3 == 'April') {
      mimes = '04';
    } else if (this.select3 == 'May') {
      mimes = '05';
    } else if (this.select3 == 'June') {
      mimes = '06';
    } else if (this.select3 == 'July') {
      mimes = '07';
    } else if (this.select3 == 'August') {
      mimes = '08';
    } else if (this.select3 == 'September') {
      mimes = '09';
    } else if (this.select3 == 'October') {
      mimes = '10';
    } else if (this.select3 == 'November') {
      mimes = '11';
    } else if (this.select3 == 'December') {
      mimes = '12';
    }
    await this.getData(this.select1, this.select2, mimes);
  }

  async getData(pais: string, anyo: string, mes: string) {
    let res: Array<any> = new Array();
    await this.aqiService.getMeses(pais, anyo, mes).then(b => {
      for (let dia of this.dias) {
        let e = false;
        for (let dato of b) {
          if (dato._id == anyo + '-' + mes + '-' + dia) {
            if (dato.vpm10 == null) {
              res.push({ x: parseInt(dia) - 1, y: 0, value: 0 });
            } else {
              res.push({
                x: parseInt(dia) - 1,
                y: 0,
                value: dato.vpm10.toFixed(1)
              });
            }
            if (dato.vno2 == null) {
              res.push({ x: parseInt(dia) - 1, y: 1, value: 0 });
            } else {
              res.push({
                x: parseInt(dia) - 1,
                y: 1,
                value: dato.vno2.toFixed(1)
              });
            }
            if (dato.vo3 == null) {
              res.push({ x: parseInt(dia) - 1, y: 2, value: 0 });
            } else {
              res.push({
                x: parseInt(dia) - 1,
                y: 2,
                value: dato.vo3.toFixed(1)
              });
            }
            e = true;
          }
        }
        if (e == false) {
          res.push({ x: parseInt(dia) - 1, y: 0, value: 0 });
          res.push({ x: parseInt(dia) - 1, y: 1, value: 0 });
          res.push({ x: parseInt(dia) - 1, y: 2, value: 0 });
        }
      }
    });
    let dataSeriesFinal = res.map((i: any) => {
      let miColor: string;

      miColor = colorEU(i.y, i.value);

      console.log(i.x, i.y, i.value, miColor);

      return {
        x: i.x,
        y: i.y,
        value: i.value,
        color: miColor
      };
    });
    this.chartOptions.series[0]['data'] = dataSeriesFinal;
    Highcharts.chart('MapaCalor', this.chartOptions);
  }
}
