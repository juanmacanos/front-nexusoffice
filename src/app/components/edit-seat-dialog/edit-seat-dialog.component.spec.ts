import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSeatDialogComponent } from './edit-seat-dialog.component';

describe('EditSeatDialogComponent', () => {
  let component: EditSeatDialogComponent;
  let fixture: ComponentFixture<EditSeatDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditSeatDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditSeatDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
