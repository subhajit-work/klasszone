import { Component, OnInit } from '@angular/core';
import { AlertController, MenuController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CommonUtils } from 'src/app/services/common-utils/common-utils';

@Component({
  selector: 'common-footer',
  templateUrl: './common-footer.component.html',
  styleUrls: ['./common-footer.component.scss'],
})
export class CommonFooterComponent  implements OnInit {
  private userInfoDataSubscribe: Subscription | undefined;
  userDetails:any;
  userType:any;

  constructor(
    public menuCtrl: MenuController,
    private navCtrl : NavController,
    private commonUtils : CommonUtils,
    private alertController : AlertController,
    private authService : AuthService,
  ) { }

  ngOnInit() {
    this.menuCtrl.getMenus().then((menu) => {
      menu[0].disabled = false;
    })
    this.userType = localStorage.getItem('user_type');
    console.log('userType', this.userType)
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

  /* logout functionlity start */
  async logOutUser(){
    const alert = await this.alertController.create({
      header: 'Log Out',
      message: 'Are you sure you want to Log Out?',
      cssClass: 'custom-alert',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'cancelBtn',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Okay',
          handler: () => {
            console.log('Confirm Okay');
            
            this.authService.logout();
          }
        }
      ]
    });
    await alert.present(); 
  }
  /* logout functionlity end */

}
