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
    this.form_api = 'student_profile_update/';
    this.menuCtrl.enable(true,'rightMenu');

    // klass Coin List
    if (this.parms_slug == 'klassCoins-packages') {
      this.klassCoin_url = 'list_packages';
      this.klassCoinPackageList(); 
    }
    this.model = {
      languages : [],
      listening_skills: [],
      reading_skills: [],
      writing_skills: [],
      presentation_skills: []
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
          }else if (this.parms_slug == 'all-enrolement') {
            this.tableListData_url = 'event_enquiries?user_id='+this.userData.user_data.id;
            this.displayedColumns = ['s1ba55b7f', 'event_id', 's1ba55b7f', 'event_id', 'start_time', 'end_time', 'increased_fee', 'content', 'prev_status','actions'];
          }else if (this.parms_slug == 'rewards-points') {
            this.tableListData_url = 'creditcoins_transactions_history?user_id='+this.userData.user_data.id;
            this.displayedColumns = ['credits','balance', 'action', 'purpose', 'date_of_action','actions'];
          }else if (this.parms_slug == 'all-enrolement-classes') {
            if (this.userType == 'tutor') {
              this.tableListData_url = 'student_enquiries?user_id='+this.userData.user_data.id;
              this.displayedColumns = ['see4f574b','course_title', 'start_date', 'course_id', 'course_level', 'duration', 'increased_fee', 'type', 'prev_status','actions'];
            }else {
              this.tableListData_url = 'enquiries?user_id='+this.userData.user_data.id;
              this.displayedColumns = ['course_title', 'start_date', 'course_id', 's1ba55b7f', 'course_level', 'duration', 'increased_fee', 'type', 'prev_status','actions'];
            }
          }else if (this.parms_slug == 'approved-enrolement-classes') {
            if (this.userType == 'tutor') {
              this.tableListData_url = 'student_enquiries/approved?user_id='+this.userData.user_data.id;
              this.displayedColumns = ['student_names','course_title', 'start_date', 'course_id', 'course_level', 'duration', 'increased_fee', 'type', 'prev_status','actions'];
            }else {
              this.tableListData_url = 'enquiries/approved?user_id='+this.userData.user_data.id;
              this.displayedColumns = ['course_title', 'start_date', 'course_id', 's1ba55b7f', 'course_level', 'duration', 'increased_fee', 'type', 'prev_status','actions'];
            }
          }else if (this.parms_slug == 'session-initiated-enrolement-classes') {
            if (this.userType == 'tutor') {
              this.tableListData_url = 'student_enquiries/session_initiated?user_id='+this.userData.user_data.id;
              this.displayedColumns = ['student_names','course_title', 'start_date', 'course_id', 'course_level', 'duration', 'increased_fee', 'type', 'prev_status','actions'];
            }else {
              this.tableListData_url = 'enquiries/session_initiated?user_id='+this.userData.user_data.id;
              this.displayedColumns = ['course_title', 'start_date', 'course_id', 's1ba55b7f', 'course_level', 'duration', 'increased_fee', 'type', 'prev_status','actions'];
            }
          }else if (this.parms_slug == 'completed-enrolement-classes') {
            if (this.userType == 'tutor') {
              this.tableListData_url = 'student_enquiries/completed?user_id='+this.userData.user_data.id;
              this.displayedColumns = ['student_names', 'course_title', 'start_date', 'course_id', 'course_level', 'duration', 'increased_fee', 'type', 'prev_status','actions'];
            }else {
              this.tableListData_url = 'enquiries/completed?user_id='+this.userData.user_data.id;
              this.displayedColumns = ['course_title', 'start_date', 'course_id', 's1ba55b7f', 'course_level', 'duration', 'increased_fee', 'type', 'prev_status','actions'];
            }
          }else if (this.parms_slug == 'cancelled-enrolement-classes') {
            if (this.userType == 'tutor') {
              this.tableListData_url = 'student_enquiries/cancelled?user_id='+this.userData.user_data.id;
              this.displayedColumns = ['student_names', 'course_title', 'start_date', 'course_id', 'course_level', 'duration', 'increased_fee', 'type', 'prev_status','actions'];
            }else {
              this.tableListData_url = 'enquiries/cancelled?user_id='+this.userData.user_data.id;
              this.displayedColumns = ['course_title', 'start_date', 'course_id', 's1ba55b7f', 'course_level', 'duration', 'increased_fee', 'type', 'prev_status','actions'];
            }
          }else if (this.parms_slug == 'intervention-enrolement-classes') {
            if (this.userType == 'tutor') {
              this.tableListData_url = 'student_enquiries/called_for_admin_intervention?user_id='+this.userData.user_data.id;
              this.displayedColumns = ['student_names', 'course_title', 'start_date', 'course_id', 'course_level', 'duration', 'increased_fee', 'type', 'prev_status','actions'];
            }else {
              this.tableListData_url = 'enquiries/called_for_admin_intervention?user_id='+this.userData.user_data.id;
              this.displayedColumns = ['course_title', 'start_date', 'course_id', 's1ba55b7f', 'course_level', 'duration', 'increased_fee', 'type', 'prev_status','actions'];
            }
          }else if (this.parms_slug == 'closed-enrolement-classes') {
            if (this.userType == 'tutor') {
              this.tableListData_url = 'student_enquiries/closed?user_id='+this.userData.user_data.id;
              this.displayedColumns = ['student_names', 'course_title', 'start_date', 'course_id', 'course_level', 'duration', 'increased_fee', 'type', 'prev_status','actions'];
            }else {
              this.tableListData_url = 'enquiries/closed?user_id='+this.userData.user_data.id;
              this.displayedColumns = ['course_title', 'start_date', 'course_id', 's1ba55b7f', 'course_level', 'duration', 'increased_fee', 'type', 'prev_status','actions'];
            }
          }else if (this.parms_slug == 'expired-enrolement-classes') {
            if (this.userType == 'tutor') {
              this.tableListData_url = 'student_enquiries/expired?user_id='+this.userData.user_data.id;
              this.displayedColumns = ['student_names', 'course_title', 'start_date', 'course_id', 'course_level', 'duration', 'increased_fee', 'type', 'prev_status','actions'];
            }else {
              this.tableListData_url = 'enquiries/expired?user_id='+this.userData.user_data.id;
              this.displayedColumns = ['course_title', 'start_date', 'course_id', 's1ba55b7f', 'course_level', 'duration', 'increased_fee', 'type', 'prev_status','actions'];
            }
          }
          this.tableListData();
          
          this.model = {
            photo : this.userData.user_data.photo,
            first_name : this.userData.user_data.first_name,
            middle_name : this.userData.user_data.middle_name,
            last_name : this.userData.user_data.last_name,
            gender : this.userData.user_data.gender,
            dob : this.userData.user_data.dob,
          }
        }
        
      },
      errRes => {
      }
      );
  }
  /* User detasils get end */

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

  /* Call for join meeting start */
  joinMeeting(){
    this.meetingDataSubscribe = this.http.get(this.meeting_url).subscribe(
      (res:any) => {
        if (res.return_status > 0) {
          this.meetingData = res.return_data;

          console.log('this.meetingData', this.meetingData);
          // localStorage.setItem('big_blue_link', this.classData.url);
          // this.navCtrl.navigateRoot('big-blue-button');
          window.location.href=this.classData.url;
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
          this.meeting_url = 'course_attendance?course_id='+_id+'&user_id='+this.userData.user_data.id+'&type='+this.userType;
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
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
  // destroy subscription end

}
