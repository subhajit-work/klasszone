import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookingViewPage } from './booking-view.page';

describe('BookingViewPage', () => {
  let component: BookingViewPage;
  let fixture: ComponentFixture<BookingViewPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(BookingViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
