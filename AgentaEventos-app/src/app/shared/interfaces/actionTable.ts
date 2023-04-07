export interface IActionTable {
  type: 'edit' | 'visit' | 'delete' | 'custom';
  action: string;
  tooltip?: string;
  customIcon?: string;
  object?: any;
}
