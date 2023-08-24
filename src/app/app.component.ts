import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { App } from '@capacitor/app';
import { AlertController, MenuController, Platform } from '@ionic/angular';
import { Observable, Subscription, take } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CommonUtils } from './services/common-utils/common-utils';
import { AuthService } from './services/auth/auth.service';
import { Storage } from '@ionic/storage';

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
  userDetailsApi:any;
  private userDetailsSubscribe: Subscription | undefined;

  private departmentDataSubscribe: Subscription | undefined;
  departmentLoadData:any;
  department_url:any;
  departmentAllData:any;
  
  constructor(
    private platform: Platform,
    private router : Router,
    private alertController : AlertController,
    private authService : AuthService,
    private http: HttpClient,
    private commonUtils: CommonUtils,
    private storage: Storage,
    private menuCtrl: MenuController,
  ) {
    this.backButtonEvent();
    this.initializeApp();
    this.loginCheck();
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

  subMenuClick(){
    this.menuCtrl.enable(false);
  }

  initializeApp() {
    this.department_url = 'fetch_categories';
    this.departmentData();
    this.platform.ready().then(() => {
      // this.loginCheck();
    });
  }

  // user info
  userInfoData(){
    let userObs: Observable<any>;
    userObs = this.authService.userDetails();

    this.userDetailsSubscribe = userObs.subscribe(
      resData => {
        console.log('userDetails', resData);
        if(resData.return_status > 0){
          this.userInfoDataall = resData.return_data;
          this.commonUtils.getUserInfoService(resData.return_data);
        }
        
      },
      errRes => {
      }
      );
  }

  /* --------Department start-------- */
  departmentData(){
    this.departmentLoadData = true;
    this.departmentDataSubscribe = this.http.get(this.department_url).subscribe(
      (res:any) => {
        this.departmentLoadData = false;
        this.departmentAllData = res.return_data;

        console.log('this.departmentAllData>>', this.departmentAllData);
      },
      errRes => {
        this.departmentLoadData = false;
      }
    );
  }
  /* Department end */

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
