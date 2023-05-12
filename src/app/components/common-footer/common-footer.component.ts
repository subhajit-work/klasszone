import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'common-footer',
  templateUrl: './common-footer.component.html',
  styleUrls: ['./common-footer.component.scss'],
})
export class CommonFooterComponent  implements OnInit {

  constructor(
    public menuCtrl: MenuController,
  ) { }

  ngOnInit() {}

  openMenu() {
    console.log('Clicked');
    // this.menuCtrl.enable(false);
    this.menuCtrl.toggle();
  }

}
