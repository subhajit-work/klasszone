import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CommonUtils } from 'src/app/services/common-utils/common-utils';
import { environment } from 'src/environments/environment';
import { IonicSlides } from '@ionic/angular';
import { register } from 'swiper/element/bundle';
import { ActivatedRoute } from '@angular/router';
import moment from 'moment';
register();

@Component({
  selector: 'app-teacher-profile',
  templateUrl: './teacher-profile.page.html',
  styleUrls: ['./teacher-profile.page.scss'],
})
export class TeacherProfilePage implements OnInit {
  api_url = environment.apiUrl;
  file_url = environment.fileUrl;
  
  private teacherProfileDataSubscribe: Subscription | undefined;
  teacherProfile_url:any;
  teacherProfileData:any;
  tutorDetails:any;
  tutorAge:any;
  tutorExp:any;
  private userDetailsSubscribe: Subscription | undefined;
  userData:any;

  swiperModules = [IonicSlides];
  @ViewChild('swiper')
  swiperRef: ElementRef | undefined;
  slideOpts = {
    initialSlide: 1,
    speed: 400,
    autoplay: true,
    loop: true,
  };

  parms_tutor:any;
  parms_category:any;
  parms_course:any;

  constructor(
    private http : HttpClient,
    private authService : AuthService,
    private commonUtils: CommonUtils,
    private activatedRoute : ActivatedRoute,
  ) { }

  ngOnInit() {
    this.parms_tutor = this.activatedRoute.snapshot.paramMap.get('tutor');
    this.parms_category = this.activatedRoute.snapshot.paramMap.get('category');
    this.parms_course = this.activatedRoute.snapshot.paramMap.get('course');


    this.teacherProfile_url = 'tutor_profile/'+this.parms_tutor+'/'+this.parms_category+'/'+this.parms_course;
    this.teacherProfileDetails(); 

    // user details
    this.commonUtils.userInfoDataObservable.subscribe(res =>{
      console.log('userInfoDataObservable res>>>>>>>>>>>>>>>>>>>.. >', res);
      this.userData = res;
    })
  }

  /* Klasscoin package start */
  teacherProfileDetails(){
    this.teacherProfileDataSubscribe = this.http.get(this.teacherProfile_url).subscribe(
      (res:any) => {
        this.teacherProfileData = res.return_data;
        this.tutorDetails = res.return_data.tutor_details[0];
        console.log('this.teacherProfileList', this.teacherProfileData);

        this.tutorAge = moment().diff(this.tutorDetails.dob, 'years');
        let exp_cbse:number = +this.tutorDetails?.exp_cbse;
        let exp_icse:number = +this.tutorDetails?.exp_icse;
        this.tutorExp = exp_cbse + exp_icse;
        console.log('this.tutorExp', this.tutorExp);
        
      },
      errRes => {
      }
    );
  }
  /* Klasscoin package end */


}
