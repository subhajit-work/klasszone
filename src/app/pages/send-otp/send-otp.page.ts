import { Component, OnInit, ViewChild } from '@angular/core';
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
  selector: 'app-send-otp',
  templateUrl: './send-otp.page.html',
  styleUrls: ['./send-otp.page.scss'],
})

export class SendOtpPage implements OnInit {

  isLoading = false;
  userInfoLoading: any;

  isLogin = true;
  userTypes: any;
  model: any = {};
  otp: any;
  showOtpComponent = true;
  @ViewChild('ngOtpInput', { static: false}) ngOtpInput: any;

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
  form_submit_text = 'Register';
  form_api: any;
  parms_action_name: any;
  parms_action_id: any;

  config = {
    allowNumbersOnly: false,
    length: 4,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
    inputStyles: {
      'width': '50px',
      'height': '50px'
    }
  };
  onOtpChange(otp:any) {
    this.otp = otp;
  }

  ngOnInit() {
    // menu hide
    this.menuCtrl.enable(false);

    console.log('registerData',localStorage.getItem('registerData'));
    
    this.registrationData = JSON.parse(localStorage.getItem('registerData') || '{}');
    console.log('registrationData', this.registrationData);
    
    console.log('center_id',this.registrationData.center_id);
    

    this.authService.globalparamsData.subscribe(res => {
      console.log('auth res >>>>>>>>', res);
      if (res && res != null && res != undefined && res != '') {
        // if(res.token != undefined ){
        //   this.router.navigateByUrl('/dashboard');
        // }
      }
    });

    if (this.parms_action_name == 'edit') {
      // form submit api edit
      this.form_api = 'student/signup/' + this.parms_action_id;

      console.log('edit data<><><><>', this.form_api);
    } else {
      // form submit api add
      this.form_api = 'student/signup?master=1';
      console.log('edit data@@@@@@@@@@@@', this.form_api);
    }
  }

  registrationData:any;
  ionViewWillEnter() {
    
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


  onSwitchAuthMode() {
    this.isLogin = !this.isLogin;
  }
  // get login type start
  segmentValue: any;
  segmentChanged(e: any) {
    this.segmentValue = e.detail.value;
    console.log('segmentValue', this.segmentValue);
  }
  // get login type end

  // ======================== form submit start ===================
  onSubmit(form: NgForm) {

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

    this.formSubmitSubscribe = this.http.post("registration", fd).subscribe(
      (response: any) => {
        if (response.return_status > 0) {
          localStorage.removeItem('registerData');
          this.registrationData = {};
          form.reset();
          this.router.navigateByUrl('/auth');
          this.commonUtils.presentToast('success', response.return_message);
        }else {
          this.commonUtils.presentToast('error', response.return_message);
        }

      },
      errRes => {
      }
    );

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

  /* Resend otp start */
  resendOTP(){
    let fd = new FormData();
    fd.append('action', 'generate');
    fd.append('center_id', this.registrationData.center_id);
    fd.append('first_name', this.registrationData.first_name);
    fd.append('last_name', this.registrationData.last_name);
    fd.append('identity', this.registrationData.identity);
    fd.append('password', this.registrationData.password);
    fd.append('confirm_password', this.registrationData.confirm_password);
    fd.append('referral_code', this.registrationData.referral_code);
    fd.append('phone_code', this.registrationData.phone_code);
    fd.append('mobile', this.registrationData.mobile);

    this.formSubmitSubscribe = this.http.post("otp", fd).subscribe(
      (response: any) => {
        if (response.return_status > 0) {
          this.commonUtils.presentToast('success', response.return_message);
        }else {
          this.commonUtils.presentToast('error', response.return_message);
        }

      },
      errRes => {
      }
    );
  }
  /* Resend otp end */

  // ----------- destroy subscription start ---------
  ngOnDestroy() {
    if (this.formSubmitSubscribe !== undefined) {
      this.formSubmitSubscribe.unsubscribe();
    }
  }
  // destroy subscription end


}