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
  courseType:any;

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

    this.courseType = 'onetoone';

    // user details
    this.commonUtils.userInfoDataObservable.subscribe(res =>{
      console.log('userInfoDataObservable res>>>>>>>>>>>>>>>>>>>.. >', res);
      this.userData = res;
    })
  }

  courseChanged(e: any) {
    this.courseType = e.detail.value;
    console.log('courseType', this.courseType);
  }

  /* selectSlot start */
  selectSlot(_day:any, _time:any) {
    console.log('_day>', _day ,'_time>', _time);
    if (this.classSlots[_day].timing[_time].checked == false) {
      for (let k = 0; k < this.classSlots[_day].timing.length; k++) {
        this.classSlots[_day].timing[k].checked = false;
      }
      this.classSlots[_day].timing[_time].checked = true;
    }else if (this.classSlots[_day].timing[_time].checked == true)  {
      this.classSlots[_day].timing[_time].checked = false;
    }
    console.log('this.classSlots', this.classSlots);
    this.calculateSummary();
  }
  /* selectSlot end */

  /* Calculate summary start */
  numberOfClass = 0;
  payFee = 0;
  calculateSummary(){
    let selectedSlot = 0;
    for (let i = 0; i < this.classSlots.length; i++) {
      for (let j = 0; j < this.classSlots[i].timing.length; j++) {
        if (this.classSlots[i].timing[j].checked == true) {
          selectedSlot = selectedSlot + 1;
        }
      }
      
    }
    console.log('selectedSlot', selectedSlot);
    this.numberOfClass = 4*selectedSlot;
    this.payFee = this.teacherProfileData?.tutor_individual_courses?.increased_fee * this.numberOfClass;
  }
  /* Calculate summary end */

  /* Klasscoin package start */
  classSlots:any = [];
  teacherProfileDetails(){
    this.teacherProfileDataSubscribe = this.http.get('tutor_profile/geetha-g/academic-classes/class-12-tuition/cbse/physics12').subscribe(
      (res:any) => {
        this.teacherProfileData = res.return_data;
        this.tutorDetails = res.return_data.tutor_details[0];
        console.log('this.teacherProfileList', this.teacherProfileData);

        this.tutorAge = moment().diff(this.tutorDetails.dob, 'years');
        let exp_cbse:number = +this.tutorDetails?.exp_cbse;
        let exp_icse:number = +this.tutorDetails?.exp_icse;
        this.tutorExp = exp_cbse + exp_icse;
        
        // start class slot
        for (let i = 0; i < res.return_data?.tutor_individual_courses?.course_timing.length; i++) {
          if (res.return_data?.tutor_individual_courses?.course_timing[i].timing) {
            this.classSlots.push(res.return_data?.tutor_individual_courses?.course_timing[i]);
            for (let j = 0; j < this.classSlots.length; j++) {
              for (let k = 0; k < this.classSlots[j].timing.length; k++) {
                Object.assign(this.classSlots[j].timing[k], {"checked": false});
              }
            }   
          }
        }
        // end class slot
        console.log('this.classSlots', this.classSlots);
      },
      errRes => {
      }
    );
  }
  /* Klasscoin package end */


}
