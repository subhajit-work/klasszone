import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, AlertController, ToastController, MenuController } from '@ionic/angular';

import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Observable, from } from 'rxjs';
import { take } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CommonUtils } from 'src/app/services/common-utils/common-utils';
import { AppComponent } from 'src/app/app.component';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})

export class RegisterPage implements OnInit {

  isLoading = false;
  userInfoLoading: any;

  isLogin = true;
  userTypes: any;
  model: any = {};
  form_api: any;
  isIndian = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingController: LoadingController,
    private alertCtrl: AlertController,
    public menuCtrl: MenuController,
    private commonUtils: CommonUtils,
    private http: HttpClient,
    private storage: Storage,
    private appComponent: AppComponent
  ) { }

  /*Variable Names*/
  private formSubmitSubscribe: Subscription | undefined;
  private getCountryCodeSubscribe: Subscription | undefined;
  form_submit_text = 'Send OTP';
  parms_action_name: any;
  parms_action_id: any;
  countryCodeUrl: any;
  OTPaction = 'generate';
  registrationData:any;

  ngOnInit() {
    // menu hide
    this.menuCtrl.enable(false);

    this.authService.globalparamsData.subscribe(res => {
      console.log('auth res >>>>>>>>', res);
      if (res && res != null && res != undefined && res != '') {
        // if(res.token != undefined ){
        //   this.router.navigateByUrl('/dashboard');
        // }
      }
    });

    this.countryCodeUrl = 'country_code';
    this.getCountryCode();
    this.model.phone_code = '98_91';
    this.form_api = 'otp';
    console.log('call1');
    
  }

  ionViewWillEnter() {
    console.log('call2');
    this.registrationData = JSON.parse(localStorage.getItem('registerData') || '{}');
    console.log('registrationData', this.registrationData);
    if (this.registrationData) {
      this.segmentValue = this.registrationData.center_id;
      this.OTPaction = this.registrationData.action;
      this.model = {
        first_name: this.registrationData.first_name,
        last_name:this.registrationData.last_name,
        identity:this.registrationData.identity,
        password:this.registrationData.password,
        confirm_password:this.registrationData.confirm_password,
        referral_code: this.registrationData.referral_code,
        phone_code:this.registrationData.phone_code,
        mobile: this.registrationData.mobile
      }
    }
    // this.appComponent.userInfoData();

    // menu hide
    this.menuCtrl.enable(false);

    this.authService.globalparamsData.subscribe(res => {
      if (res && res != null && res != undefined && res != '') {
        // if(res.token != undefined ){
        //   this.router.navigateByUrl('/dashboard');
        // }
      }
    });
  }

  // get login type start
  segmentValue: any;
  segmentChanged(e: any) {
    this.segmentValue = e.detail.value;
    console.log('segmentValue', this.segmentValue);
  }
  // get login type end

  // get country code start
  countryCodeData: any;
  getCountryCode() {
    this.getCountryCodeSubscribe = this.http.get(this.countryCodeUrl).subscribe(
      (res: any) => {
        this.countryCodeData = res.return_data;

        console.log('this.countryCodeData', this.countryCodeData);

      },
      errRes => {
      }
    );
  }
  // get country code end

  /*changePhoneCode start */
  changePhoneCode(_event:any){
    console.log('_event', _event);
    if (_event.detail.value == '98_91') {
      this.isIndian = true;
      this.form_api = 'otp';
      this.form_submit_text = 'Send OTP';
    }else {
      this.isIndian = false;
      this.form_api = 'registration';
      this.form_submit_text = 'Create an account';
    }
  }
  /*changePhoneCode end */

  // ======================== form submit start ===================

  onSubmit(form: NgForm) {
    console.log("add form submit >", form.value);
    if (form.value.password == form.value.confirm_password) {
      localStorage.removeItem('registerData');
      localStorage.setItem('registerData', JSON.stringify({
        'center_id': form.value.center_id,
        'first_name': form.value.first_name,
        'last_name': form.value.last_name,
        'identity': form.value.identity,
        'password': form.value.password,
        'confirm_password': form.value.confirm_password,
        'mobile': form.value.mobile,
        'phone_code': form.value.phone_code,
        'referral_code': form.value.referral_code,
        'action': form.value.action,
      }));

      console.log('registerData',localStorage.getItem('registerData'));

      this.form_submit_text = 'Please wait...';

      // get form value
      let fd = new FormData();

      for (let val in form.value) {
        if (form.value[val] == undefined) {
          form.value[val] = '';
        }
        fd.append(val, form.value[val]);
      };

      console.log('value >', fd);

      if (!form.valid) {
        return;
      }

      this.formSubmitSubscribe = this.http.post(this.form_api, fd).subscribe(
        (response: any) => {

          console.log("add form response >", response);
          if (response.return_status > 0) {
            if (this.isIndian) {
              this.router.navigateByUrl('/send-otp');
              this.form_submit_text = 'Send OTP';
            }else {
              this.form_submit_text = 'Create an account';
              this.router.navigateByUrl('/auth');
            }
            
            this.commonUtils.presentToast('success', response.return_message);
            form.reset();
          }else {
            this.commonUtils.presentToast('error', response.return_message);
          }
          
        },
        errRes => {
        }
      );
    }else {
      this.commonUtils.presentToast('info', 'Password & Confirm Password not match')
    }
    

  }
  // form submit end

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
    if (this.formSubmitSubscribe !== undefined) {
      this.formSubmitSubscribe.unsubscribe();
    }
    if (this.getCountryCodeSubscribe !== undefined) {
      this.getCountryCodeSubscribe.unsubscribe();
    }
  }
  // destroy subscription end


}