import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BookingEditPageRoutingModule } from './booking-edit-routing.module';

import { BookingEditPage } from './booking-edit.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    BookingEditPageRoutingModule
  ],
  declarations: [BookingEditPage]
})
export class BookingEditPageModule {}
