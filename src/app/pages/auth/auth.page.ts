// import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController, MenuController, ModalController } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { AppComponent } from 'src/app/app.component';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CommonUtils } from 'src/app/services/common-utils/common-utils';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  main_url = environment.apiUrl;
  file_url = environment.fileUrl;

  isLoading = false;
  siteInfo:any;
  isLogin = true;
  userTypes:any;
  private formSubmitSubscribe: Subscription | undefined;
  btnloader:any;
  message: any;
  model:any = {};
  
  constructor(
    public menuCtrl: MenuController,
    private authService:AuthService,
    private router:Router,
    private loadingController: LoadingController,
    private http : HttpClient,
    private alertCtrl: AlertController,
    private commonUtils: CommonUtils,
    private modalController : ModalController,
    private appComponent: AppComponent,
    // public datepipe: DatePipe
  ) { }

  ngOnInit() {
    this.formSubmitSubscribe =  this.authService.globalparamsData.subscribe(res => {
      // console.log('authService',res);
      
      if(res && res != null && res != undefined && res != ''){
        // if(res.token != undefined ){
        //   this.router.navigateByUrl('/dashboard');
        // }
      }
    });

    // get Site Info
    this.formSubmitSubscribe = this.commonUtils.getSiteInfoObservable.subscribe(res =>{
      this.siteInfo = res;
    })
  }
 
  ionViewWillEnter() {

    this.menuCtrl.enable(false);
    
    // get Site Info
    this.formSubmitSubscribe = this.commonUtils.getSiteInfoObservable.subscribe(res =>{
      this.siteInfo = res;
    })

    // menu hide
    this.menuCtrl.enable(false);

    this.formSubmitSubscribe =  this.authService.globalparamsData.subscribe(res => {
      if(res && res != null && res != undefined && res != ''){
        // if(res.token != undefined ){
        //   this.router.navigateByUrl('/dashboard');
        // }
      }
    });

  }


  onSwitchAuthMode(){
    this.isLogin =! this.isLogin;
  }

  //---------------- login form submit start-----------------
    onSubmitForm(form:NgForm){
      this.isLoading = true;
      // console.log('form >>', form.value);
      if(!form.valid){
        return;
      }
      const email = form.value.email;
      const password = form.value.password;

      if(this.isLogin){
        // login server data send
      }else{
        // signup server data send
      }

      this.authenticate(form, form.value);
      // form.reset();

    }

    // authenticate function
    authenticate(_form:any, form_data:any) {
      this.btnloader = true;
      this.loadingController
        .create({ keyboardClose: true, message: 'Logging in...' })
        .then(loadingEl => {
          loadingEl.present();
          let authObs: Observable<any>;
          
          
          if (this.isLogin) {
            authObs = this.authService.login('login', form_data, '');
            
            this.formSubmitSubscribe = authObs.subscribe(
              resData => {
                // console.log('resData =============))))))))))))))>', resData);
                this.btnloader = false;
                  this.router.navigateByUrl('/home')
                  // .then(() => {
                  //   window.location.reload();
                  // });
                  setTimeout(() => {
                    // this.commonUtils.presentToast('success', resData.message);
                  }, 500);
                  
                  setTimeout(() => {
                    _form.reset();
                    loadingEl.dismiss();
  
                  }, 2000);
                  
                  
                  loadingEl.dismiss();
                  // this.commonUtils.presentToast('error', resData.message);
                
                // // console.log("data login after resData ++++++>", resData);
                this.btnloader = false;
                // loadingEl.dismiss();
                // this.router.navigateByUrl('/places/tabs/discover');
              },
              errRes => {
                // console.log("errRes",errRes);
                this.btnloader = false;
                loadingEl.dismiss();
                // this.commonUtils.presentToast('error', errRes.error.message);
                this.message = errRes.error.message;
                // setTimeout(() => {
                //   this.message = null;
                // }, 3000);
              }
            );
            
          }
        });
    }
  // login form submit end

    private showAlert(message: string) {
      this.alertCtrl
        .create({
          header: 'Authentication failed',
          message: message,
          buttons: ['Okay']
        })
        .then(alertEl => alertEl.present());
    }
  // ----------- destroy subscription start ---------
  ngOnDestroy() {
    if(this.formSubmitSubscribe !== undefined){
      this.formSubmitSubscribe.unsubscribe();
    }
  }
  // destroy subscription end

}
