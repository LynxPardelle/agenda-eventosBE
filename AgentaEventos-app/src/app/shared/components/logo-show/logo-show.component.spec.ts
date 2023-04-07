import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogoShowComponent } from './logo-show.component';

describe('LogoShowComponent', () => {
  let component: LogoShowComponent;
  let fixture: ComponentFixture<LogoShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LogoShowComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogoShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
