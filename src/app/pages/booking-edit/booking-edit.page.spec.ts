import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookingEditPage } from './booking-edit.page';

describe('BookingEditPage', () => {
  let component: BookingEditPage;
  let fixture: ComponentFixture<BookingEditPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(BookingEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
