import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit {
  public changes: { title: string; date: string; description: string }[] = [
    {
      title: 'Versión 0.0.1 - MVP 1',
      date: '07/04/2023',
      description: 'Versión inicial para el mvp(minimum viable product).',
    },
    {
      title: 'Versión 0.0.2',
      date: '07/04/2023',
      description:
        'Selector de fechas mejorado y reparación de bugs con la creación de tickets y la actualización de usuarios.',
    },
    {
      title: 'Versión 0.0.3',
      date: '07/04/2023',
      description: 'Arreglo del rol de los tickets.',
    },
    {
      title: 'Versión 0.0.4',
      date: '07/04/2023',
      description: 'Arreglo de bug de selector de tickets en el BE.',
    },

    {
      title: 'Versión 0.0.5',
      date: '07/04/2023',
      description:
        'Arreglo con el folder de subida de imágenes para el servidor de produción.',
    },
    {
      title: 'Versión 0.0.6',
      date: '07/04/2023',
      description:
        'Arreglo con el folder de subida de imágenes para el servidor de producción 2.',
    },
    {
      title: 'Versión 0.0.7',
      date: '07/04/2023',
      description:
        'Cambio a activity en el BE para evitar errores en peticiones que tienen activity.',
    },
    {
      title: 'Versión 0.0.8',
      date: '07/04/2023',
      description: 'Acomodo de las imágenes con object fit y object position.',
    },
    {
      title: 'Versión 0.0.9',
      date: '11/04/2023',
      description:
        'Se arreglaron los problemas de memoria, cambiando como se generan las clases con ngClass, además se añadió esta sección y la página de error es útil ahora, también se ha añadido mensajes de confirmación.',
    },
  ];
  constructor(
    private location: Location,
    private _sharedService: SharedService
  ) {}
  ngOnInit(): void {
    this.cssCreate();
  }
  getHTML(type: string): string {
    return this._sharedService.getHTML(type);
  }
  returnToPreviousPage() {
    this.location.back();
  }
  cssCreate() {
    this._sharedService.cssCreate();
  }
}
