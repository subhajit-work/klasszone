import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CommonUtils } from 'src/app/services/common-utils/common-utils';
import { environment } from 'src/environments/environment';
import { IonicSlides } from '@ionic/angular';
import { register } from 'swiper/element/bundle';
import { ActivatedRoute, Router } from '@angular/router';
import moment from 'moment';
import { NgForm } from '@angular/forms';
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
  userData:any;
  private formSubmitSubscribe: Subscription | undefined;
  form_api: any;

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
  parms_board:any;
  parms_subject:any;
  courseType:any;
  userType:any;

  constructor(
    private http : HttpClient,
    private router: Router,
    private authService : AuthService,
    private commonUtils: CommonUtils,
    private activatedRoute : ActivatedRoute,
  ) { }

  ngOnInit() {
    this.parms_tutor = this.activatedRoute.snapshot.paramMap.get('tutor');
    this.parms_category = this.activatedRoute.snapshot.paramMap.get('category');
    this.parms_course = this.activatedRoute.snapshot.paramMap.get('course');
    this.parms_board = this.activatedRoute.snapshot.paramMap.get('board');
    this.parms_subject = this.activatedRoute.snapshot.paramMap.get('subject');
    console.log(this.parms_board, '/', this.parms_subject);
    
    this.courseType = 'individual';

    this.teacherProfile_url = '/'+this.parms_tutor+'/'+this.parms_category+'/'+this.parms_course;
    if (this.parms_board !== 'null' && this.parms_subject !== 'null') {
      this.teacherProfile_url = this.teacherProfile_url + '/' +this.parms_board + '/' +this.parms_subject;
    }else if (this.parms_subject !== 'null') {
      this.teacherProfile_url = this.teacherProfile_url + '/' +this.parms_subject;
    }
    this.teacherProfileDetails(); 

    
    this.userType = localStorage.getItem('user_type');

    this.form_api = 'book_tutor';

    // user details
    this.commonUtils.userInfoDataObservable.subscribe(res =>{
      console.log('userInfoDataObservable res>>>>>>>>>>>>>>>>>>>.. >', res);
      this.userData = res;
    })
  }

  courseChanged(e: any) {
    this.courseType = e.detail.value;
    console.log('courseType', this.courseType);
    this.numberOfClass = 0;
    this.payFee = 0;
    this.teacherProfileDetails();
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
    this.calculateIndividualSummary();
  }
  /* selectSlot end */

  /* Select group class start */
  chooseGroupClass(ev:any) {
    console.log('Current value:', ev.target.value);
    for (let i = 0; i < this.teacherProfileData?.tutor_batch_courses.length; i++) {
      if (this.teacherProfileData?.tutor_batch_courses[i].id == ev.target.value.id) {
        
        this.numberOfClass = 4*this.classSlots[i].length;
        this.payFee = ev.target.value.increased_fee * this.numberOfClass;
      }
      
    }
  }
  /* Select group class end */

  /* Calculate summary start */
  numberOfClass = 0;
  payFee = 0;
  calculateIndividualSummary(){
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
    this.teacherProfileDataSubscribe = this.http.get('tutor_profile'+this.teacherProfile_url).subscribe(
      (res:any) => {
        this.teacherProfileData = res.return_data;
        this.tutorDetails = res.return_data.tutor_details[0];
        console.log('this.teacherProfileList', this.teacherProfileData);

        this.tutorAge = moment().diff(this.tutorDetails.dob, 'years');
        let exp_cbse:number = +this.tutorDetails?.exp_cbse;
        let exp_icse:number = +this.tutorDetails?.exp_icse;
        this.tutorExp = exp_cbse + exp_icse;
        
        // start class slot
        if (this.courseType == 'individual') {
          this.classSlots = [];
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
        }else {
          this.classSlots = [];
          for (let item = 0; item < res.return_data.tutor_batch_courses.length; item++) {
            let courseTiming:any = [];
            for (let i = 0; i < res.return_data.tutor_batch_courses[item].course_timing.length; i++) {
              
              if (res.return_data.tutor_batch_courses[item].course_timing[i].timing) {
                courseTiming.push(res.return_data.tutor_batch_courses[item].course_timing[i]);
                for (let j = 0; j < courseTiming.length; j++) {
                  for (let k = 0; k < courseTiming[j].timing.length; k++) {
                    Object.assign(courseTiming[j].timing[k], {"checked": false});
                  }
                }
              }
            }
            this.classSlots.push(courseTiming);
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

  /* ========= datepicker start ======= */
  datePickerObj: any = {
    dateFormat: 'YYYY-MM-DD', // default DD MMM YYYY
    closeOnSelect: true,
    yearInAscending: true
  }
  /* datepicker end */

  /* schedule class start */
  classStartDate:any;
  scheduleClass(form: NgForm){
    console.log("add form submit >", form.value);

    let course_booked_timing:any = [];
    if (this.courseType == 'individual') {
      for (let i = 0; i < this.classSlots.length; i++) {
        for (let j = 0; j < this.classSlots[i].timing.length; j++) {
          if (this.classSlots[i].timing[j].checked == true) {
            course_booked_timing.push(this.classSlots[i].timing[j].id)
          }
        }
        
      }
    }else {
      for (let i = 0; i < form.value.classSlot.length; i++) {
        for (let j = 0; j < form.value.classSlot[i].timing.length; j++) {
          if (form.value.classSlot[i].timing[j].checked == true) {
            course_booked_timing.push(form.value.classSlot[i].timing[j].id)
          }
        }
        
      }
    }
    
    
    let fd = new FormData();
    for (let val in form.value) {
      if (form.value[val] == undefined) {
        form.value[val] = '';
      }
      fd.append(val, form.value[val]);
    };

    console.log('course_booked_timing', course_booked_timing);
    

    fd.append('course_link', '/tutor-profile'+this.teacherProfile_url);
    fd.append('user_type', this.userType);
    fd.append('user_id', this.userData.user_data.user_id);
    fd.append('course_booked_timing', course_booked_timing);

    console.log('value >', fd);

    this.formSubmitSubscribe = this.http.post(this.form_api, fd).subscribe(
      (response: any) => {

        console.log("add form response >", response);
        if (response.return_status > 0) {
          this.commonUtils.presentToast('success', response.return_message);
        }else {
          this.commonUtils.presentToast('error', response.return_message);
          // this.router.navigateByUrl(response.redirect_url);
        }
        
      },
      errRes => {
      }
    );
  }
  /* schedule class end */

}
