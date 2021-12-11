export const estaciones = [
  {
    ciudad: "Atenas",
    indiceCiudad: 0,
    estaciones: [
      {
        indiceEstacion: 0,
        nombre: "Pireaus-1",
        codigo: "12529"
      },
      {
        indiceEstacion: 1,
        nombre: "Agia Paraskevi",
        codigo: "12412"
      },
      {
        indiceEstacion: 2,
        nombre: "Lykovrisi",
        codigo: "12528"
      }
    ]
  },
  {
    ciudad: "Sevilla",
    indiceCiudad: 1,
    estaciones: [
      {
        indiceEstacion: 0,
        nombre: "Bermejales",
        codigo: "8495"
      },
      {
        indiceEstacion: 1,
        nombre: "Torneo",
        codigo: "8492"
      },
      {
        indiceEstacion: 2,
        nombre: "Los Principes",
        codigo: "8491"
      }
    ]
  },
  {
    ciudad: "Sofía",
    indiceCiudad: 2,
    estaciones: [
      {
        indiceEstacion: 0,
        nombre: "Druzhba",
        codigo: "8084"
      },
      {
        indiceEstacion: 1,
        nombre: "Pavlovo",
        codigo: "8086"
      },
      {
        indiceEstacion: 2,
        nombre: "Hipodruma",
        codigo: "10091"
      }
    ]
  }
];

export interface datos {
      name: string,  // nombre estación
      value: number // vallor contaminante
}

export interface typeSeries {
  type: string, // "packedbubble" siempre
  name: string, // nombre ciudad
  data: Array<datos>  // array para las tres estaciones
}

export interface seriesContaminates {
  contaminate: string,
  serie: Array<typeSeries>
}
