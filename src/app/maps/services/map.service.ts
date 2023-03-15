import { Injectable } from '@angular/core';

import { LngLatLike, Map } from 'mapbox-gl';

@Injectable({
  providedIn: 'root'
})

export class MapService {

  private _mapa?: Map;

  get isMapReady() {
    return !!this._mapa;
  }

  setMap(mapa: Map) {
    this._mapa = mapa;
  }

  flyTo(coordenadas: LngLatLike) {
    if(!this.isMapReady) {
      throw Error('El mapa no está inicializado');
    }

    this._mapa?.flyTo({
      zoom: 14,
      center: coordenadas
    });
  }
}