import { IButton } from './button';

export interface IOptionButton extends IButton {
  id: string;
  icon: string;
  show: boolean;
  text: string;
  click: string;
}
