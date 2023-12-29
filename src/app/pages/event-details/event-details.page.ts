import { MediaMatcher } from '@angular/cdk/layout';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CommonUtils } from 'src/app/services/common-utils/common-utils';
import { environment } from 'src/environments/environment';
import profileMenuData from 'src/app/services/profilemenu.json';
import { AlertController, IonicSlides } from '@ionic/angular';
import moment from 'moment';

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
  private formSubmitSubscribe: Subscription | undefined;
  userType:any;
  userId:any;

  swiperModules = [IonicSlides];
  @ViewChild('swiper')
  swiperRef: ElementRef | undefined;
  slideOpts = {
    initialSlide: 1,
    speed: 400,
    autoplay: true,
    loop: true,
  };

  constructor(
    changeDetectorRef: ChangeDetectorRef, 
    media: MediaMatcher,
    private commonUtils: CommonUtils,
    private http : HttpClient,
    private activatedRoute : ActivatedRoute,
    private authService : AuthService,
    private alertController : AlertController,
    private router: Router,
  ) {}

  ngOnInit() {
    this.parms_slug = this.activatedRoute.snapshot.paramMap.get('slug');
    console.log('parms_slug', this.parms_slug);

    this.userType = localStorage.getItem('user_type');
    this.userId = localStorage.getItem('userId');

    console.log('userId', this.userId);
    
    this.eventView_url = 'event_details/'+this.parms_slug;
    this.getEventView();

    this.userInfoData();
  }

  /* User detasils get start */
  tutorDetails:any;
  userInfoData(){
    let userObs: Observable<any>;
    userObs = this.authService.userDetails();

    this.userDetailsSubscribe = userObs.subscribe(
      resData => {
        console.log('userDetails@@', resData);
        if(resData.return_status > 0){
          this.userData = resData.return_data;
          this.tutorDetails = resData.return_data.user_data;
        }
        
      },
      errRes => {
      }
      );
  }
  /* User detasils get end */

  /* getEventView start */
  tutorAge:any
  getEventView(){
    this.eventViewDataSubscribe = this.http.get(this.eventView_url).subscribe(
      (res:any) => {
        this.eventViewData = res.return_data;
        console.log('eventViewData', this.eventViewData);
        this.tutorAge = moment().diff(this.eventViewData.tutor_details.dob, 'years');
      },
      errRes => {
      }
    );
  }
  /* getEventView end */

  /* bookEvent start */
  bookEvent(){
    let fd = new FormData();

    fd.append('event_id', this.eventViewData.event_details.id);
    fd.append('event_slug', this.eventViewData.event_details.slug);
    fd.append('tutor_id', this.eventViewData.event_details.tutor_id);
    fd.append('tutor_slug', this.eventViewData.tutor_details.slug);
    fd.append('event_link', '/event-details/'+this.eventViewData.event_details.slug);
    fd.append('user_type', this.userType);
    fd.append('user_id', this.userId);

    console.log('value >', fd);

    this.formSubmitSubscribe = this.http.post('book_event', fd).subscribe(
      (response: any) => {

        console.log("add form response >", response);
        if (response.return_status == 1) {
          this.commonUtils.presentToast('success', response.return_message);
        }else if (response.return_status == 2) {
          this.presentAlertConfirm(response.return_message);
          this.router.navigateByUrl(response.redirect_url);
        }else {
          this.commonUtils.presentToast('error', response.return_message);
          // this.router.navigateByUrl(response.redirect_url);
        }
        
      },
      errRes => {
      }
    );
  }
  /* bookEvent end */

  /* Aleart for open big blue button start */
  async presentAlertConfirm(_meetingType:any) {
    const alert = await this.alertController.create({
      header:  'Aleart!',
      message: _meetingType,
      cssClass: 'custom-alert',
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'cancelBtn',
        handler: (blah) => {}
      }, {
        text: 'Okay',
        handler: () => {
          
        }
      }]
    });
  
    await alert.present();
  }
  /* Aleart for open big blue button end */

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