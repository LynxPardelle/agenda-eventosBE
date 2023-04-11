import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
/* RxJs */
import { Observable, Subject, takeUntil } from 'rxjs';
/* Interfaces */
import { IUser } from '../../interfaces/user';
import { IOptionDropdown } from 'src/app/shared/interfaces/optionDropdown';
import { IOptionButton } from 'src/app/shared/interfaces/optionButton';
/* Models */
import { User } from '../../models/user';
/* Services */
import { SharedService } from 'src/app/shared/services/shared.service';
import { UserService } from '../../services/user.service';
/* Store */
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/state/app.state';
import { IdentitySelector } from 'src/app/state/selectors/sesion.selector';
import { LoadSesion } from 'src/app/state/actions/sesion.actions';
/* Libs */
import Swal from 'sweetalert2';

@Component({
  selector: 'user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  /* Models */
  public user: IUser = new User(
    '', // _id: string,
    '', // name: string,
    'basic', // roleType: 'basic' | 'premium' | 'special',
    'asistente', // generalRole: 'asistente' | 'operador' | 'administrador' | 'técnico',
    [], // tickets: ITicket[],
    '', // email: string,
    '', // password: string,
    '', // lastPassword: string,
    '', // passRec: string,
    false, // verified: boolean,
    0, // uses: number,
    new Date(), // createAt: Date,
    new Date(), // changeDate: Date,
    null, // changeUser: IUser | null,
    '', // changeType: string,
    0, // ver: number,
    false, // isDeleted: boolean,
    [] // changeHistory: IUser[]
  );
  public user2compare: any = {
    password: '',
  };
  public identity$: Observable<IUser | undefined>;
  public identity: IUser | undefined;
  /* Utility */
  public lockeds: { [key: string]: boolean } = {
    name: true,
    email: true,
    password: true,
    lastPassword: this.user._id !== '',
  };
  public generalRoleOptions: IOptionDropdown[] = this.getGeneralRoleOptions();
  public isEdit: boolean = true;
  public changers: string[] = ['name', 'email'];
  public showOptions: boolean = false;
  public options: IOptionButton[] = [
    {
      id: 'edit',
      icon: this.getHTML('edit'),
      show: true,
      text: 'Editar',
      click: 'edit',
    },
    {
      id: 'photos',
      icon: this.getHTML('photos'),
      show: false,
      text: 'Comparte fotos',
      click: 'photos',
    },
    {
      id: 'score',
      icon: this.getHTML('score'),
      show: false,
      text: '¡Califícanos!',
      click: 'score',
    },
  ];
  private _unsubscribeAll: Subject<any> = new Subject();
  constructor(
    private location: Location,
    private _router: Router,
    private _route: ActivatedRoute,
    private _sharedService: SharedService,
    private _userService: UserService,
    private store: Store<AppState>
  ) {
    this.identity$ = this.store.select(IdentitySelector);
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this._route.params.subscribe({
      next: (params) => {
        if (params['id']) {
          /* TODO: Añadir popups de error y éxito. */
          this.getData(params['id']);
        }
      },
      error: (err) => {
        this._sharedService.consoleParser({ thing: err, type: 'error' });
      },
    });
    this.getIdentity();
    this.store.dispatch(LoadSesion());
    this.cssCreate();
  }
  getIdentity() {
    this.identity$.pipe(takeUntil(this._unsubscribeAll)).subscribe({
      next: (identity: IUser | undefined) => {
        this.identity = identity;
      },
      error: (err) => {
        this._sharedService.consoleParser({ thing: err, type: 'error' });
        Swal.fire(
          'Error al cargar la información del usuario',
          err.toString(),
          'error'
        );
      },
    });
  }
  getData(id: string) {
    this._userService.getUser(id).subscribe({
      next: (res: { status: string; user: IUser }) => {
        this.isEdit = false;
        this.changers = [];
        this.user = res.user ? res.user : this.user;
        this.user.password = '';
        this.user2compare.password = '';
        this.user.lastPassword = '';
        this.user.passRec = '';
        this.generalRoleOptions = this.getGeneralRoleOptions();
        this.checkForLockeds();
        /* TODO: Change options for diferent types of users
              this.options[0].show = false;
              this.options[1].show = true;
              this.options[2].show = true;
              */
        this.cssCreate();
      },
      error: (err) => {
        this._sharedService.consoleParser({ thing: err, type: 'error' });
        Swal.fire(
          'Error al cargar la información del usuario',
          err.toString(),
          'error'
        );
        this._router.navigate(['/user/user']);
      },
    });
  }
  onSubmit() {
    Swal.fire({
      title: '¿Quieres guardar los cambios?',
      icon: 'warning',
      showDenyButton: true,
      confirmButtonText: 'Si',
      denyButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.user._id !== '') {
          this._userService.updateUser(this.user).subscribe({
            next: (res: { status: string; user: IUser }) => {
              this.user = res.user ? res.user : this.user;
              this.user.password = '';
              this.user2compare.password = '';
              this.user.lastPassword = '';
              this.user.passRec = '';
              this.generalRoleOptions = this.getGeneralRoleOptions();
              this.checkForLockeds();
              this.cssCreate();
              Swal.fire('Se guardaron los cambios', '', 'success');
            },
            error: (err) => {
              this._sharedService.consoleParser({ thing: err, type: 'error' });
              Swal.fire(
                'Error al guardar la información del usuario',
                err.toString(),
                'error'
              );
            },
          });
        } else {
          this.user.lastPassword = this.user.password;
          this._userService.register(this.user).subscribe({
            next: (res: { status: string; user: IUser }) => {
              this.user = res.user ? res.user : this.user;
              this.user.password = '';
              this.user2compare.password = '';
              this.user.lastPassword = '';
              this.user.passRec = '';
              this.generalRoleOptions = this.getGeneralRoleOptions();
              this.checkForLockeds();
              this.cssCreate();
              Swal.fire('Se guardaron los cambios', '', 'success');
            },
            error: (err: any) => {
              this._sharedService.consoleParser({ thing: err, type: 'error' });
              Swal.fire(
                'Error al guardar la información del usuario',
                err.toString(),
                'error'
              );
            },
          });
        }
      } else {
        Swal.fire('Los cambios no se guardaron', '', 'info');
      }
    });
  }
  checkForLockeds() {
    this.lockeds['name'] = this.user.name === '';
    this.lockeds['email'] = this.user.email === '';
    this.lockeds['password'] =
      this.user.password === '' && this.user._id === '';
    this.lockeds['lastPassword'] = this.user.lastPassword === '';
  }
  getGeneralRoleOptions(): IOptionDropdown[] {
    const generalOptions: IOptionDropdown[] = [
      {
        type: 'menuitem',
        option: 'asistente',
        click: 'generalRole=asistente',
      },
    ];
    if (this.user.roleType === 'premium' || this.user.roleType === 'special') {
      generalOptions.push({
        type: 'menuitem',
        option: 'operador',
        click: 'generalRole=operador',
      });
      generalOptions.push({
        type: 'menuitem',
        option: 'administrador',
        click: 'generalRole=administrador',
      });
      generalOptions.push({
        type: 'menuitem',
        option: 'técnico',
        click: 'generalRole=técnico',
      });
    }
    return generalOptions;
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
  changeChangers(changer: string) {
    if (!this.isEdit) return;
    if (this.changers.includes(changer)) {
      let index = this.changers.indexOf(changer);
      this.changers.splice(index, 1);
    } else {
      this.changers.push(changer);
    }
  }
  clickedDropdown(event: IOptionDropdown) {
    switch (true) {
      case event.click.includes('roleType'):
        this.user.roleType =
          (event.click.split('=')[1] as 'basic' | 'premium' | 'special') ||
          'basic';
        if (this.user.roleType === 'basic') {
          this.user.generalRole = 'asistente';
        }
        this.generalRoleOptions = this.getGeneralRoleOptions();
        break;
      case event.click.includes('generalRole'):
        this.user.generalRole =
          (event.click.split('=')[1] as
            | 'asistente'
            | 'operador'
            | 'administrador'
            | 'técnico') || 'asistente';
        break;
      default:
        break;
    }
  }
  clickedButton(event: string) {
    switch (event) {
      case 'edit':
        this.isEdit = true;
        this.showOptions = false;
        break;
      case 'photos':
        break;
      case 'score':
        break;
      default:
        break;
    }
  }
  getHTML(type: string): string {
    return this._sharedService.getHTML(type);
  }
  returnToPreviousPage() {
    this.location.back();
  }
  checkRole(
    roleType: 'basic' | 'premium' | 'special',
    generalRole: 'asistente' | 'operador' | 'administrador' | 'técnico',
    role2Check:
      | 'basic'
      | 'premium'
      | 'special'
      | 'asistente'
      | 'operador'
      | 'administrador'
      | 'técnico'
  ) {
    return this._sharedService.checkRole(roleType, generalRole, role2Check);
  }
  cssCreate() {
    this._sharedService.cssCreate();
  }
}
