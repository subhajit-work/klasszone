import { MediaMatcher } from '@angular/cdk/layout';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CommonUtils } from 'src/app/services/common-utils/common-utils';
import { environment } from 'src/environments/environment';
import profileMenuData from 'src/app/services/profilemenu.json';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-students-group',
  templateUrl: './students-group.page.html',
  styleUrls: ['./students-group.page.scss'],
})

export class StudentsGroupPage implements OnInit {
  api_url = environment.apiUrl;
  file_url = environment.fileUrl;

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  public list_product = new MatTableDataSource<any>([]);  // <-- STEP (1)
    displayedColumns:any;
    @ViewChild(MatPaginator)
  private paginator!: MatPaginator;  // <-- STEP (3)

  parms_id:any;

  private userDetailsSubscribe: Subscription | undefined;
  userData:any;
  model: any = {};

  private bookingViewDataSubscribe: Subscription | undefined;
  bookingView_url:any;
  bookingViewData:any;

  userType:any;

  profileSideMenuData:any;
  tableData:any = [];

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
    this.parms_id = this.activatedRoute.snapshot.paramMap.get('id');
    console.log('parms_id', this.parms_id);

    this.userType = localStorage.getItem('user_type');

    if (this.userType == 'tutor') {
      this.profileSideMenuData = profileMenuData.tutorMenuData;
    }else {
      this.profileSideMenuData = profileMenuData.studentMenuData;
    }
    this.displayedColumns = ['s30a811f6','course_title', 'duration', 'fee', 'type','start_date', 'status'];
    this.list_product.paginator = this.paginator;
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
          
          this.bookingView_url = 'student_course_enquiries/course/'+this.parms_id+'?user_id='+this.userData.user_data.id;
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
    this.bookingViewDataSubscribe = this.http.get(this.bookingView_url).subscribe(
      (res:any) => {
        // this.bookingViewData = res.return_data[0];
        this.tableData = res.return_data;
        this.list_product.data = res.return_data
        // console.log('this.bookingViewData', this.bookingViewData);
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