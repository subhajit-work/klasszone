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
  selector: 'app-rating-tutor',
  templateUrl: './rating.page.html',
  styleUrls: ['./rating.page.scss'],
})

export class RatingPage implements OnInit {
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
      url: 'buy-ratings',
      icon: 'toll',
      subPages : [
        {
          name: 'KlassCoins Packages',
          url: 'ratings-packages',
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
      url: 'ratings-history',
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

  private ratingDataSubscribe: Subscription | undefined;
  rating_url:any;
  ratingData:any;

  private formSubmitSubscribe: Subscription | undefined;
  form_submit_text = 'Save';
  form_api: any;

  fetchItems = [];

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

    this.form_api = 'rate_tutor/'+this.parms_id;
  }

  //---- rating click function call  start ----
  ratingClicked: any;
  ratingComponentClick(clickObj: any): void {
    console.log('clickObj >>', clickObj);
    
    if (clickObj.itemId == 1) {
      this.model.self_confidence = clickObj.rating;
    }else if (clickObj.itemId == 2) {
      this.model.presentation_skills = clickObj.rating;
    }else if (clickObj.itemId == 3) {
      this.model.punctuality_regularity = clickObj.rating;
    }else if (clickObj.itemId == 4) {
      this.model.teaching_technique = clickObj.rating;
    }else if (clickObj.itemId == 5) {
      this.model.course_coverage = clickObj.rating;
    }else if (clickObj.itemId == 6) {
      this.model.focus_in_syllabus = clickObj.rating;
    }else if (clickObj.itemId == 7) {
      this.model.course_completeness = clickObj.rating;
    }else if (clickObj.itemId == 8) {
      this.model.innovative_method = clickObj.rating;
    }else if (clickObj.itemId == 9) {
      this.model.course_delivery = clickObj.rating;
    }else if (clickObj.itemId == 10) {
      this.model.helping_attitude = clickObj.rating;
    }else if (clickObj.itemId == 11) {
      this.model.communication_skills = clickObj.rating;
    }else if (clickObj.itemId == 12) {
      this.model.effective_control = clickObj.rating;
    }else if (clickObj.itemId == 13) {
      this.model.rating = clickObj.rating;
    }
  }
  // --rating click function call  end--

  /* User detasils get start */
  userInfoData(){
    let userObs: Observable<any>;
    userObs = this.authService.userDetails();

    this.userDetailsSubscribe = userObs.subscribe(
      resData => {
        console.log('userDetails@@', resData);
        if(resData.return_status > 0){
          this.userData = resData.return_data;
          
          this.rating_url = 'rate_tutor_data/'+this.parms_id+'?user_id='+this.userData.user_data.id;
          this.ratingDetails();
          
        }
        
      },
      errRes => {
      }
      );
  }
  /* User detasils get end */

  /* ratingDetails start */
  ratingDetails(){
    this.ratingDataSubscribe = this.http.get(this.rating_url).subscribe(
      (res:any) => {
        this.ratingData = res.return_data;

        console.log('this.ratingData', Math.round( +this.ratingData.review_det.course_completeness ) );
        this.model = {
          self_confidence: Math.round( +this.ratingData.review_det.self_confidence ),
          punctuality_regularity: Math.round( +this.ratingData.review_det.punctuality_regularity ),
          course_coverage: Math.round( +this.ratingData.review_det.course_coverage ),
          course_completeness: Math.round( +this.ratingData.review_det.course_completeness ),
          course_delivery: Math.round( +this.ratingData.review_det.course_delivery ),
          communication_skills: Math.round( +this.ratingData.review_det.communication_skills ),
          presentation_skills:Math.round( +this.ratingData.review_det.presentation_skills ),
          teaching_technique: Math.round( +this.ratingData.review_det.teaching_technique ),
          focus_in_syllabus: Math.round( +this.ratingData.review_det.focus_in_syllabus ),
          innovative_method: Math.round( +this.ratingData.review_det.innovative_method ),
          helping_attitude: Math.round( +this.ratingData.review_det.helping_attitude ),
          effective_control: Math.round( +this.ratingData.review_det.effective_control ),
          rating: Math.round( +this.ratingData.review_det.rating ),
          title: this.ratingData.review_det.title,
          comments: this.ratingData.review_det.comments,
          review_id: this.ratingData.review_det.id
        }
      },
      errRes => {
      }
    );
  }
  /* ratingDetails end */

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
    if (this.ratingDataSubscribe !== undefined) {
      this.ratingDataSubscribe.unsubscribe();
    } 
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
  // destroy subscription end
}