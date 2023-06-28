import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AlertController, MenuController } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  private userDetailsSubscribe: Subscription | undefined;
  userData:any;

  constructor(
    private menuCtrl: MenuController,
    private http : HttpClient,
    private alertController : AlertController,
    private authService : AuthService,
  ) { }

  ngOnInit() {
    this.userInfoData();
  }

  openRightMenu() {
    console.log('right menu');
    
    this.menuCtrl.open('rightMenu');
  }

  /* User detasils get start */
  userInfoData(){
    let userObs: Observable<any>;
    userObs = this.authService.userDetails();

    this.userDetailsSubscribe = userObs.subscribe(
      resData => {
        console.log('userDetails@@', resData);
        if(resData.return_status > 0){
          this.userData = resData.return_data;
        }
        
      },
      errRes => {
      }
      );
  }
  /* User detasils get end */

  // logout functionlity
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

  // ----------- destroy subscription start ---------
  ngOnDestroy() {
    if(this.userDetailsSubscribe !== undefined){
      this.userDetailsSubscribe.unsubscribe();
    }
  }
  // destroy subscription end

}
