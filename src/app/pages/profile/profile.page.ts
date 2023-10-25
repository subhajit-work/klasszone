import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, DatetimeChangeEventDetail, MenuController, NavController } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CommonUtils } from 'src/app/services/common-utils/common-utils';
import { environment } from 'src/environments/environment';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MediaMatcher} from '@angular/cdk/layout';

import profileMenuData from 'src/app/services/profilemenu.json';
import { AngularEditorConfig } from '@kolkov/angular-editor';

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
  // server api
  api_url = environment.apiUrl;
  file_url = environment.fileUrl;
  private formSubmitSubscribe: Subscription | undefined;
  form_submit_text = 'Save';
  form_api: any;
  private userDetailsSubscribe: Subscription | undefined;
  userData:any;
  model: any = {};
  imageLoader = false;
  updateProfileImageApi:any;
  parms_slug:any;
  pageName:any;
  private tableListDataSubscribe: Subscription | undefined;
  tableListData_url:any;
  tableData:any;
  profileSideMenuData:any;
  userSavedInfo:any;
  private getCountryCodeSubscribe: Subscription | undefined;
  countryCodeUrl: any;
  
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  public list_product = new MatTableDataSource<any>([]);  // <-- STEP (1)
    displayedColumns:any;
    @ViewChild(MatPaginator)
  private paginator!: MatPaginator;  // <-- STEP (3)

  private klassCoinDataSubscribe: Subscription | undefined;
  klassCoin_url:any;
  klassCoinList:any;

  private meetingDataSubscribe: Subscription | undefined;
  meeting_url:any;
  meetingData:any;

  private classDataSubscribe: Subscription | undefined;
  class_url:any;
  classData:any;

  bookingStatus = [
    {
      name: 'Cancel Booking',
      id: 1
    },
    {
      name: 'Claim For Admin Intervention',
      id: 1
    },
  ]
  fetchItems = [];

  userType:any;

  skillRating = [
    {
      name : 'Poor'
    },
    {
      name : 'Average'
    },
    {
      name : 'Good'
    },
    {
      name : 'Very Good'
    },
    {
      name : 'Excellent'
    }
  ];
  pament_type = [
    {
      value : 'paypal',
      name : 'UPI-ID'
    },
    {
      value : 'bank',
      name : 'Bank Details'
    }
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
    private menuCtrl: MenuController,
    private http : HttpClient,
    private alertController : AlertController,
    private authService : AuthService,
    private router: Router,
    private commonUtils: CommonUtils,
    private navCtrl : NavController,
    private activatedRoute : ActivatedRoute,
    changeDetectorRef: ChangeDetectorRef, 
    media: MediaMatcher
  ) { 
    this.menuCtrl.enable(true,'rightMenu');

    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {
    this.userType = localStorage.getItem('user_type');
    if (this.userType == 'tutor') {
      this.profileSideMenuData = profileMenuData.tutorMenuData;
    }else {
      this.profileSideMenuData = profileMenuData.studentMenuData;
    }
    this.commonUtils.userInfoDataObservable.subscribe(res =>{
      console.log('userInfoDataObservable res>>>>>>>>>>>>>>>>>>>.. >', res);
      this.userData = res;
    })
    this.parms_slug = this.activatedRoute.snapshot.paramMap.get('slug');
    console.log('parms_slug', this.parms_slug);
    this.pageName = this.parms_slug.replace(/-/g, " ");
    // this.menuCtrl.close('rightMenu');

    this.userInfoData();

    

    this.updateProfileImageApi = 'student_profile_information/';
    this.menuCtrl.enable(true,'rightMenu');

    if (this.parms_slug == 'edit-profile') {
      if (this.userType == 'tutor') {
        this.form_api = 'tutor_personal_info_update/';
      }else {
        this.form_api = 'student_profile_update/';
      }
    }else if (this.parms_slug == 'profile-information') {
      this.countryCodeUrl = 'country_code';
      this.getCountryCode();
      if (this.userType == 'tutor') {
        this.form_api = 'tutor_update_contact_information/';
      }else {
        this.form_api = 'update_contact_information/';
      }
    }else if (this.parms_slug == 'tutor-profile-information'){
      this.form_api = 'tutor_profile_information/';
    }

    // klass Coin List
    if (this.parms_slug == 'klassCoins-packages') {
      if (this.userType == 'tutor') {
        this.klassCoin_url = 'tutor_list_packages';
        this.klassCoinPackageList(); 
      }else {
        this.klassCoin_url = 'list_packages';
        this.klassCoinPackageList(); 
      }
    }
  }

  ionViewDidEnter(){
    this.menuCtrl.enable(true,'rightMenu');
    // this.userInfoData();
    // this.menuCtrl.close('rightMenu');
  }
  ionViewWillEnter() {
    this.menuCtrl.enable(true,'rightMenu');
    
  }
  ionViewWillLeave() {
    this.menuCtrl.close('rightMenu');
    this.menuCtrl.enable(false,'rightMenu');
  }
  ionViewDidLeave() {
    this.menuCtrl.close('rightMenu');
    this.menuCtrl.enable(false,'rightMenu');
  }
  ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator;
    this.list_product.paginator = this.paginator;
  }

  // get payment type start
  segmentChanged(e: any) {
    this.model.pament_type = e.detail.value;
    console.log('segmentValue', this.model.pament_type);
  }
  // get payment type end

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

  /* ------Table data list start------ */
  tableListData() {
    this.tableListDataSubscribe = this.http.get(this.tableListData_url).subscribe(
      (res:any) => {
        this.tableData = res.return_data;
        this.list_product.data = res.return_data
        console.log('this.tableData', res);
        // if(res.return_status > 0){
        //   this.viewData = res.return_data[this.parms_action_id];
        //   console.log("view data  res cmsssssssssss inner -------------------->", this.viewData);
        // }
      },
      errRes => {
        
      }
    );
  }
  /* Table data list end */

  /* User detasils get start */
  userInfoData(){
    let userObs: Observable<any>;
    userObs = this.authService.userDetails();

    this.userDetailsSubscribe = userObs.subscribe(
      resData => {
        console.log('userDetails@@', resData);
        if(resData.return_status > 0){
          this.userData = resData.return_data;
          // call table data
          if (this.parms_slug == 'klassCoins-history') {
            this.tableListData_url = 'credits_transactions_history/'+this.userData.user_data.id;
            this.displayedColumns = ['credits', 'balance', 'action', 'purpose', 'date_of_action','actions'];
          }else if (this.parms_slug == 'received-reviews') {
            this.tableListData_url = 'tutor_user_reviews/'+this.userData.user_data.id;
            this.displayedColumns = ['s30a811f6', 'comments', 'rating', 'created_at', 'updated_at','actions'];
          }else if (this.parms_slug == 'order-history') {
            if (this.userType == 'tutor') {
              this.tableListData_url = 'tutor_mysubscriptions/'+this.userData.user_data.id;
              this.displayedColumns = ['id', 'subscribe_date', 'package_name', 'transaction_no', 'payment_type', 'credits','amount_paid'];
            }else {
              this.tableListData_url = 'mysubscriptions/'+this.userData.user_data.id;
              this.displayedColumns = ['id', 'subscribe_date', 'package_name', 'transaction_no', 'payment_type', 'credits','amount_paid'];
            }
          }else if (this.parms_slug == 'all-enrolement') {
            if (this.userType == 'tutor') {
              this.tableListData_url = 'tutor_event_enquiries?user_id='+this.userData.user_data.id;
              this.displayedColumns = ['student_names', 'event_id', 'date', 'start_time', 'end_time', 'fee', 'prev_status','actions'];
            }else {
              this.tableListData_url = 'event_enquiries?user_id='+this.userData.user_data.id;
              this.displayedColumns = ['s1ba55b7f', 'event_id', 'sea134da7', 'date', 'start_time', 'end_time', 'fee', 'content', 'prev_status','actions'];
            }
          }else if (this.parms_slug == 'upcoming-enrollments') {
            if (this.userType == 'tutor') {
              this.tableListData_url = 'tutor_event_enquiries/pending?user_id='+this.userData.user_data.id;
              this.displayedColumns = ['student_names', 'event_id', 'date', 'start_time', 'end_time', 'fee', 'prev_status','actions'];
            }else {
              this.tableListData_url = 'event_enquiries/pending?user_id='+this.userData.user_data.id;
              this.displayedColumns = ['s1ba55b7f', 'event_id', 'sea134da7', 'date', 'start_time', 'end_time', 'fee', 'content', 'prev_status','actions'];
            }
          }else if (this.parms_slug == 'completed-expired-events') {
            if (this.userType == 'tutor') {
              this.tableListData_url = 'tutor_event_enquiries/completed?user_id='+this.userData.user_data.id;
              this.displayedColumns = ['student_names', 'event_id', 'date', 'start_time', 'end_time', 'fee', 'prev_status','actions'];
            }else {
              this.tableListData_url = 'event_enquiries/completed?user_id='+this.userData.user_data.id;
              this.displayedColumns = ['s1ba55b7f', 'event_id', 'sea134da7', 'date', 'start_time', 'end_time', 'fee', 'content', 'prev_status','actions'];
            }
          }else if (this.parms_slug == 'cancelled-enrollments') {
              this.tableListData_url = 'tutor_event_enquiries/cancelled?user_id='+this.userData.user_data.id;
              this.displayedColumns = ['student_names', 'event_id', 'date', 'start_time', 'end_time', 'fee', 'prev_status','actions'];
          }else if (this.parms_slug == 'salary-request-done') {
            this.tableListData_url = 'credit_conversion_requests/done?user_id='+this.userData.user_data.id;
            this.displayedColumns = ['booking_id', 'no_of_credits_to_be_converted', 'admin_commission_val', 'per_credit_cost', 'total_amount', 'type', 'status_of_payment', 'updated_at', 'actions'];
          } else if (this.parms_slug == 'manage-courses') {
            this.tableListData_url = 'tutor_manage_courses/'+this.userData.user_data.id;
            this.displayedColumns = ['course_title', 'category', 'sub_category', 'duration', 'fee', 'created_at', 'type', 'prev_status','actions'];
          }else if (this.parms_slug == 'list-event') {
            this.tableListData_url = 'tutor_manage_events?user_id='+this.userData.user_data.id;
            this.displayedColumns = ['name', 'total_students', 'fee', 'event_date', 'start_time', 'end_time', 'prev_status','actions'];
          }else if (this.parms_slug == 'rewards-points') {
            this.tableListData_url = 'creditcoins_transactions_history?user_id='+this.userData.user_data.id;
            this.displayedColumns = ['credits','balance', 'action', 'purpose', 'date_of_action','actions'];
          }else if (this.parms_slug == 'all-enrolement-classes') {
            if (this.userType == 'tutor') {
              this.tableListData_url = 'student_enquiries?user_id='+this.userData.user_data.id;
              this.displayedColumns = ['see4f574b','course_title', 'start_date', 'message', 'total_class_per_week', 'duration', 'increased_fee', 'type', 'prev_status','actions'];
            }else {
              this.tableListData_url = 'enquiries?user_id='+this.userData.user_data.id;
              this.displayedColumns = ['course_title', 'start_date', 'message', 's1ba55b7f', 'total_class_per_week', 'duration', 'increased_fee', 'type', 'prev_status','actions'];
            }
          }else if (this.parms_slug == 'approved-enrolement-classes') {
            if (this.userType == 'tutor') {
              this.tableListData_url = 'student_enquiries/approved?user_id='+this.userData.user_data.id;
              this.displayedColumns = ['student_names','course_title', 'start_date', 'message', 'total_class_per_week', 'duration', 'increased_fee', 'type', 'prev_status','actions'];
            }else {
              this.tableListData_url = 'enquiries/approved?user_id='+this.userData.user_data.id;
              this.displayedColumns = ['course_title', 'start_date', 'message', 's1ba55b7f', 'total_class_per_week', 'duration', 'increased_fee', 'type', 'prev_status','actions'];
            }
          }else if (this.parms_slug == 'session-initiated-enrolement-classes') {
            if (this.userType == 'tutor') {
              this.tableListData_url = 'student_enquiries/session_initiated?user_id='+this.userData.user_data.id;
              this.displayedColumns = ['student_names','course_title', 'start_date', 'message', 'total_class_per_week', 'duration', 'increased_fee', 'type', 'prev_status','actions'];
            }else {
              this.tableListData_url = 'enquiries/session_initiated?user_id='+this.userData.user_data.id;
              this.displayedColumns = ['course_title', 'start_date', 'message', 's1ba55b7f', 'total_class_per_week', 'duration', 'increased_fee', 'type', 'prev_status','actions'];
            }
          }else if (this.parms_slug == 'completed-enrolement-classes') {
            if (this.userType == 'tutor') {
              this.tableListData_url = 'student_enquiries/completed?user_id='+this.userData.user_data.id;
              this.displayedColumns = ['student_names', 'course_title', 'start_date', 'message', 'total_class_per_week', 'duration', 'increased_fee', 'type', 'prev_status','actions'];
            }else {
              this.tableListData_url = 'enquiries/completed?user_id='+this.userData.user_data.id;
              this.displayedColumns = ['course_title', 'start_date', 'message', 's1ba55b7f', 'total_class_per_week', 'duration', 'increased_fee', 'type', 'prev_status','actions'];
            }
          }else if (this.parms_slug == 'cancelled-enrolement-classes') {
            if (this.userType == 'tutor') {
              this.tableListData_url = 'student_enquiries/cancelled?user_id='+this.userData.user_data.id;
              this.displayedColumns = ['student_names', 'course_title', 'start_date', 'message', 'total_class_per_week', 'duration', 'increased_fee', 'type', 'prev_status','actions'];
            }else {
              this.tableListData_url = 'enquiries/cancelled?user_id='+this.userData.user_data.id;
              this.displayedColumns = ['course_title', 'start_date', 'message', 's1ba55b7f', 'total_class_per_week', 'duration', 'increased_fee', 'type', 'prev_status','actions'];
            }
          }else if (this.parms_slug == 'intervention-enrolement-classes') {
            if (this.userType == 'tutor') {
              this.tableListData_url = 'student_enquiries/called_for_admin_intervention?user_id='+this.userData.user_data.id;
              this.displayedColumns = ['student_names', 'course_title', 'start_date', 'message', 'total_class_per_week', 'duration', 'increased_fee', 'type', 'prev_status','actions'];
            }else {
              this.tableListData_url = 'enquiries/called_for_admin_intervention?user_id='+this.userData.user_data.id;
              this.displayedColumns = ['course_title', 'start_date', 'message', 's1ba55b7f', 'total_class_per_week', 'duration', 'increased_fee', 'type', 'prev_status','actions'];
            }
          }else if (this.parms_slug == 'closed-enrolement-classes') {
            if (this.userType == 'tutor') {
              this.tableListData_url = 'student_enquiries/closed?user_id='+this.userData.user_data.id;
              this.displayedColumns = ['student_names', 'course_title', 'start_date', 'message', 'total_class_per_week', 'duration', 'increased_fee', 'type', 'prev_status','actions'];
            }else {
              this.tableListData_url = 'enquiries/closed?user_id='+this.userData.user_data.id;
              this.displayedColumns = ['course_title', 'start_date', 'message', 's1ba55b7f', 'total_class_per_week', 'duration', 'increased_fee', 'type', 'prev_status','actions'];
            }
          }else if (this.parms_slug == 'expired-enrolement-classes') {
            if (this.userType == 'tutor') {
              this.tableListData_url = 'student_enquiries/expired?user_id='+this.userData.user_data.id;
              this.displayedColumns = ['student_names', 'course_title', 'start_date', 'message', 'total_class_per_week', 'duration', 'increased_fee', 'type', 'prev_status','actions'];
            }else {
              this.tableListData_url = 'enquiries/expired?user_id='+this.userData.user_data.id;
              this.displayedColumns = ['course_title', 'start_date', 'message', 's1ba55b7f', 'total_class_per_week', 'duration', 'increased_fee', 'type', 'prev_status','actions'];
            }
          }
          this.tableListData();
          
          this.model = {
            photo : this.userData.user_data.photo,
            first_name : this.userData.user_data.first_name,
            middle_name : this.userData.user_data.middle_name,
            last_name : this.userData.user_data.last_name,
            gender : this.userData.user_data.gender,
            email : this.userData.user_data.email,
            dob : this.userData.user_data.dob,
            address : this.userData.user_data.address,
            state : this.userData.user_data.state,
            city : this.userData.user_data.city,
            land_mark : this.userData.user_data.land_mark,
            country : this.userData.user_data.country+'+'+this.userData.user_data.phone_code,
            pin_code : this.userData.user_data.pin_code,
            phone : this.userData.user_data.phone,
            listning : this.userData.user_data.listning,
            reading : this.userData.user_data.reading,
            writing : this.userData.user_data.writing,
            presentation : this.userData.user_data.presentation,
            website : this.userData.user_data.website,
            facebook : this.userData.user_data.facebook,
            twitter : this.userData.user_data.twitter,
            linkedin : this.userData.user_data.linkedin,
            account_holder_name : this.userData.user_data.account_holder_name,
            account_number : this.userData.user_data.account_number,
            ifsc_code : this.userData.user_data.ifsc_code,
            bank_name : this.userData.user_data.bank_name,
            bank_address : this.userData.user_data.bank_address,
            paypal_email : this.userData.user_data.paypal_email,
            language_of_teaching : this.userData.user_data.language_of_teaching,
          }
          if ( this.userData.user_data.paypal_email) {
            this.model.pament_type = 'paypal'
          }else {
            this.model.pament_type = 'bank'
          }

          if (this.userData.user_data.academic_class == 'yes') {
            this.model.academic_class = true;
          }else {
            this.model.academic_class = false;
          }

          if (this.userData.user_data.non_academic_class == 'yes') {
            this.model.non_academic_class = true;
          }else {
            this.model.non_academic_class = false;
          }
        }
        
      },
      errRes => {
      }
      );
  }
  /* User detasils get end */ 

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

  //---- rating click function call  start ----
  ratingClicked: any;
  ratingComponentClick(clickObj: any): void {
    console.log('clickObj >>', clickObj);
    const item = this.fetchItems.find(((i: any) => i.id === clickObj.itemId));
    // if (!!item) {
    //   item.rating = clickObj.rating;
    // }
  }
  // --rating click function call  end--

  // ------ export function call start ------
  export_url:any;
  onExport(_identifier:any, _item:any){
    this.export_url = this.file_url+'/'+_item;
    window.open(this.export_url);
  }
  // export function call end

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
        (response: any) => {
          if (response.return_status > 0) {
            this.commonUtils.presentToast('success', response.return_message);
            this.userInfoData();
          }else {
            this.commonUtils.presentToast('error', response.return_message);
          }
        },
        (error) => {
          console.log("error", error);
          this.commonUtils.presentToast('error', error.message);
          this.imageLoader = false;
        })
    }
  }
  /* profile picture upload end */

  /* Klasscoin package start */
  klassCoinPackageList(){
    this.klassCoinDataSubscribe = this.http.get(this.klassCoin_url).subscribe(
      (res:any) => {
        this.klassCoinList = res.return_data;

        console.log('this.klassCoinList', this.klassCoinList);
      },
      errRes => {
      }
    );
  }
  /* Klasscoin package end */

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

    this.formSubmitSubscribe = this.http.post(this.form_api+this.userData.user_data.id, fd).subscribe(
      (response: any) => {

        console.log("add form response >", response);
        if (response.return_status > 0) {
          this.commonUtils.presentToast('success', response.return_message);
          this.userInfoData();
          this.getCountryCode();
          // this.router.navigateByUrl('/dashboard');
        }else {
          this.commonUtils.presentToast('error', response.return_message);
        }
        
      },
      errRes => {
      }
    );

  }
  // form submit end

  /* onSubmitCertificates start */
  certificatesFormApi = 'tutuor_certificates/';
  onSubmitCertificates(form: NgForm) {
    console.log("add form submit >", form.value);

    // get form value
    let fd = new FormData();
    
    if(this.fileValResume) {
      // normal file upload
      fd.append(this.normalFileNameResume, this.fileValResume, this.fileValResume.name);
    }else if(this.fileValResumeCross == 'cross_resume'){
      fd.append('resume', 'removed');
    }else{
      fd.append('resume', '');
    }
  
  
    // fileVal
    if(this.fileVal) {
      fd.append('certificate[5]', this.fileVal, this.fileVal.name);
    }else if(this.fileValCross == 'cross_image'){
      fd.append('certificate[5]', 'removed');
    }else{
      fd.append('certificate[5]', '');
    }

    // fileVal1
    if(this.fileVal1) {
      fd.append('certificate[7]', this.fileVal1, this.fileVal1.name);
    }else if(this.fileVal1Cross == 'cross_image'){
      fd.append('certificate[7]', 'removed');
    }else{
      fd.append('certificate[7]', '');
    }
    // fileVal2
    if(this.fileVal2) {
      fd.append('certificate[10]', this.fileVal2, this.fileVal2.name);
    }else if(this.fileVal2Cross == 'cross_image'){
      fd.append('certificate[10]', 'removed');
    }else{
      fd.append('certificate[10]', '');
    }
    // fileVal3
    if(this.fileVal3) {
      fd.append('certificate[11]', this.fileVal3, this.fileVal3.name);
    }else if(this.fileVal3Cross == 'cross_image'){
      fd.append('certificate[11]', 'removed');
    }else{
      fd.append('certificate[11]', '');
    }
    // fileVal4
    if(this.fileVal4) {
      fd.append('certificate[12]', this.fileVal4, this.fileVal4.name);
    }else if(this.fileVal4Cross == 'cross_image'){
      fd.append('certificate[12]', 'removed');
    }else{
      fd.append('certificate[12]', '');
    }
    // fileVal5
    if(this.fileVal5) {
      fd.append('certificate[13]', this.fileVal5, this.fileVal5.name);
    }else if(this.fileVal5Cross == 'cross_image'){
      fd.append('certificate[13]', 'removed');
    }else{
      fd.append('certificate[13]', '');
    }
    // fileVal6
    if(this.fileVal6) {
      fd.append('certificate[14]', this.fileVal6, this.fileVal6.name);
    }else if(this.fileVal6Cross == 'cross_image'){
      fd.append('certificate[14]', 'removed');
    }else{
      fd.append('certificate[14]', '');
    }
    // fileVal7
    if(this.fileVal7) {
      fd.append('certificate[15]', this.fileVal7, this.fileVal7.name);
    }else if(this.fileVal7Cross == 'cross_image'){
      fd.append('certificate[15]', 'removed');
    }else{
      fd.append('certificate[15]', '');
    }
    // fileVal8
    if(this.fileVal8) {
      fd.append('certificate[16]', this.fileVal8, this.fileVal8.name);
    }else if(this.fileVal8Cross == 'cross_image'){
      fd.append('certificate[16]', 'removed');
    }else{
      fd.append('certificate[16]', '');
    }
    // fileVal9
    if(this.fileVal9) {
      fd.append('certificate[18]', this.fileVal9, this.fileVal9.name);
    }else if(this.fileVal9Cross == 'cross_image'){
      fd.append('certificate[18]', 'removed');
    }else{
      fd.append('certificate[18]', '');
    }

    // fileVal10
    if(this.fileVal10) {
      fd.append('certificate[20]', this.fileVal10, this.fileVal10.name);
    }else if(this.fileVal10Cross == 'cross_image'){
      fd.append('certificate[20]', 'removed');
    }else{
      fd.append('certificate[20]', '');
    }
    // fileVal11
    if(this.fileVal11) {
      fd.append('certificate[21]', this.fileVal11, this.fileVal11.name);
    }else if(this.fileVal11Cross == 'cross_image'){
      fd.append('certificate[21]', 'removed');
    }else{
      fd.append('certificate[21]', '');
    }
    // fileVal12
    if(this.fileVal12) {
      fd.append('certificate[22]', this.fileVal12, this.fileVal12.name);
    }else if(this.fileVal12Cross == 'cross_image'){
      fd.append('certificate[22]', 'removed');
    }else{
      fd.append('certificate[22]', '');
    }
    // fileVal13
    if(this.fileVal13) {
      fd.append('certificate[23]', this.fileVal13, this.fileVal13.name);
    }else if(this.fileVal13Cross == 'cross_image'){
      fd.append('certificate[23]', 'removed');
    }else{
      fd.append('certificate[23]', '');
    }
    // fileVal14
    if(this.fileVal14) {
      fd.append('certificate[24]', this.fileVal14, this.fileVal14.name);
    }else if(this.fileVal14Cross == 'cross_image'){
      fd.append('certificate[24]', 'removed');
    }else{
      fd.append('certificate[24]', '');
    }
    // fileVal15
    if(this.fileVal15) {
      fd.append('certificate[25]', this.fileVal15, this.fileVal15.name);
    }else if(this.fileVal15Cross == 'cross_image'){
      fd.append('certificate[25]', 'removed');
    }else{
      fd.append('certificate[25]', '');
    }
    // fileVal16
    if(this.fileVal16) {
      fd.append('certificate[26]', this.fileVal16, this.fileVal16.name);
    }else if(this.fileVal16Cross == 'cross_image'){
      fd.append('certificate[26]', 'removed');
    }else{
      fd.append('certificate[26]', '');
    }
    

    if (!form.valid) {
      return;
    }
    console.log('value >', fd);
    this.formSubmitSubscribe = this.http.post(this.certificatesFormApi+this.userData.user_data.id, fd).subscribe(
      (response: any) => {
        if (response.return_status > 0) {
          this.commonUtils.presentToast('success', response.return_message);
          // this.userInfoData();
        }else {
          this.commonUtils.presentToast('error', response.return_message);
        }
      },
      errRes => {
      }
    );

  }
  /* onSubmitCertificates end */

  // Normal file upload
  fileValphoto:any;
  fileValphotoCross:any;
  fileValphotoName:any;
  fileValphotoPathShow = false;
  fileValphotoPreviewImage:any;
  fileVal:any;
  fileValCross:any;
  fileValName:any;
  fileValPathShow = false;
  fileValPreviewImage:any;
  fileVal1:any;
  fileVal1Cross:any;
  fileVal1Name:any;
  fileVal1PathShow = false;
  fileVal1PreviewImage:any;
  fileVal2:any;
  fileVal2Cross:any;
  fileVal2Name:any;
  fileVal2PathShow = false;
  fileVal2PreviewImage:any;
  fileVal3:any;
  fileVal3Cross:any;
  fileVal3Name:any;
  fileVal3PathShow = false;
  fileVal3PreviewImage:any;
  fileVal4:any;
  fileVal4Cross:any;
  fileVal4Name:any;
  fileVal4PathShow = false;
  fileVal4PreviewImage:any;
  fileVal5:any;
  fileVal5Cross:any;
  fileVal5Name:any;
  fileVal5PathShow = false;
  fileVal5PreviewImage:any;
  fileVal6:any;
  fileVal6Cross:any;
  fileVal6Name:any;
  fileVal6PathShow = false;
  fileVal6PreviewImage:any;
  fileVal7:any;
  fileVal7Cross:any;
  fileVal7Name:any;
  fileVal7PathShow = false;
  fileVal7PreviewImage:any;
  fileVal8:any;
  fileVal8Cross:any;
  fileVal8Name:any;
  fileVal8PathShow = false;
  fileVal8PreviewImage:any;
  fileVal9:any;
  fileVal9Cross:any;
  fileVal9Name:any;
  fileVal9PathShow = false;
  fileVal9PreviewImage:any;
  fileVal10:any;
  fileVal10Cross:any;
  fileVal10Name:any;
  fileVal10PathShow = false;
  fileVal10PreviewImage:any;
  fileVal11:any;
  fileVal11Cross:any;
  fileVal11Name:any;
  fileVal11PathShow = false;
  fileVal11PreviewImage:any;
  fileVal12:any;
  fileVal12Cross:any;
  fileVal12Name:any;
  fileVal12PathShow = false;
  fileVal12PreviewImage:any;
  fileVal13:any;
  fileVal13Cross:any;
  fileVal13Name:any;
  fileVal13PathShow = false;
  fileVal13PreviewImage:any;
  fileVal14:any;
  fileVal14Cross:any;
  fileVal14Name:any;
  fileVal14PathShow = false;
  fileVal14PreviewImage:any;
  fileVal15:any;
  fileVal15Cross:any;
  fileVal15Name:any;
  fileVal15PathShow = false;
  fileVal15PreviewImage:any;
  fileVal16:any;
  fileVal16Cross:any;
  fileVal16Name:any;
  fileVal16PathShow = false;
  fileVal16PreviewImage:any;

  fileValResume:any;
  fileValResumeCross:any;
  normalFileNameResume:any;
  uploadresumePathShow = false;
  
  normalFileUpload(event:any, _item:any, _name:any) {
    console.log('nomal file upload _item => ', _item);
    console.log('nomal file upload _name => ', _name);

    if(_name == 'resume'){
      this.fileValResume =  event.target.files[0];
      _item =  event.target.files[0].name;
      this.normalFileNameResume = _name;
      this.uploadresumePathShow = true;
    }else if(_name == 'photo'){
      this.fileValphoto =  event.target.files[0];
      const render = new FileReader();
      render.onload = () =>{
        this.fileValphotoPreviewImage = render.result;
      }
      render.readAsDataURL(this.fileValphoto);
      _item =  event.target.files[0].name;
      this.fileValphotoName = _name;
      this.fileValphotoPathShow = true;
    }else if(_name == 'certificate_5'){
      this.fileVal =  event.target.files[0];
      const render = new FileReader();
      render.onload = () =>{
        this.fileValPreviewImage = render.result;
      }
      render.readAsDataURL(this.fileVal);
      _item =  event.target.files[0].name;
      this.fileValName = _name;
      this.fileValPathShow = true;
    }else if(_name == 'certificate_7'){
      this.fileVal1 =  event.target.files[0];
      const render = new FileReader();
      render.onload = () =>{
        this.fileVal1PreviewImage = render.result;
      }
      render.readAsDataURL(this.fileVal1);
      _item =  event.target.files[0].name;
      this.fileVal1Name = _name;
      this.fileVal1PathShow = true;
    }else if(_name == 'certificate_10'){
      this.fileVal2 =  event.target.files[0];
      const render = new FileReader();
      render.onload = () =>{
        this.fileVal2PreviewImage = render.result;
      }
      render.readAsDataURL(this.fileVal2);
      _item =  event.target.files[0].name;
      this.fileVal2Name = _name;
      this.fileVal2PathShow = true;
    }else if(_name == 'certificate_11'){
      this.fileVal3 =  event.target.files[0];
      const render = new FileReader();
      render.onload = () =>{
        this.fileVal3PreviewImage = render.result;
      }
      render.readAsDataURL(this.fileVal3);
      _item =  event.target.files[0].name;
      this.fileVal3Name = _name;
      this.fileVal3PathShow = true;
    }else if(_name == 'certificate_12'){
      this.fileVal4 =  event.target.files[0];
      const render = new FileReader();
      render.onload = () =>{
        this.fileVal4PreviewImage = render.result;
      }
      render.readAsDataURL(this.fileVal4);
      _item =  event.target.files[0].name;
      this.fileVal4Name = _name;
      this.fileVal4PathShow = true;
    }else if(_name == 'certificate_13'){
      this.fileVal5 =  event.target.files[0];
      const render = new FileReader();
      render.onload = () =>{
        this.fileVal5PreviewImage = render.result;
      }
      render.readAsDataURL(this.fileVal5);
      _item =  event.target.files[0].name;
      this.fileVal5Name = _name;
      this.fileVal5PathShow = true;
    }else if(_name == 'certificate_14'){
      this.fileVal6 =  event.target.files[0];
      const render = new FileReader();
      render.onload = () =>{
        this.fileVal6PreviewImage = render.result;
      }
      render.readAsDataURL(this.fileVal6);
      _item =  event.target.files[0].name;
      this.fileVal6Name = _name;
      this.fileVal6PathShow = true;
    }else if(_name == 'certificate_15'){
      this.fileVal7 =  event.target.files[0];
      const render = new FileReader();
      render.onload = () =>{
        this.fileVal7PreviewImage = render.result;
      }
      render.readAsDataURL(this.fileVal7);
      _item =  event.target.files[0].name;
      this.fileVal7Name = _name;
      this.fileVal7PathShow = true;
    }else if(_name == 'certificate_16'){
      this.fileVal8 =  event.target.files[0];
      const render = new FileReader();
      render.onload = () =>{
        this.fileVal8PreviewImage = render.result;
      }
      render.readAsDataURL(this.fileVal8);
      _item =  event.target.files[0].name;
      this.fileVal8Name = _name;
      this.fileVal8PathShow = true;
    }else if(_name == 'certificate_18'){
      this.fileVal9 =  event.target.files[0];
      const render = new FileReader();
      render.onload = () =>{
        this.fileVal9PreviewImage = render.result;
      }
      render.readAsDataURL(this.fileVal9);
      _item =  event.target.files[0].name;
      this.fileVal9Name = _name;
      this.fileVal9PathShow = true;
    }else if(_name == 'certificate_20'){
      this.fileVal10 =  event.target.files[0];
      const render = new FileReader();
      render.onload = () =>{
        this.fileVal10PreviewImage = render.result;
      }
      render.readAsDataURL(this.fileVal10);
      _item =  event.target.files[0].name;
      this.fileVal10Name = _name;
      this.fileVal10PathShow = true;
    }else if(_name == 'certificate_21'){
      this.fileVal11 =  event.target.files[0];
      const render = new FileReader();
      render.onload = () =>{
        this.fileVal11PreviewImage = render.result;
      }
      render.readAsDataURL(this.fileVal11);
      _item =  event.target.files[0].name;
      this.fileVal11Name = _name;
      this.fileVal11PathShow = true;
    }else if(_name == 'certificate_22'){
      this.fileVal12 =  event.target.files[0];
      const render = new FileReader();
      render.onload = () =>{
        this.fileVal12PreviewImage = render.result;
      }
      render.readAsDataURL(this.fileVal12);
      _item =  event.target.files[0].name;
      this.fileVal12Name = _name;
      this.fileVal12PathShow = true;
    }else if(_name == 'certificate_23'){
      this.fileVal13 =  event.target.files[0];
      const render = new FileReader();
      render.onload = () =>{
        this.fileVal13PreviewImage = render.result;
      }
      render.readAsDataURL(this.fileVal13);
      _item =  event.target.files[0].name;
      this.fileVal13Name = _name;
      this.fileVal13PathShow = true;
    }else if(_name == 'certificate_24'){
      this.fileVal14 =  event.target.files[0];
      const render = new FileReader();
      render.onload = () =>{
        this.fileVal14PreviewImage = render.result;
      }
      render.readAsDataURL(this.fileVal14);
      _item =  event.target.files[0].name;
      this.fileVal14Name = _name;
      this.fileVal14PathShow = true;
    }else if(_name == 'certificate_25'){
      this.fileVal15 =  event.target.files[0];
      const render = new FileReader();
      render.onload = () =>{
        this.fileVal15PreviewImage = render.result;
      }
      render.readAsDataURL(this.fileVal15);
      _item =  event.target.files[0].name;
      this.fileVal15Name = _name;
      this.fileVal15PathShow = true;
    }else if(_name == 'certificate_26'){
      this.fileVal16 =  event.target.files[0];
      const render = new FileReader();
      render.onload = () =>{
        this.fileVal16PreviewImage = render.result;
      }
      render.readAsDataURL(this.fileVal16);
      _item =  event.target.files[0].name;
      this.fileVal16Name = _name;
      this.fileVal16PathShow = true;
    }
  }
  fileCross(_item:any, _identifire:any){
    if(_identifire == 'resume'){
      this.model.resume = null;
      this.model.resume2 = null;
      this.normalFileNameResume = '';
      this.fileValResumeCross = 'cross_resume';

    }else if(_identifire == 'photo'){
      this.model.photo = null;
      this.fileValphotoName = '';
      this.fileValphotoCross = 'cross_image';
      this.fileValphotoPathShow = false;
    }else if(_identifire == 'certificate_5'){
      this.model.certificate_5 = null;
      this.fileValName = '';
      this.fileValCross = 'cross_image';
      this.fileValPathShow = false;
    }else if(_identifire == 'certificate_7'){
      this.model.certificate_7 = null;
      this.fileVal1Name = '';
      this.fileVal1Cross = 'cross_image';
      this.fileVal1PathShow = false;
    }else if(_identifire == 'certificate_10'){
      this.model.certificate_10 = null;
      this.fileVal2Name = '';
      this.fileVal2Cross = 'cross_image';
      this.fileVal2PathShow = false;
    }else if(_identifire == 'certificate_11'){
      this.model.certificate_11 = null;
      this.fileVal3Name = '';
      this.fileVal3Cross = 'cross_image';
      this.fileVal3PathShow = false;
    }else if(_identifire == 'certificate_12'){
      this.model.certificate_12 = null;
      this.fileVal4Name = '';
      this.fileVal4Cross = 'cross_image';
      this.fileVal4PathShow = false;
    }else if(_identifire == 'certificate_13'){
      this.model.certificate_13 = null;
      this.fileVal5Name = '';
      this.fileVal5Cross = 'cross_image';
      this.fileVal5PathShow = false;
    }else if(_identifire == 'certificate_14'){
      this.model.certificate_14 = null;
      this.fileVal6Name = '';
      this.fileVal6Cross = 'cross_image';
      this.fileVal6PathShow = false;
    }else if(_identifire == 'certificate_15'){
      this.model.certificate_15 = null;
      this.fileVal7Name = '';
      this.fileVal7Cross = 'cross_image';
      this.fileVal7PathShow = false;
    }else if(_identifire == 'certificate_16'){
      this.model.certificate_16 = null;
      this.fileVal8Name = '';
      this.fileVal8Cross = 'cross_image';
      this.fileVal8PathShow = false;
    }else if(_identifire == 'certificate_18'){
      this.model.certificate_18 = null;
      this.fileVal9Name = '';
      this.fileVal9Cross = 'cross_image';
      this.fileVal9PathShow = false;
    }else if(_identifire == 'certificate_20'){
      this.model.certificate_20 = null;
      this.fileVal10Name = '';
      this.fileVal10Cross = 'cross_image';
      this.fileVal10PathShow = false;
    }else if(_identifire == 'certificate_21'){
      this.model.certificate_21 = null;
      this.fileVal11Name = '';
      this.fileVal11Cross = 'cross_image';
      this.fileVal11PathShow = false;
    }else if(_identifire == 'certificate_22'){
      this.model.certificate_22 = null;
      this.fileVal12Name = '';
      this.fileVal12Cross = 'cross_image';
      this.fileVal12PathShow = false;
    }else if(_identifire == 'certificate_23'){
      this.model.certificate_23 = null;
      this.fileVal13Name = '';
      this.fileVal13Cross = 'cross_image';
      this.fileVal13PathShow = false;
    }else if(_identifire == 'certificate_24'){
      this.model.certificate_24 = null;
      this.fileVal14Name = '';
      this.fileVal14Cross = 'cross_image';
      this.fileVal14PathShow = false;
    }else if(_identifire == 'certificate_25'){
      this.model.certificate_25 = null;
      this.fileVal15Name = '';
      this.fileVal15Cross = 'cross_image';
      this.fileVal15PathShow = false;
    }else if(_identifire == 'certificate_26'){
      this.model.certificate_26 = null;
      this.fileVal16Name = '';
      this.fileVal16Cross = 'cross_image';
      this.fileVal16PathShow = false;
    }
  }
  // Normal file upload end

  /* Call for join meeting start */
  joinMeeting(){
    this.meetingDataSubscribe = this.http.get(this.meeting_url).subscribe(
      (res:any) => {
        if (res.return_status > 0) {
          this.meetingData = res.return_data;

          console.log('this.meetingData', this.meetingData);
          localStorage.setItem('big_blue_link', this.classData.url);
          this.navCtrl.navigateRoot('big-blue-button');
          // window.location.href=this.classData.url;
        }else {
          this.commonUtils.presentToast('error', res.return_message);
        }
        
      },
      errRes => {
      }
    );
  }
  /* Call for join meeting URL end */

  /* Aleart for open big blue button start */
  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header:  this.classData.meeting_name,
      message: 'Are you sure want to join this course?',
      cssClass: 'custom-alert',
      inputs: [
        {
          name: 'name',
          type: 'text',
          value: this.classData.url,
          placeholder: 'Meeting Link',
        },
      ],
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'cancelBtn',
        handler: (blah) => {}
      }, {
        text: 'Join Course Now',
        handler: () => {
          this.joinMeeting();
        }
      }]
    });
  
    await alert.present();
  }
  /* Aleart for open big blue button end */

  /* Join Class start */
  joinClass(_id:any){
    this.class_url = 'init/'+_id+'?user_type='+this.userType+'&user_id='+this.userData.user_data.id;
    this.classDataSubscribe = this.http.get(this.class_url).subscribe(
      (res:any) => {
        if (res.return_status > 0) {
          this.classData = res.return_data;
          console.log('this.classData', this.classData);
          this.presentAlertConfirm();
          this.meeting_url = 'course_attendance?message='+_id+'&user_id='+this.userData.user_data.id+'&type='+this.userType;
        }else {
          this.commonUtils.presentToast('error', res.return_message);
        }
        
      },
      errRes => {
      }
    );
  }
  /* Join Class end */

  // ----------- destroy subscription start ---------
  ngOnDestroy() {
    if(this.userDetailsSubscribe !== undefined){
      this.userDetailsSubscribe.unsubscribe();
    }
    if(this.tableListDataSubscribe !== undefined){
      this.tableListDataSubscribe.unsubscribe();
    }
    if(this.meetingDataSubscribe !== undefined){
      this.meetingDataSubscribe.unsubscribe();
    }
    if(this.classDataSubscribe !== undefined){
      this.classDataSubscribe.unsubscribe();
    }
    if (this.klassCoinDataSubscribe !== undefined) {
      this.klassCoinDataSubscribe.unsubscribe();
    }
    if (this.getCountryCodeSubscribe !== undefined) {
      this.getCountryCodeSubscribe.unsubscribe();
    }
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
  // destroy subscription end

}
