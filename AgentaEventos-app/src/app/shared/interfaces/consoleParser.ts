export interface IConsoleParser {
  type?: 'log' | 'info' | 'trace' | 'error';
  thing: any;
  style?: string;
  line?: string | null;
  stoper?: boolean;
}
