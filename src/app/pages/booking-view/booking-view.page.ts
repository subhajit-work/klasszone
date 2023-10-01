import { MediaMatcher } from '@angular/cdk/layout';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CommonUtils } from 'src/app/services/common-utils/common-utils';
import { environment } from 'src/environments/environment';

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
      url: 'buy-bookingViews',
      icon: 'toll',
      subPages : [
        {
          name: 'KlassCoins Packages',
          url: 'bookingViews-packages',
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
      url: 'bookingViews-history',
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

  private bookingViewDataSubscribe: Subscription | undefined;
  bookingView_url:any;
  bookingViewData:any;

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
    // this.commonUtils.userInfoDataObservable.subscribe(res =>{
    //   console.log('userInfoDataObservable res>>>>>>>>>>>>>>>>>>>.. >', res);
    //   this.userData = res;
    // })
    this.parms_status = this.activatedRoute.snapshot.paramMap.get('status');
    this.parms_id = this.activatedRoute.snapshot.paramMap.get('id');
    console.log('parms_status', this.parms_status);
    console.log('parms_id', this.parms_id);

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
          
          if (this.parms_status == 'all') {
            this.bookingView_url = 'enquiries/read/'+this.parms_id+'?user_id='+this.userData.user_data.id;
            this.getBookingView();
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
