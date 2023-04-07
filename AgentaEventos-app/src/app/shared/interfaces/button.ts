export interface IButton {
  type?: string;
  defaultClassButton?: string;
  classButton?: string;
  disabledClassButton?: string;
  customHtml?: string;
  disabled?: boolean;
  tooltip?: string;
  tooltipPosition?: 'after' | 'before' | 'above' | 'below' | 'left' | 'right';
  showTooltip?: boolean;
  tooltipClass?: string;
}
