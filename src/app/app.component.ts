import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { App } from '@capacitor/app';
import { AlertController, Platform } from '@ionic/angular';
import { take } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CommonUtils } from './services/common-utils/common-utils';
import { AuthService } from './services/auth/auth.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Inbox', url: '/folder/inbox', icon: 'mail' },
    { title: 'Outbox', url: '/folder/outbox', icon: 'paper-plane' },
    { title: 'Favorites', url: '/folder/favorites', icon: 'heart' },
    { title: 'Archived', url: '/folder/archived', icon: 'archive' },
    { title: 'Trash', url: '/folder/trash', icon: 'trash' },
    { title: 'Spam', url: '/folder/spam', icon: 'warning' },
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];

  checkAuthentication:any;
  userInfoLoading:any;
  menuPages = [];
  userInfoDataall:any;

  
  constructor(
    private platform: Platform,
    private router : Router,
    private alertController : AlertController,
    private authService : AuthService,
    private http: HttpClient,
    private commonUtils: CommonUtils
  ) {
    this.backButtonEvent();
  }

  // back button start
  backButtonEvent() {
    this.platform.backButton.subscribeWithPriority(-1, () => {
      if (this.router.url === '/welcome') {
        this.presentAlertConfirm();
      }
    });
  }

  // exit app aleart start
  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'Exit App',
      message: 'Are you sure you want to exit the app?',
      cssClass: 'custom-alert',
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'cancelBtn',
        handler: (blah) => {}
      }, {
        text: 'Close App',
        handler: () => {
          App.exitApp();
        }
      }]
    });
  
    await alert.present();
  }

  // login check
  loginCheck(){
    this.authService.autoLogin().pipe(
      take(1)
    ).subscribe(resData => {
      console.log('resData +++++++++++++++++++++++++++++++=&&&&&& (autoLogin)>', resData);
      if(resData){
        this.checkAuthentication = true;
        this.userInfoData();
        // console.log('User have Login');
      }else{
        this.checkAuthentication = false;
        // console.log('user have NOT Login');
      }
    });
  }

  // user info
  userInfoData(){
    // this.authService.globalparamsData.pipe(
    //   take(1)
    // ).subscribe(res => {
    //   console.log('componet.ts Toke store >>>>>>>>>>>>>>>111', res);
    console.log('Ready________updateAlertConfirm()___');
      // if(res){
        this.userInfoLoading = true;

        // menu data array
        this.menuPages = [];

        this.http.get('common_details.php').subscribe(
          (res:any) => {
            this.userInfoLoading = false;
            console.log("view data  userinfo  res -------------------->", res.return_data);
            if(res.return_status > 0){
              this.userInfoDataall = res.return_data;

              

              // update observable service data
              this.commonUtils.getUserInfoService(res.return_data);

              // console.log('menu_data',res.return_data.menu_data);
              // this.menuPages = res.return_data.menu_data.list;


              // menu data show array
              if(res.return_data.menu_data){

                this.menuPages = res.return_data.menu_data;

                console.log('Menu data >>>', this.menuPages);
                
              }

            }
          },
          errRes => {
            this.userInfoLoading = false;
          }
        );
      // }

    // });
  }

  // logout functionlity
  logoutLoading:any;
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
            // this.authService.logout();
            this.logoutLoading = true;
            //logout data call

            this.authService.globalparamsData.pipe(
              take(1)
            ).subscribe(res => {
            console.log('componet.ts Toke store 2222 >>>>>>>>>>>>>>>111', res);
            this.http.get('login_register.php?action=logout').subscribe(
              (res:any) => {
                this.logoutLoading = false;
                console.log("Edit data  res >", res.return_data);
                if(res.return_status > 0){
                  this.authService.logout();

                  // user menu call
                  // this.appComponent.userInfoData();

                }
              },
              errRes => {
                this.logoutLoading = false;
              }
            );
            });
          }
        }
      ]
    });
    await alert.present(); 
  }
}
