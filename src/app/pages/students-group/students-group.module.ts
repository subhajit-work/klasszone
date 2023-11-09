import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StudentsGroupPageRoutingModule } from './students-group-routing.module';

import { StudentsGroupPage } from './students-group.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    StudentsGroupPageRoutingModule
  ],
  declarations: [StudentsGroupPage]
})
export class StudentsGroupPageModule {}
