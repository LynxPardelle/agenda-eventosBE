import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
/* Environments */
import { environment } from 'src/environments/environment';
/* Interfaces */
import { IActivity } from '../../interfaces/activity';
import { IOptionDropdown } from 'src/app/shared/interfaces/optionDropdown';
import { IEvento } from '../../interfaces/evento';
/* Services */
import { SharedService } from 'src/app/shared/services/shared.service';
import { EventoService } from '../../services/evento.service';

@Component({
  selector: 'activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss'],
})
export class ActivityComponent implements OnChanges {
  /* Environments */
  public url: string = environment.api + '/evento/';
  /* Input */
  @Input() activity!: IActivity;
  @Input() ticketTypes: number = 1;
  @Input() isEdit: boolean = false;
  @Input() eventoId: string = '';
  @Input() token: string = '';
  @Input() evento!: IEvento;
  /* Output */
  @Output() activityEdited = new EventEmitter<null>();

  public ticketTypesOptions: IOptionDropdown[] = this.getTicketTypesOptions();
  public lockeds: { [key: string]: boolean } = {
    title: this.activity?.title !== '',
  };
  public changers: string[] = [];
  /* Constructor */
  constructor(
    private _sharedService: SharedService,
    private _eventoService: EventoService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if (
      !!changes['ticketTypes'] &&
      changes['ticketTypes'].currentValue !==
        changes['ticketTypes'].previousValue
    ) {
      this.ticketTypesOptions = this.getTicketTypesOptions();
    }
  }
  onSubmit() {
    if (this.activity._id !== '') {
      this._eventoService.updateActivity(this.activity).subscribe({
        next: (res: { status: string; activity: IActivity }) => {
          this._sharedService.consoleParser({ thing: res, type: 'log' });
          this.activity = res.activity ? res.activity : this.activity;
          this.activityEdited.emit();
          this.cssCreate();
        },
        error: (err) => {
          this._sharedService.consoleParser({ type: 'error', thing: err });
        },
      });
    } else {
      this._eventoService
        .createActivity(this.activity, this.eventoId)
        .subscribe({
          next: (res: { status: string; activity: IActivity }) => {
            this._sharedService.consoleParser({ thing: res, type: 'log' });
            this.activity = res.activity ? res.activity : this.activity;
            this.activityEdited.emit();
            this.cssCreate();
          },
          error: (err) => {
            this._sharedService.consoleParser({ type: 'error', thing: err });
          },
        });
    }
  }
  getTicketTypesOptions(): IOptionDropdown[] {
    // Get the the maximun number in an array of numbers
    // https://stackoverflow.com/questions/1669190/find-the-min-max-element-of-an-array-in-javascript
    // Math.max(...[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    return Array.from(Array(6).keys())
      .filter((i) => i <= this.ticketTypes)
      .map((i) => {
        return {
          type: 'menuitem',
          option: `${i}`,
          click: `ticketTypes=${i}`,
        };
      });
  }
  clicked(event: IOptionDropdown) {
    switch (true) {
      case event.click.includes('ticketType'):
        this.activity.ticketType = parseInt(event.click.split('=')[1]);
        break;
      default:
        break;
    }
  }
  changeChangers(changer: string) {
    if (!this.isEdit) return;
    if (this.changers.includes(changer)) {
      let index = this.changers.indexOf(changer);
      this.changers.splice(index, 1);
    } else {
      this.changers.push(changer);
    }
  }
  changesInput(thing: any) {
    Object.keys(this.lockeds).forEach((lockedInput) => {
      this.lockeds[lockedInput] = thing[lockedInput]
        ? thing.locked
        : this.lockeds[lockedInput];
    });
    if (this.checkIfFormValid()) this.cssCreate();
  }
  checkIfFormValid() {
    return Object.values(this.lockeds).every((locked) => locked === false);
  }
  cssCreate() {
    this._sharedService.cssCreate();
  }
}
