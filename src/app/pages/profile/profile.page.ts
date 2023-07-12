import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, DatetimeChangeEventDetail, MenuController } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CommonUtils } from 'src/app/services/common-utils/common-utils';

interface DatetimeCustomEvent extends CustomEvent {
  detail: DatetimeChangeEventDetail;
  target: HTMLIonDatetimeElement;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  /*Variable Names*/
  private formSubmitSubscribe: Subscription | undefined;
  form_submit_text = 'Save';
  form_api: any;
  private userDetailsSubscribe: Subscription | undefined;
  userData:any;
  model: any = {};
  imageLoader = false;
  updateProfileImageApi:any;

  constructor(
    private menuCtrl: MenuController,
    private http : HttpClient,
    private alertController : AlertController,
    private authService : AuthService,
    private router: Router,
    private commonUtils: CommonUtils,
  ) { }

  ngOnInit() {
    this.updateProfileImageApi = 'student_profile_information_post/';
    this.form_api = 'student_profile_update/';
    this.userInfoData();
  }

  openRightMenu() {
    console.log('right menu');
    
    this.menuCtrl.open('rightMenu');
  }

  /* ========= datepicker start ======= */
  datePickerObj: any = {
    dateFormat: 'YYYY-MM-DD', // default DD MMM YYYY
    closeOnSelect: true,
    yearInAscending: true
  }
  /* datepicker end */

  /* User detasils get start */
  userInfoData(){
    let userObs: Observable<any>;
    userObs = this.authService.userDetails();

    this.userDetailsSubscribe = userObs.subscribe(
      resData => {
        console.log('userDetails@@', resData);
        if(resData.return_status > 0){
          this.userData = resData.return_data;

          this.model = {
            photo : resData.return_data.user_data.photo,
            first_name : resData.return_data.user_data.first_name,
            middle_name : resData.return_data.user_data.middle_name,
            last_name : resData.return_data.user_data.last_name,
            gender : resData.return_data.user_data.gender,
            dob : resData.return_data.user_data.dob,
          }
        }
        
      },
      errRes => {
      }
      );
  }
  /* User detasils get end */

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

  /* profile picture upload start */
  changeProfileImage(image:any) {
    var file = image.dataTransfer ? image.dataTransfer.files[0] : image.target.files[0];
    var pattern = /image-*/;
    var reader = new FileReader();
    if (!file.type.match(pattern)) {
      this.commonUtils.presentToast('error', 'Invalid file format');
      return;
    }
    else
      console.log('image', image);
    if (image.target.files[0] != undefined) {
      this.imageLoader = true;
      var fd = new FormData();
      fd.append("photo", image.target.files[0]);
      this.http.post(this.updateProfileImageApi+this.userData.user_data.id, fd).subscribe(
        (res: any) => {
          
        },
        (error) => {
          console.log("error", error);
          this.commonUtils.presentToast('error', error.message);
          this.imageLoader = false;
        })
    }
  }
  /* profile picture upload end */

  /* ======================== form submit start =================== */
  clickButtonTypeCheck = '';
  form_submit_text_save = 'Register';
  form_submit_text_save_another = 'Save & Add Another';

  // click button type 
  clickButtonType(_buttonType: any) {
    this.clickButtonTypeCheck = _buttonType;
  }

  onSubmit(form: NgForm) {
    console.log("add form submit >", form.value);

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

    this.formSubmitSubscribe = this.http.post(this.form_api+this.userData.user_data.id, fd).subscribe(
      (response: any) => {

        console.log("add form response >", response);
        if (response.return_status > 0) {
          this.commonUtils.presentToast('success', response.return_message);
          this.userInfoData();
        }else {
          this.commonUtils.presentToast('error', response.return_message);
        }
        
      },
      errRes => {
      }
    );

  }
  // form submit end

  // ----------- destroy subscription start ---------
  ngOnDestroy() {
    if(this.userDetailsSubscribe !== undefined){
      this.userDetailsSubscribe.unsubscribe();
    }
  }
  // destroy subscription end

}
