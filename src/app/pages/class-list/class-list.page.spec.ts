import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClassListPage } from './class-list.page';

describe('ClassListPage', () => {
  let component: ClassListPage;
  let fixture: ComponentFixture<ClassListPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ClassListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
