import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomModalPage } from './custom-modal.page';

describe('CustomModalPage', () => {
  let component: CustomModalPage;
  let fixture: ComponentFixture<CustomModalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CustomModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
