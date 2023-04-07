import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServicesService } from 'src/app/core/services/services.service';

@Injectable({
  providedIn: 'root',
})
export class FileUploaderService {
  constructor(private _servicesService: ServicesService) {}

  uploadFile(file: File, data: any, url: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('data', JSON.stringify(data));

    return this._servicesService.post(url, formData, true);
  }
  convertFileToBase64(file: File): Promise<string | ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (reader.result === null) {
          reject('File reading failed');
        } else {
          resolve(reader.result);
        }
      };
      reader.onerror = (error) => reject(error);
    });
  }
  downloadContent(req: any): Observable<any> {
    return this._servicesService.post(
      `/qcontentService/downloadContent`,
      req
    );
  }
  convertBase64ToFile(base64Data: string) {
    var byteCharacters = atob(base64Data);
    var byteNumbers = new Array(byteCharacters.length);
    for (var i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    var byteArray = new Uint8Array(byteNumbers);
    var file = new Blob([byteArray], { type: 'application/pdf;base64' });
    var fileURL = URL.createObjectURL(file);
    return fileURL;
  }
}
