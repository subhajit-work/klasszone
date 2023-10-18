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
  selector: 'app-credits-transactions-history',
  templateUrl: './credits-transactions-history.page.html',
  styleUrls: ['./credits-transactions-history.page.scss'],
})

export class CreditsTransactionsHistoryPage  implements OnInit {
  api_url = environment.apiUrl;
  file_url = environment.fileUrl;

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  parms_type:any;
  parms_id:any;

  private userDetailsSubscribe: Subscription | undefined;
  userData:any;
  model: any = {};

  private ViewDataSubscribe: Subscription | undefined;
  View_url:any;
  ViewData:any;

  userType:any;

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
    this.parms_type = this.activatedRoute.snapshot.paramMap.get('type');
    this.parms_id = this.activatedRoute.snapshot.paramMap.get('id');
    console.log('parms_type', this.parms_type);
    console.log('parms_id', this.parms_id);

    this.userType = localStorage.getItem('user_type');

    if (this.userType == 'tutor') {
      this.profileSideMenuData = profileMenuData.tutorMenuData;
    }else {
      this.profileSideMenuData = profileMenuData.studentMenuData;
    }

    if (this.parms_type == 'transactions') {
      this.View_url = 'credits_transactions_history/read/'+this.parms_id;
      this.getView();
    }else if (this.parms_type == 'reviews') {
      this.View_url = 'tutor_user_reviews/read/'+this.parms_id;
      this.getView();
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
          
          
        }
        
      },
      errRes => {
      }
      );
  }
  /* User detasils get end */

  /* getView start */
  getView(){
    this.ViewDataSubscribe = this.http.get(this.View_url).subscribe(
      (res:any) => {
        this.ViewData = res.return_data[0];

        console.log('this.ViewData', this.ViewData);
      },
      errRes => {
      }
    );
  }
  /* getView end */

  // ----------- destroy subscription start ---------
  ngOnDestroy() {
    if(this.userDetailsSubscribe !== undefined){
      this.userDetailsSubscribe.unsubscribe();
    }  
    if (this.ViewDataSubscribe !== undefined) {
      this.ViewDataSubscribe.unsubscribe();
    } 
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
  // destroy subscription end
}