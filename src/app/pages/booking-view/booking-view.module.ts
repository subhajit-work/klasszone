import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BookingViewPageRoutingModule } from './booking-view-routing.module';

import { BookingViewPage } from './booking-view.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    BookingViewPageRoutingModule
  ],
  declarations: [BookingViewPage]
})
export class BookingViewPageModule {}
