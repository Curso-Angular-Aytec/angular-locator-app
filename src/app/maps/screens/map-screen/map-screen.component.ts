import { Component } from '@angular/core';

import { PlacesService } from '../../services';

@Component({
  selector: 'app-map-screen',
  templateUrl: './map-screen.component.html',
  styleUrls: ['./map-screen.component.css']
})

export class MapScreenComponent {

  get isUserLocationReady() {
    return this.placesServices.isUserLocationReady;
  }

  constructor(private placesServices: PlacesService) {

  }
}