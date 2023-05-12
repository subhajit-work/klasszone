import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonFooterComponent } from '../components/common-footer/common-footer.component';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [
    CommonFooterComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    CommonFooterComponent
  ]
})
export class SharedModule { }
