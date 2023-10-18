import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreditsTransactionsHistoryPageRoutingModule } from './credits-transactions-history-routing.module';

import { CreditsTransactionsHistoryPage } from './credits-transactions-history.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    CreditsTransactionsHistoryPageRoutingModule
  ],
  declarations: [CreditsTransactionsHistoryPage]
})
export class CreditsTransactionsHistoryPageModule {}
