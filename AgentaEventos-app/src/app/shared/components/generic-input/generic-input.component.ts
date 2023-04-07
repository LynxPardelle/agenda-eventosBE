import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
/* Interfaces */
import { ISpanInput } from '../../interfaces/spanInput';
import { IOptionDropdown } from '../../interfaces/optionDropdown';
/* Services */
import { SharedService } from '../../services/shared.service';
@Component({
  selector: 'generic-input',
  templateUrl: './generic-input.component.html',
  styleUrls: ['./generic-input.component.scss'],
})
export class GenericInputComponent implements OnInit {
  /* Input */
  @Input() hasBeenTouched: boolean = false;
  @Input() labelTitle: string = '';
  @Input() placeholder: any;
  @Input() thingFather: any;
  @Input() thing!: string;
  @Input() type!: string;
  @Input() spans: ISpanInput[] = [];
  @Input() disabled: boolean = false;
  @Input() inputClasses: string = 'form-control';
  @Input() inputDisabledClasses: string = 'form-control';
  @Input() labelClasses: string = 'd-block mx-auto h4 fw-bold';
  @Input() buttonClasses: string = '';
  @Input() listClasses: string = '';
  @Input() disabledClassButton: string = '';
  @Input() options: IOptionDropdown[] = [];
  @Input() readonly: boolean = false;
  @Input() readonlyClasses: string = '';
  @Input() required: boolean = false;
  /* Output */
  @Output() changesInput = new EventEmitter<any>();
  @Output() clickedTitle = new EventEmitter<string | number>();
  @Output() clicked = new EventEmitter<IOptionDropdown>();
  constructor(private _sharedService: SharedService) {}
  ngOnInit(): void {
    this.cssCreate();
  }
  writtingInInput(event: any) {
    this.hasBeenTouched = true;
    this.thingFather.locked = !this.spans.every((s) => {
      return !this.evalThing(s.evalThing);
    });
    this.changesInput.emit(this.thingFather);
  }
  evalThing(evalThing: string): boolean {
    if (this.hasBeenTouched === true) {
      switch (true) {
        case evalThing === 'required':
          return this.thingFather[this.thing]?.length <= 0;
          break;
        case evalThing.includes('!validRegEx'):
          let newRegexN = new RegExp(evalThing.replace('!validRegEx', ''));
          return !newRegexN.test(this.thingFather[this.thing]);
          break;
        case evalThing.includes('validRegEx'):
          let newRegex = new RegExp(evalThing.replace('validRegEx', ''));
          return !newRegex.test(this.thingFather[this.thing]);
          break;
        case evalThing.includes('equal'):
          return (
            evalThing.replace('equal', '') !== this.thingFather[this.thing]
          );
          break;
        case evalThing.includes('not-equal'):
          return (
            evalThing.replace('not-equal', '') === this.thingFather[this.thing]
          );
          break;
        case evalThing.includes('numberMin'):
          return (
            parseInt(this.thingFather[this.thing]) <
            parseInt(evalThing.replace('numberMin', ''))
          );
          break;
        case evalThing.includes('min'):
          return (
            this.thingFather[this.thing].length <
            parseInt(evalThing.replace('min', ''))
          );
          break;
        case evalThing.includes('numberMax'):
          return (
            parseInt(this.thingFather[this.thing]) >
            parseInt(evalThing.replace('numberMax', ''))
          );
          break;
        case evalThing.includes('max'):
          return (
            this.thingFather[this.thing].length >
            parseInt(evalThing.replace('max', ''))
          );
          break;
        case evalThing === 'email':
          let emailRegex = new RegExp(
            '^[a-z0-9._%+-]+@[a-z0-9.-]{2,}(.[a-z]{2,4})+$'
          );
          return !emailRegex.test(this.thingFather[this.thing]);
          break;
        case evalThing === 'password':
          let passwordRegex = new RegExp(
            // Create a regex to check if the password is valid
            // At least one digit, one lowercase, one uppercase letter and one special character
            // Minimum eight in length
            '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*"/(///)/=¡?\'\\)])(?=.{8,})'
          );
          return !passwordRegex.test(this.thingFather[this.thing]);
          break;
        default:
          return false;
          break;
      }
    } else {
      return false;
    }
  }
  getClasses(newClass: string): any {
    let newClasses: any = {};
    for (let nClass of newClass.split(' ')) {
      newClasses[nClass.toString()] = true;
    }
    this._sharedService.cssCreate();
    return newClasses;
  }
  changeValue(value: any) {
    this.thingFather[this.thing.toString()] = value;
    this.changesInput.emit(this.thingFather);
    setTimeout(() => {
      this.cssCreate();
    }, 10);
  }
  cssCreate() {
    this._sharedService.cssCreate();
  }
}
