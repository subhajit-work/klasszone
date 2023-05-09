import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SendOtpPage } from './send-otp.page';

describe('SendOtpPage', () => {
  let component: SendOtpPage;
  let fixture: ComponentFixture<SendOtpPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(SendOtpPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
