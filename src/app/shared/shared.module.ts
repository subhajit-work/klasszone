import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonFooterComponent } from '../components/common-footer/common-footer.component';
import { IonicModule } from '@ionic/angular';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import {MatDividerModule} from '@angular/material/divider';
import { SafeHtmlPipe } from '../pipe/safe-html.pipe';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatNativeDateModule} from '@angular/material/core';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatTabsModule} from '@angular/material/tabs';
import {MatBadgeModule} from '@angular/material/badge';
import { Ionic4DatepickerModule } from '@logisticinfotech/ionic4-datepicker';
import { StringReplacePipe } from '../pipe/string-replace.pipe';
import { RatingComponent } from '../components/rating/rating.component';
import { SafePipe } from '../pipe/safe-pipe.pipe';
import { AngularEditorModule } from '@kolkov/angular-editor';

@NgModule({
  declarations: [
    CommonFooterComponent,
    SafeHtmlPipe,
    SafePipe,
    StringReplacePipe,
    RatingComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatDividerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    MatSidenavModule,
    MatListModule,
    MatTabsModule,
    MatBadgeModule,
    Ionic4DatepickerModule,
    AngularEditorModule 
  ],
  exports: [
    CommonFooterComponent,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatDividerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    MatSidenavModule,
    MatListModule,
    MatTabsModule,
    SafeHtmlPipe,
    SafePipe,
    StringReplacePipe,
    RatingComponent,
    MatBadgeModule,
    Ionic4DatepickerModule,
    AngularEditorModule 
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule { }
