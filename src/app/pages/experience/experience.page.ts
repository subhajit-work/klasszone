import { MediaMatcher } from '@angular/cdk/layout';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CommonUtils } from 'src/app/services/common-utils/common-utils';
import { environment } from 'src/environments/environment';
import profileMenuData from 'src/app/services/profilemenu.json';
import { NgForm } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-experience',
  templateUrl: './experience.page.html',
  styleUrls: ['./experience.page.scss'],
})

export class ExperiencePage implements OnInit {
  api_url = environment.apiUrl;
  file_url = environment.fileUrl;

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  parms_action:any;
  parms_id:any;

  private userDetailsSubscribe: Subscription | undefined;
  userData:any;
  model: any = {};

  private bookingViewDataSubscribe: Subscription | undefined;
  bookingView_url:any;
  bookingViewData:any;

  userType:any;

  profileSideMenuData:any;

  private formSubmitSubscribe: Subscription | undefined;
  form_submit_text = 'Save';
  form_api: any;

  years = [
    {name: 2013}
  ];
  months = [
    {name: 'march'}
  ];

  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [
      ['bold']
      ],
    customClasses: [
      {
        name: "quote",
        class: "quote",
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      },
    ]
  };

  constructor(
    changeDetectorRef: ChangeDetectorRef, 
    media: MediaMatcher,
    private commonUtils: CommonUtils,
    private http : HttpClient,
    private activatedRoute : ActivatedRoute,
    private authService : AuthService,
    private router: Router,
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
   }

  ngOnInit() {
    this.parms_action = this.activatedRoute.snapshot.paramMap.get('action');
    this.parms_id = this.activatedRoute.snapshot.paramMap.get('id');
    console.log('parms_action', this.parms_action);
    console.log('parms_id', this.parms_id);

    this.userType = localStorage.getItem('user_type');

    if (this.userType == 'tutor') {
      this.profileSideMenuData = profileMenuData.tutorMenuData;
    }else {
      this.profileSideMenuData = profileMenuData.studentMenuData;
    }
    
    this.form_api = 'experience';

    this.userInfoData();
  }

  /* User detasils get start */
  loadUserData = false;
  userInfoData(){
    this.loadUserData = true;
    let userObs: Observable<any>;
    userObs = this.authService.userDetails();

    this.userDetailsSubscribe = userObs.subscribe(
      resData => {
        console.log('userDetails@@', resData);
        if(resData.return_status > 0){
          this.loadUserData = true;
          this.userData = resData.return_data;
          this.months = resData.return_data.user_data.months;
          this.years = resData.return_data.user_data.years;
          this.model.user_id = resData.return_data.user_data.id;
          
          let userEducation = resData.return_data.user_data.educations_data;
          if (this.parms_action == 'edit') {
            for (let i = 0; i < userEducation.length; i++) {
              if (this.userData.user_data.educations_data[i].record_id == this.parms_id) {
                let from_date =  userEducation[i].from_date.split(" ");
                let to_date =  userEducation[i].from_date.split(" ");
                
                this.model = {
                  user_id: userEducation[i].user_id,
                  company: userEducation[i].company,
                  role: userEducation[i].role,
                  description: userEducation[i].description,
                  from_month: from_date[0],
                  from_year: from_date[1],
                  to_month: to_date[0],
                  to_year: to_date[1],
                  created_at: userEducation[i].created_at,
                }
              }
              
            }
          }
          this.loadUserData = false;
        }
        
      },
      errRes => {
        this.loadUserData = false;
      }
      );
  }
  /* User detasils get end */

  /* getBookingView start */
  getBookingView(){
    this.bookingViewDataSubscribe = this.http.get(this.bookingView_url).subscribe(
      (res:any) => {
        this.bookingViewData = res.return_data[0];

        console.log('this.bookingViewData', this.bookingViewData);
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
      }else if (form.value[val] == false) {
        form.value[val] = 'no';
      }else if (form.value[val] == true) {
        form.value[val] = 'yes';
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
          this.commonUtils.presentToast('success', response.return_message);
          // this.userInfoData();
          this.router.navigateByUrl('/user/experience');
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
    if (this.bookingViewDataSubscribe !== undefined) {
      this.bookingViewDataSubscribe.unsubscribe();
    } 
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
  // destroy subscription end
}
