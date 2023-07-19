import { Component, OnInit } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { CommonUtils } from 'src/app/services/common-utils/common-utils';

@Component({
  selector: 'common-footer',
  templateUrl: './common-footer.component.html',
  styleUrls: ['./common-footer.component.scss'],
})
export class CommonFooterComponent  implements OnInit {
  private userInfoDataSubscribe: Subscription | undefined;
  userDetails:any;

  constructor(
    public menuCtrl: MenuController,
    private navCtrl : NavController,
    private commonUtils : CommonUtils,
  ) { }

  ngOnInit() {
    this.userInfoDataSubscribe = this.commonUtils.userInfoDataObservable.subscribe((res:any) => {
      console.log(' =========== HEADER  userdata observable  >>>>>>>>>>>', res);
      if(res){
        this.userDetails = res;
      }else{
        this.userDetails = '';
      }
    });
  }

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
