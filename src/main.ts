import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

import Mapboxgl from 'mapbox-gl';
Mapboxgl.accessToken = 'pk.eyJ1IjoiY2FybG9zZ29tZXpmZXJuYW5kZXoiLCJhIjoiY2xmNDhmaHR1MTA2ajNzbGp0dTFibm5iciJ9.OXsZ2WCxR-PHkjCB_9Y6Zw';

if(!navigator.geolocation) {
  alert('El navegador no soporta Geolocation');
  throw new Error('El navegador no soporta Geolocation');
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
