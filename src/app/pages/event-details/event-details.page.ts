import { MediaMatcher } from '@angular/cdk/layout';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CommonUtils } from 'src/app/services/common-utils/common-utils';
import { environment } from 'src/environments/environment';
import profileMenuData from 'src/app/services/profilemenu.json';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.page.html',
  styleUrls: ['./event-details.page.scss'],
})

export class EventDetailsPage implements OnInit {
  api_url = environment.apiUrl;
  file_url = environment.fileUrl;

  parms_slug:any;

  private userDetailsSubscribe: Subscription | undefined;
  userData:any;
  model: any = {};

  private eventViewDataSubscribe: Subscription | undefined;
  eventView_url:any;
  eventViewData:any;

  userType:any;

  constructor(
    changeDetectorRef: ChangeDetectorRef, 
    media: MediaMatcher,
    private commonUtils: CommonUtils,
    private http : HttpClient,
    private activatedRoute : ActivatedRoute,
    private authService : AuthService,
  ) {}

  ngOnInit() {
    this.parms_slug = this.activatedRoute.snapshot.paramMap.get('slug');
    console.log('parms_slug', this.parms_slug);

    this.userType = localStorage.getItem('user_type');

    this.eventView_url = 'event_details/'+this.parms_slug;
    this.getEventView();

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

  /* getEventView start */
  getEventView(){
    this.eventViewDataSubscribe = this.http.get(this.eventView_url).subscribe(
      (res:any) => {
        this.eventViewData = res.return_data;
        console.log('eventViewData', this.eventViewData);
        
      },
      errRes => {
      }
    );
  }
  /* getEventView end */

  // ----------- destroy subscription start ---------
  ngOnDestroy() {
    if(this.userDetailsSubscribe !== undefined){
      this.userDetailsSubscribe.unsubscribe();
    }  
    if (this.eventViewDataSubscribe !== undefined) {
      this.eventViewDataSubscribe.unsubscribe();
    }
  }
  // destroy subscription end
}