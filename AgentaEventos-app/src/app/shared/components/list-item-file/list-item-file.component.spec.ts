import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListItemFileComponent } from './list-item-file.component';

describe('ListItemFileComponent', () => {
  let component: ListItemFileComponent;
  let fixture: ComponentFixture<ListItemFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListItemFileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListItemFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
