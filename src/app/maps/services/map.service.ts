import { Injectable } from '@angular/core';

import { AnySourceData, LngLatBounds, LngLatLike, Map, Marker, Popup } from 'mapbox-gl';

import { DirectionsApiClient } from '../api';

import { Feature } from '../interfaces/places';
import { DirectionsResponse, Route } from '../interfaces/directions';

@Injectable({
  providedIn: 'root'
})

export class MapService {

  private _mapa?: Map;
  private _markers: Marker[] = [];

  get isMapReady() {
    return !!this._mapa;
  }

  constructor(private directionsApi: DirectionsApiClient) {
    
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

  createMarkerFromPlaces(places: Feature[], userLocation: [number, number]) {
    
    if(!this._mapa) {
      throw Error('Mapa no inicializado');
    }

    this._markers.forEach(marker => marker.remove());

    const newMarkers = [];

    for (const place of places) {
      const [lng, lat] = place.center;

      const popup = new Popup()
        .setHTML(`
          <h6>${ place.text }</h6>
          <span>${ place.place_name }</span>
        `);

      const newMarker = new Marker()
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(this._mapa);
      
      newMarkers.push(newMarker);
    }

    this._markers = newMarkers;

    if(places.length === 0) {
      return;
    }

    // Limites del mapa
    const bounds = new LngLatBounds(
      userLocation,
      userLocation
    );
    newMarkers.forEach(marker => bounds.extend(marker.getLngLat()));
    bounds.extend(userLocation);

    this._mapa.fitBounds(bounds, {
      padding: 200
    });
  }

  getRouteBetweenPoints(start: [number, number], end: [number, number]) {

    this.directionsApi.get<DirectionsResponse>(`/${start.join(',')};${end.join(',')}`)
      .subscribe(respuesta => this.drawPolyLine(respuesta.routes[0]));
  }

  private drawPolyLine(route: Route) {

    console.log({Kms: route.distance / 1000, duration: route.duration / 60});

    if(!this._mapa) {
      throw Error ('Mapa no inicializado');
    }

    const coordenadas = route.geometry.coordinates;

    // Limites del mapa
    const bounds = new LngLatBounds();
    coordenadas.forEach(([lng, lat]) => {
      bounds.extend([lng, lat]);
    });

    this._mapa?.fitBounds(bounds, {
      padding: 200
    })

    // Polyline
    const sourceData: AnySourceData = {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: coordenadas
            }
          }
        ]
      }
    }

    if(this._mapa.getLayer('RouteString')) {
      this._mapa.removeLayer('RouteString');
      this._mapa.removeSource('RouteString');
    }

    this._mapa.addSource('RouteString', sourceData);

    this._mapa.addLayer({
      id: 'RouteString',
      type: 'line',
      source: 'RouteString',
      layout: {
        'line-cap': 'round',
        'line-join': 'round'
      },
      paint: {
        'line-color': 'white',
        'line-width': 3
      }
    });
  }
}