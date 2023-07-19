import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, DatetimeChangeEventDetail, MenuController } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CommonUtils } from 'src/app/services/common-utils/common-utils';
import { environment } from 'src/environments/environment';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';

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
          url: 'enrolement',
          icon: 'send',
        },
        {
          name: 'Approved',
          url: 'approved',
          icon: 'send',
        },
        {
          name: 'Session Initiated',
          url: 'session-initiated',
          icon: 'send',
        },
        {
          name: 'Completed',
          url: 'completed',
          icon: 'send',
        },
        {
          name: 'Cancelled ',
          url: 'cancelled ',
          icon: 'send',
        },
        {
          name: 'Claim For Admin Intervention ',
          url: 'intervention',
          icon: 'send',
        },
        {
          name: 'Closed',
          url: 'closed',
          icon: 'send',
        },
        {
          name: 'Expired',
          url: 'expired',
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
      url: 'buy-klassCoins',
      icon: 'toll',
      subPages : [
        {
          name: 'KlassCoins Packages',
          url: 'klassCoins-packages',
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
      url: 'klassCoins-history',
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
  userSavedInfo:any;

  public list_product = new MatTableDataSource<any>([]);  // <-- STEP (1)
    displayedColumns:any;
    @ViewChild(MatPaginator)
  private paginator!: MatPaginator;  // <-- STEP (3)


  constructor(
    private menuCtrl: MenuController,
    private http : HttpClient,
    private alertController : AlertController,
    private authService : AuthService,
    private router: Router,
    private commonUtils: CommonUtils,
    private activatedRoute : ActivatedRoute,
  ) { }

  ngOnInit() {
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
            this.displayedColumns = ['credits', 'action', 'purpose', 'date_of_action','actions'];
          }else if (this.parms_slug == 'all-enrolement') {
            this.tableListData_url = 'event_enquiries?user_id='+this.userData.user_data.id;
            this.displayedColumns = ['s1ba55b7f', 'event_id', 's1ba55b7f', 'event_id', 'start_time', 'end_time', 'increased_fee', 'content','actions'];
          }else if (this.parms_slug == 'rewards-points') {
            this.tableListData_url = 'creditcoins_transactions_history?user_id='+this.userData.user_data.id;
            this.displayedColumns = ['credits', 'action', 'purpose', 'date_of_action','actions'];
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

  // ----------- destroy subscription start ---------
  ngOnDestroy() {
    if(this.userDetailsSubscribe !== undefined){
      this.userDetailsSubscribe.unsubscribe();
    }
    if(this.tableListDataSubscribe !== undefined){
      this.tableListDataSubscribe.unsubscribe();
    }
  }
  // destroy subscription end

}
