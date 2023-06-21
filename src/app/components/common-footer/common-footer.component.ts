import { Component, OnInit } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';

@Component({
  selector: 'common-footer',
  templateUrl: './common-footer.component.html',
  styleUrls: ['./common-footer.component.scss'],
})
export class CommonFooterComponent  implements OnInit {

  constructor(
    public menuCtrl: MenuController,
    private navCtrl : NavController,
  ) { }

  ngOnInit() {}

  openMenu() {
    console.log('Clicked');
    // this.menuCtrl.enable(false);
    this.menuCtrl.toggle();
  }

  // goto page
  goToPage(_url:any){
    console.log('goToPage _url >', _url);

    this.navCtrl.navigateRoot(_url);
  }

}
