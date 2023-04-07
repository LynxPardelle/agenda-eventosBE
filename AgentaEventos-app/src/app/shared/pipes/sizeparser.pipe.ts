import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sizeParser',
})
export class SizeParserPipe implements PipeTransform {
  transform(size: number, ...args: unknown[]): unknown {
    let nSize: any;
    switch (true) {
      case size < 1024:
        nSize = size.toFixed(2) + 'bytes';
        break;
      case size > 1024 && size < 1048576:
        nSize = size / 1024;
        nSize = nSize.toFixed(2) + 'kb';
        break;
      case size > 1048576 && size < 1073741824:
        nSize = size / 1048576;
        nSize = nSize.toFixed(2) + 'mb';
        break;
      case size > 1073741824:
        nSize = size / 1048576;
        nSize = nSize.toFixed(2) + 'gb';
        break;
    }
    return nSize;
  }
}
