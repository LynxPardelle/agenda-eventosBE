export interface ISpecialCell {
  type: 'customHtml' | 'button' | 'dropdown' | 'input' | 'uploadFile';
  thing: string;
  object?: any;
}
