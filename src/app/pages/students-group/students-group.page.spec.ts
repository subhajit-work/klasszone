import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StudentsGroupPage } from './students-group.page';

describe('StudentsGroupPage', () => {
  let component: StudentsGroupPage;
  let fixture: ComponentFixture<StudentsGroupPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(StudentsGroupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
