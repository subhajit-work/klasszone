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

  studentMenuData = [
    {
      name: 'Student Dashboard',
      url: 'dashboard',
      icon: 'speed'
    },
    {
      name: 'My Enrolled Classes',
      url: 'enrolement',
      icon: 'school',
      subPages : [
        {
          name: 'All',
          url: 'all-enrolement-classes',
          icon: 'send',
        },
        {
          name: 'Approved',
          url: 'approved-enrolement-classes',
          icon: 'send',
        },
        {
          name: 'Session Initiated',
          url: 'session-initiated-enrolement-classes',
          icon: 'send',
        },
        {
          name: 'Completed',
          url: 'completed-enrolement-classes',
          icon: 'send',
        },
        {
          name: 'Cancelled ',
          url: 'cancelled-enrolement-classes',
          icon: 'send',
        },
        {
          name: 'Claim For Admin Intervention ',
          url: 'intervention-enrolement-classes',
          icon: 'send',
        },
        {
          name: 'Closed',
          url: 'closed-enrolement-classes',
          icon: 'send',
        },
        {
          name: 'Expired',
          url: 'expired-enrolement-classes',
          icon: 'send',
        }
      ],
    },
    {
      name: 'Event Enrollment',
      url: 'event-enrollment',
      icon: 'celebration',
      subPages : [
        {
          name: 'All Enrollments',
          url: 'all-enrolement',
          icon: 'send',
        },
        {
          name: 'Upcoming Enrollments',
          url: 'upcoming-enrollments',
          icon: 'send',
        },
        {
          name: 'Completed/Expired Events',
          url: 'completed-expired-events',
          icon: 'send',
        }
      ],
    },
    {
      name: 'Buy KlassCoins',
      url: 'buy-enquiriesEdits',
      icon: 'toll',
      subPages : [
        {
          name: 'KlassCoins Packages',
          url: 'enquiriesEdits-packages',
          icon: 'send',
        },
        {
          name: 'Order History',
          url: 'order-history',
          icon: 'send',
        }
      ],
    },
    {
      name: 'KlassCoins History',
      url: 'enquiriesEdits-history',
      icon: 'history'
    },
    {
      name: 'Rewards Points',
      url: 'rewards-points',
      icon: 'emoji_events'
    },
    {
      name: 'Redeem Rewards',
      url: 'redeem-rewards',
      icon: 'redeem'
    },
    {
      name: 'Refer and Earn',
      url: 'refer-earn',
      icon: 'share'
    },
    {
      name: 'Student Information',
      url: 'student-information',
      icon: 'person',
      subPages : [
        {
          name: 'Personal Information',
          url: 'personal-information',
          icon: 'send',
        },
        {
          name: 'Profile Information',
          url: 'profile-information',
          icon: 'send',
        },
        {
          name: 'Change Password',
          url: 'change-password',
          icon: 'send',
        }
      ],
    },
  ];

  private userDetailsSubscribe: Subscription | undefined;
  userData:any;
  model: any = {};

  private enquiriesEditDataSubscribe: Subscription | undefined;
  enquiriesEdit_url:any;
  enquiriesEditData:any;

  private formSubmitSubscribe: Subscription | undefined;
  form_submit_text = 'Save';
  form_api: any;

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

    this.userInfoData();

    this.form_api = 'enquiries_edit/'+this.parms_id;
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
          
          this.enquiriesEdit_url = 'enquiries_edit/'+this.parms_id+'?user_id='+this.userData.user_data.id;
          this.getBookingView();
          
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