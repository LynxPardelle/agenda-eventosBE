import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialCellComponent } from './special-cell.component';

describe('SpecialCellComponent', () => {
  let component: SpecialCellComponent;
  let fixture: ComponentFixture<SpecialCellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpecialCellComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpecialCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
