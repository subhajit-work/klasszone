import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-teacher-list',
  templateUrl: './teacher-list.page.html',
  styleUrls: ['./teacher-list.page.scss'],
})

export class TeacherListPage implements OnInit {
  model: any = {}

  constructor(
    private menuCtrl: MenuController,
  ) { }

  ngOnInit() {
  }

  onSubmitFilter(form: NgForm){

  }
  menuOpen = false;
  openFilterMenu() {
    console.log('filter menu');
    if (this.menuOpen) {
      this.menuCtrl.close('filterMenu');
      this.menuOpen = false;
    }else {
      this.menuCtrl.open('filterMenu');
      this.menuOpen = true;
    }
    
  }

}