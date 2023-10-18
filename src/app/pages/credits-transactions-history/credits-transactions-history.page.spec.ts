import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreditsTransactionsHistoryPage } from './credits-transactions-history.page';

describe('CreditsTransactionsHistoryPage', () => {
  let component: CreditsTransactionsHistoryPage;
  let fixture: ComponentFixture<CreditsTransactionsHistoryPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CreditsTransactionsHistoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
