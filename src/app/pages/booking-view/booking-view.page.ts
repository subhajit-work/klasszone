import { MediaMatcher } from '@angular/cdk/layout';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CommonUtils } from 'src/app/services/common-utils/common-utils';
import { environment } from 'src/environments/environment';
import profileMenuData from 'src/app/services/profilemenu.json';

@Component({
  selector: 'app-booking-view',
  templateUrl: './booking-view.page.html',
  styleUrls: ['./booking-view.page.scss'],
})
export class BookingViewPage implements OnInit {
  api_url = environment.apiUrl;
  file_url = environment.fileUrl;

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  parms_status:any;
  parms_page:any;
  parms_id:any;

  private userDetailsSubscribe: Subscription | undefined;
  userData:any;
  model: any = {};

  private bookingViewDataSubscribe: Subscription | undefined;
  bookingView_url:any;
  bookingViewData:any;

  userType:any;
  openMenu:any;
  profileSideMenuData:any;

  constructor(
    changeDetectorRef: ChangeDetectorRef, 
    media: MediaMatcher,
    private commonUtils: CommonUtils,
    private http : HttpClient,
    private activatedRoute : ActivatedRoute,
    private authService : AuthService,
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
   }

  ngOnInit() {
    this.parms_page = this.activatedRoute.snapshot.paramMap.get('page');
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

    /* Toggle open menu start */
    for (let i = 0; i < this.profileSideMenuData.length; i++) {
      if (this.parms_page == this.profileSideMenuData[i].url) {
        this.openMenu = this.profileSideMenuData[i].name;
      }else{
        for (let j = 0; j < this.profileSideMenuData[i].subPages.length; j++) {
          if (this.parms_page == this.profileSideMenuData[i].subPages[j].url) {
            this.openMenu = this.profileSideMenuData[i].name;
          }
        }
      }
    }
    /* Toggle open menu end */

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
          
          if (this.openMenu == 'Class Enrollments' || this.openMenu == 'My Enrolled Classes') {
            if (this.userType == 'student') {
              this.bookingView_url = 'enquiries/read/'+this.parms_id+'?user_id='+this.userData.user_data.id;
              this.getBookingView();
            }else {
              this.bookingView_url = 'student_enquiries/read/'+this.parms_id+'?user_id='+this.userData.user_data.id;
              this.getBookingView();
            }
            
          }else if (this.openMenu == 'Manage Events' || this.openMenu == 'Event Enrollment'){
            if (this.userType == 'tutor') {
              this.bookingView_url = 'tutor_event_enquiries/read/'+this.parms_id+'?user_id='+this.userData.user_data.id;
              this.getBookingView();
            }
          }else {
            this.bookingView_url = 'enquiries/'+this.parms_status+'/read/'+this.parms_id+'?user_id='+this.userData.user_data.id;
            this.getBookingView();
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
