import { Component, OnInit } from '@angular/core';
import { Select } from '../seleccion';
import { AqiService } from '../aqi.service';

@Component({
  selector: 'app-datos-mensuales',
  templateUrl: './datos-mensuales.component.html',
  styleUrls: ['./datos-mensuales.component.css']
})
export class DatosMensualesComponent implements OnInit {
  colorEU(valor: number, con: string): string {
    let contaminante: number;
    if (con == 'pm10') {
      contaminante = 0;
    } else if (con == 'no2') {
      contaminante = 1;
    } else {
      contaminante = 2;
    }
    let miColor: string;
    // Códigos aceptados [0.- PM10, 1.- NO2, 2.- O3]
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
  }

  getColor(i: number) {
    if (i > 15) {
      return 'red';
    } else {
      return 'blue';
    }
  }

  resultado: Array<any>;
  constructor(private aqiService: AqiService) {}

  select1 = 'pm10';
  select2 = '2021';
  select5 = 'spain';

  contaminantes: Array<string> = ['pm10', 'no2', 'o3'];

  anyos: Array<string> = [];

  meses: Array<string> = [
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
    '12'
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


  async getData(contaminante: string, pais: string, anyo: string) {
    let res: Array<any> = new Array();
    await this.aqiService.getMes(contaminante, pais, anyo).then(b => {
      console.log(b);
      for (let mes of this.meses) {
        for (let dia of this.dias) {
          let e = false;
          for (let dato of b) {
            if (dato._id == anyo + '-' + mes + '-' + dia) {
              if (dato.v == null) {
                res.push('0');
              } else {
                res.push(dato.v.toFixed(1));
              }
              e = true;
            }
          }
          if (e == false) {
            res.push('0');
          }
        }
      }
      this.resultado = res;
      console.log(this.resultado);
    });
  }

  async getAnyos() {
    await this.aqiService.getAnyos().then(b => {
      for (let i of b) {
        this.anyos.push(i._id);
      }
    });
  }

  async ngOnInit() {
    await this.getAnyos();
    console.log(this.anyos);
    this.select1 = 'pm10';
    this.select2 = '2021';
    this.select5 = 'spain';
    await this.cargar();
  }

  async cargar() {
    await this.getData(this.select1, this.select5, this.select2);
  }

  onSubmit() {
    this.cargar();
  }
}
