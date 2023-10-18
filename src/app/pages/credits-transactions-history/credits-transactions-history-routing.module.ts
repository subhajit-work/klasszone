import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreditsTransactionsHistoryPage } from './credits-transactions-history.page';

const routes: Routes = [
  {
    path: '',
    component: CreditsTransactionsHistoryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreditsTransactionsHistoryPageRoutingModule {}
