import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cuttingText',
})
export class CuttingTextPipe implements PipeTransform {
  transform(
    value: {
      text: string;
      element: any;
      lines: number;
      customWidth?: number;
      elipsis?: boolean;
    },
    ...args: unknown[]
  ): string {
    return this.cuttingText(
      value.text,
      value.element,
      value.lines,
      value.customWidth ? value.customWidth : -1,
      typeof value.elipsis === 'boolean' ? value.elipsis : true
    );
  }

  cuttingText(
    text: string,
    element: any,
    lines: number,
    customWidth: number = -1,
    elipsis: boolean = true
  ): string {
    element = document.getElementById(element);
    let style = window.getComputedStyle(element);
    let font_size = style.fontSize;
    let font_family = style.fontFamily;
    let font = font_size + ' ' + font_family;
    let padding_adding: number;
    padding_adding = 0;
    if (style.paddingRight || style.paddingLeft) {
      if (style.paddingRight && style.paddingLeft) {
        padding_adding =
          parseInt(style.paddingRight.replace(/\D/g, '')) +
          parseInt(style.paddingLeft.replace(/\D/g, ''));
      } else if (style.paddingRight && !style.paddingLeft) {
        padding_adding = parseInt(style.paddingRight);
      } else if (style.paddingLeft && !style.paddingRight) {
        padding_adding = parseInt(style.paddingLeft);
      }
    } else if (style.padding) {
      let difPads = style.padding.split(' ');
      if (difPads[0] && !difPads[1]) {
        padding_adding = parseInt(difPads[0].replace(/\D/g, ''));
      } else if (difPads[0] && difPads[1] && !difPads[2] && !difPads[3]) {
        padding_adding =
          parseInt(difPads[1].replace(/\D/g, '')) +
          parseInt(difPads[1].replace(/\D/g, ''));
      } else if (difPads[0] && difPads[1] && difPads[2] && difPads[3]) {
        padding_adding =
          parseInt(difPads[1].replace(/\D/g, '')) +
          parseInt(difPads[3].replace(/\D/g, ''));
      }
    }
    let element_width: number;
    if (customWidth > 0) {
      element_width = customWidth;
    } else {
      element_width = parseInt(element.clientWidth);
    }
    element_width = element_width - padding_adding;
    element_width = element_width * lines;
    let posibleSpaces = padding_adding * (lines / 2);
    element_width = element_width - posibleSpaces;
    element_width = element_width > 0 ? element_width : 1;
    let canvas = document.createElement('canvas');
    let context = canvas.getContext('2d');
    if (context) {
      context.font = font;
      let width = context.measureText(text).width;
      let isTooLong: boolean;
      if (width >= element_width) {
        text = text.slice(0, text.length - 6);
        isTooLong = true;
      } else {
        isTooLong = false;
      }
      while (isTooLong == true) {
        let Ncanvas = document.createElement('canvas');
        let Ncontext = Ncanvas.getContext('2d');
        if (Ncontext) {
          Ncontext.font = font;
          let Nwidth = Ncontext.measureText(text).width;
          if (Nwidth > element_width) {
            text = text.slice(0, text.length - 6);
            isTooLong = true;
          } else {
            isTooLong = false;
          }
        } else {
          isTooLong = false;
        }
        if (isTooLong === false && elipsis === true) {
          text += '...';
        }
      }
    }
    return text;
  }
}
