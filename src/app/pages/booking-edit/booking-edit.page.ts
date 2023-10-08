import { MediaMatcher } from '@angular/cdk/layout';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CommonUtils } from 'src/app/services/common-utils/common-utils';
import { environment } from 'src/environments/environment';
import {Location} from '@angular/common';
import profileMenuData from 'src/app/services/profilemenu.json';

@Component({
  selector: 'app-booking-edit',
  templateUrl: './booking-edit.page.html',
  styleUrls: ['./booking-edit.page.scss'],
})

export class BookingEditPage implements OnInit {
  api_url = environment.apiUrl;
  file_url = environment.fileUrl;

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  parms_status:any;
  parms_id:any;

  profileSideMenuData:any;

  private userDetailsSubscribe: Subscription | undefined;
  userData:any;
  model: any = {};

  private enquiriesEditDataSubscribe: Subscription | undefined;
  enquiriesEdit_url:any;
  enquiriesEditData:any;

  private formSubmitSubscribe: Subscription | undefined;
  form_submit_text = 'Save';
  form_api: any;

  userType:any;

  constructor(
    changeDetectorRef: ChangeDetectorRef, 
    media: MediaMatcher,
    private commonUtils: CommonUtils,
    private http : HttpClient,
    private activatedRoute : ActivatedRoute,
    private authService : AuthService,
    private _location: Location
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
   }

  ngOnInit() {
    // this.commonUtils.userInfoDataObservable.subscribe(res =>{
    //   console.log('userInfoDataObservable res>>>>>>>>>>>>>>>>>>>.. >', res);
    //   this.userData = res;
    // })
    this.parms_status = this.activatedRoute.snapshot.paramMap.get('status');
    this.parms_id = this.activatedRoute.snapshot.paramMap.get('id');
    console.log('parms_status', this.parms_status);
    console.log('parms_id', this.parms_id);

    this.userType = localStorage.getItem('user_type');

    if (this.userType == 'tutor') {
      this.profileSideMenuData = profileMenuData.tutorMenuData;
    }else {
      this.profileSideMenuData = profileMenuData.studentMenuData;
    }

    this.userInfoData();
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

          if (this.userType == 'student') {
            this.enquiriesEdit_url = 'enquiries_edit/'+this.parms_id+'?user_id='+this.userData.user_data.id;
            this.getBookingView();
            this.form_api = 'enquiries_edit/'+this.parms_id;
          }else {
            this.enquiriesEdit_url = 'enquiries_edit_by_tutor/'+this.parms_id+'?user_id='+this.userData.user_data.id;
            this.getBookingView();
            this.form_api = 'enquiries_edit_by_tutor/'+this.parms_id+'?user_id='+this.userData.user_data.id;
          }
        }
        
      },
      errRes => {
      }
      );
  }
  /* User detasils get end */

  /* getBookingView start */
  getBookingView(){
    this.enquiriesEditDataSubscribe = this.http.get(this.enquiriesEdit_url).subscribe(
      (res:any) => {
        this.enquiriesEditData = res.return_data;

        console.log('this.enquiriesEditData', this.enquiriesEditData);
      },
      errRes => {
      }
    );
  }
  /* getBookingView end */

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

    this.formSubmitSubscribe = this.http.post(this.form_api, fd).subscribe(
      (response: any) => {

        console.log("add form response >", response);
        if (response.return_status > 0) {
          form.reset();
          this.commonUtils.presentToast('success', response.return_message);
          this.userInfoData();
          if(this.clickButtonTypeCheck == 'save-back'){
            this.backClicked();
          }
        }else {
          this.commonUtils.presentToast('error', response.return_message);
        }
        
      },
      errRes => {
      }
    );

  }
  // form submit end

  // backClicked start
  backClicked() {
    this._location.back();
  }
  // backClicked end

  // ----------- destroy subscription start ---------
  ngOnDestroy() {
    if(this.userDetailsSubscribe !== undefined){
      this.userDetailsSubscribe.unsubscribe();
    }  
    if (this.enquiriesEditDataSubscribe !== undefined) {
      this.enquiriesEditDataSubscribe.unsubscribe();
    } 
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
  // destroy subscription end
}