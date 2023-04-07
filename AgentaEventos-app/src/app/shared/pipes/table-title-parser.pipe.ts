import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tableTitleParser',
})
export class TableTitleParserPipe implements PipeTransform {
  public names: any = {};
  transform(value: string, ...args: unknown[]): unknown {
    if (!!this.names[value.toString()]) {
      value = this.names[value.toString()];
    }
    return value;
  }
}
