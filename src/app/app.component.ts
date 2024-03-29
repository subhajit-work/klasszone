import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { App } from '@capacitor/app';
import { AlertController, MenuController, Platform } from '@ionic/angular';
import { Observable, Subscription, take } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CommonUtils } from './services/common-utils/common-utils';
import { AuthService } from './services/auth/auth.service';
import { Storage } from '@ionic/storage';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  // server api
  api_url = environment.apiUrl;
  file_url = environment.fileUrl;
  
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

  private mainMenuDataSubscribe: Subscription | undefined;
  mainMenuLoadData:any;
  mainMenu_url:any;
  mainMenuAllData:any;
  
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
      if (this.router.url === '/welcome' || this.router.url === '/home' || this.router.url === '/auth') {
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

  initializeApp() {
    this.mainMenu_url = 'main_menu';
    this.mainMenuData();
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

  /* --------Department start-------- */
  mainMenuData(){
    this.mainMenuLoadData = true;
    this.mainMenuDataSubscribe = this.http.get(this.mainMenu_url).subscribe(
      (res:any) => {
        this.mainMenuLoadData = false;
        this.mainMenuAllData = res.return_data;

        console.log('this.mainMenuAllData>>', this.mainMenuAllData);
      },
      errRes => {
        this.mainMenuLoadData = false;
      }
    );
  }
  /* Department end */
}
