import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BigBlueButtonPage } from './big-blue-button.page';

describe('BigBlueButtonPage', () => {
  let component: BigBlueButtonPage;
  let fixture: ComponentFixture<BigBlueButtonPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(BigBlueButtonPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
