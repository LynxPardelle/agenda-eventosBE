import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'safeHtml',
})
export class SafeHtmlPipe implements PipeTransform {
  constructor(private _sanitizer: DomSanitizer) {}

  transform(
    value: string | { text: string; matches: string[] },
    type: string = 'html',
    ...args: unknown[]
  ): unknown {
    let cValue = typeof value === 'string' ? value : value.text;
    switch (type) {
      case 'html':
        return this._sanitizer.bypassSecurityTrustHtml(cValue);
      case 'style':
        return this._sanitizer.bypassSecurityTrustStyle(cValue);
      case 'script':
        return this._sanitizer.bypassSecurityTrustScript(cValue);
      case 'url':
        return this._sanitizer.bypassSecurityTrustUrl(cValue);
      case 'resourceUrl':
        return this._sanitizer.bypassSecurityTrustResourceUrl(cValue);
      default:
        return this._sanitizer.bypassSecurityTrustHtml(cValue);
    }
  }
}
