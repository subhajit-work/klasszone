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
  model: any = {}

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
  form_submit_text = 'Register';
  form_api: any;
  parms_action_name: any;
  parms_action_id: any;
  countryCodeUrl: any;

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

  // ======================== form submit start ===================
  clickButtonTypeCheck = '';
  form_submit_text_save = 'Register';
  form_submit_text_save_another = 'Save & Add Another';

  // click button type 
  clickButtonType(_buttonType: any) {
    this.clickButtonTypeCheck = _buttonType;
  }

  onSubmit(form: NgForm) {
    console.log("add form submit >", form.value);

    if (this.clickButtonTypeCheck == 'Register') {
      this.form_submit_text_save = 'Please wait';
    } else {
      this.form_submit_text_save_another = 'Please wait';
    }

    this.form_submit_text = 'Please wait';

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

    this.formSubmitSubscribe = this.http.post("student/signup?master=1", fd).subscribe(
      (response: any) => {

        if (this.clickButtonTypeCheck == 'Register') {
          this.form_submit_text_save = 'Register';
        } else {
          this.form_submit_text_save_another = 'Save & Add Another';
        }

        // this.authService.getTokenSessionMaster();

        console.log("add form response >", response);

        if (response.return_status > 0) {

          this.form_submit_text = 'Register';

          this.router.navigateByUrl(`verification-email/${response.return_data.user_id}`);

          // user details set
          if (response.return_data.user) {
            this.commonUtils.onClicksigninCheck(response.return_data.user);
          }
          // this.commonUtils.presentToast(response.return_message);
          this.commonUtils.presentToast('success', response.return_message);

          if (this.clickButtonTypeCheck == 'Register') {

            // this.router.navigate(['/student-list']);

          }

          // this.notifier.notify( type, 'aa' );

          if (this.parms_action_name == 'add') {
            // form.reset();
            this.model = {};
            this.model = {
              enable: 'true',
              sms: 'true',
              emailcheck: 'true'
            };
          }

        } else {
          this.form_submit_text = 'Register';
        }
      },
      errRes => {
        if (this.clickButtonTypeCheck == 'Register') {
          this.form_submit_text_save = 'Register';
        } else {
          this.form_submit_text_save_another = 'Save & Add Another';
        }
        this.form_submit_text = 'Register';
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