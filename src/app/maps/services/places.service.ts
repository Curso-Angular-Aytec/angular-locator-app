import { Injectable } from '@angular/core';

import { PlacesApiClient } from '../api';
import { MapService } from '.';
import { PlacesResponse, Feature } from '../interfaces/places';

@Injectable({
  providedIn: 'root'
})

export class PlacesService {

  public userLocation?: [number, number];
  public isLoadingPlaces: boolean = false;
  public places: Feature[] = [];

  get isUserLocationReady(): boolean {

    return !!this.userLocation;
  }

  constructor(private placesApi: PlacesApiClient,
              private mapService: MapService) {
    this.getUserLocation();
  }

  public async getUserLocation(): Promise<[number, number]> {

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          this.userLocation = [coords.longitude, coords.latitude];
          resolve(this.userLocation);
        },
        (error => {
          alert('No se pudo obtener la geolocalización');
          console.log(error);
          reject();
        })
      );
    });
  }

  getPlacesByQuery(query: string) {

    if(query.length === 0) {
      this.isLoadingPlaces = false;
      this.places = [];
      return;
    }

    this.isLoadingPlaces = true;

    if(!this.userLocation) {
      throw Error('No hay user location');
    }

    this.placesApi.get<PlacesResponse>(`/${ query }.json`, {
      params: {
        proximity: this.userLocation.join(',')
      }
    })
      .subscribe(respuesta => {
        console.log(respuesta.features);
        this.isLoadingPlaces = false;
        this.places = respuesta.features;
        this.mapService.createMarkerFromPlaces(this.places, this.userLocation!);
      });
  }

  hideResults() {
    this.places = [];
  }
}