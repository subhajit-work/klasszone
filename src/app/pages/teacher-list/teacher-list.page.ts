import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-teacher-list',
  templateUrl: './teacher-list.page.html',
  styleUrls: ['./teacher-list.page.scss'],
})

export class TeacherListPage implements OnInit {
  model: any = {};
  parms_class:any;
  parms_department:any;
  private departmentDataSubscribe: Subscription | undefined;
  departmentLoadData:any;
  department_url:any;
  departmentAllData:any;

  private teacherDataSubscribe: Subscription | undefined;
  teacherLoadData:any;
  teacher_url:any;
  teacherAllData:any;

  private classDataSubscribe: Subscription | undefined;
  classLoadData:any;
  class_url:any;
  classAllData:any;

  private boardDataSubscribe: Subscription | undefined;
  boardLoadData:any;
  board_url:any;
  boardAllData:any;

  private subjectDataSubscribe: Subscription | undefined;
  subjectLoadData:any;
  subject_url:any;
  subjectAllData:any;

  private tutorDataSubscribe: Subscription | undefined;
  tutorLoadData:any;
  tutor_url:any;
  tutorAllData:any;

  constructor(
    private menuCtrl: MenuController,
    private activatedRoute : ActivatedRoute,
    private http : HttpClient,
  ) { }

  ngOnInit() {
    this.parms_department = this.activatedRoute.snapshot.paramMap.get('department');
    this.parms_class = this.activatedRoute.snapshot.paramMap.get('class');
    console.log('parms_department', this.parms_department);
    console.log('parms_class', this.parms_class);
    this. onPageLoadFilter();

    this.department_url = 'fetch_categories';
    this.departmentData();
    this.model = {
      afternoon: false,
      batch: false,
      between500: false,
      between1000: false,
      between2000: false,
      discount10: false,
      discount20: false,
      discount30: false,
      discount40: false,
      discount50: false,
      evening: false,
      individual: false,
      morning: false,
      under500: false,
      price: '',
      star: '',
      hour: '',
      interacted: '',
      sort: ''
    }
  }

  /* --------onSubmitFilter start-------- */
  onSubmitFilter(form: NgForm){
    console.log("onSubmitFilter >", form.value);
    if (form.value.department) {
      this.teacher_url = "all_courses/"+form.value.department.slug;
    }
    if (form.value.class) {
      this.teacher_url = "all_courses/"+form.value.department.slug+"/"+form.value.class.slug;
    } 
    if (form.value.board) {
      this.teacher_url = "all_courses/"+form.value.department.slug+"/"+form.value.class.slug+"/"+form.value.board.slug
    }
    if (form.value.categories) {
      this.teacher_url = "all_courses/"+form.value.department.slug+"/"+form.value.class.slug+"/"+form.value.board.slug+"/"+form.value.categories.slug
    }
    if (form.value.tutor) {
      this.teacher_url = "all_courses/"+form.value.department.slug+"/"+form.value.class.slug+"/"+form.value.board.slug+"/"+form.value.categories.slug+"/"+form.value.tutor.slug
    }
    
    
    this.teacherDataSubscribe = this.http.get(this.teacher_url).subscribe(
      (res:any) => {
        this.teacherLoadData = false;
        this.teacherAllData = res.return_data;

        console.log('this.teacherAllData', this.teacherAllData);
      },
      errRes => {
        this.teacherLoadData = false;
      }
    );

  }
  onPageLoadFilter(){
    console.log('model>>>', this.model);
    
    this.teacher_url = "all_courses/"+this.parms_department+"/"+this.parms_class;
    
    this.teacherDataSubscribe = this.http.get(this.teacher_url).subscribe(
      (res:any) => {
        this.teacherLoadData = false;
        this.teacherAllData = res.return_data;

        console.log('this.teacherAllData', this.teacherAllData);
      },
      errRes => {
        this.teacherLoadData = false;
      }
    );

  }
  onFilterTeacher(_value:any, _identifier:any){
    console.log('_value', _value);
    console.log('_identifier', _identifier);
    setTimeout(() => {
      let modeClass:any;
      let avgReview:any;
      let price:any;
      let discount:any;
      let classAvailiability:any;
      let hour:any;
      let interacted:any;
      let sort:any;
      console.log('Model>>', this.model);
      // clas
      if (this.model.individual == true && this.model.batch == true ){
        modeClass = 'type[]=individual&type[]=batch';
      }else if (this.model.individual == true && this.model.batch == false ){
        modeClass = 'type[]=individual';
      }else if (this.model.individual == false && this.model.batch == true ){
        modeClass = 'type[]=&type[]=batch';
        console.log('modeClass<<>>', modeClass);
      }else if (this.model.individual == false && this.model.batch == false ){
        modeClass = '';
      }
      // review
      if (this.model.star){
        avgReview = '&review[]='+this.model.star;
      }else {
        avgReview = '';
      }

      // price
      if (this.model.under500 == true && this.model.between500 == true && this.model.between1000 == true && this.model.between2000 == true){
        price = '&fee[]=fee-under-500&fee[]=fee-between-500-1000&fee[]=fee-between-1000-2000&fee[]=fee-between-2000-3000';
      }else if (this.model.under500 == true && this.model.between500 == true && this.model.between1000 == true && this.model.between2000 == false){
        price = '&fee[]=fee-under-500&fee[]=fee-between-500-1000&fee[]=fee-between-1000-2000';
      }else if (this.model.under500 == true && this.model.between500 == true && this.model.between1000 == false && this.model.between2000 == false){
        price = '&fee[]=fee-under-500&fee[]=fee-between-500-1000';
      }else if (this.model.under500 == true && this.model.between500 == false && this.model.between1000 == false && this.model.between2000 == false){
        price = '&fee[]=fee-under-500';
      }else if (this.model.under500 == false && this.model.between500 == false && this.model.between1000 == false && this.model.between2000 == false){
        price = '';
      }

      // discount
      if (this.model.discount10 == true && this.model.discount20 == true && this.model.discount30 == true && this.model.discount40 == true && this.model.discount50 == true){
        discount = '&discount[]=1&discount[]=2&discount[]=3&discount[]=4&discount[]=5';
      }else if (this.model.discount10 == true && this.model.discount20 == true && this.model.discount30 == true && this.model.discount40 == true && this.model.discount50 == false){
        discount = '&discount[]=1&discount[]=2&discount[]=3&discount[]=4';
      }else if (this.model.discount10 == true && this.model.discount20 == true && this.model.discount30 == true && this.model.discount40 == false && this.model.discount50 == false){
        discount = '&discount[]=1&discount[]=2&discount[]=3';
      }else if (this.model.discount10 == true && this.model.discount20 == true && this.model.discount30 == false && this.model.discount40 == false && this.model.discount50 == false){
        discount = '&discount[]=1&discount[]=2';
      }else if (this.model.discount10 == true && this.model.discount20 == false && this.model.discount30 == false && this.model.discount40 == false && this.model.discount50 == false){
        discount = '&discount[]=1';
      }else if (this.model.discount10 == false && this.model.discount20 == false && this.model.discount30 == false && this.model.discount40 == false && this.model.discount50 == false){
        discount = '';
      }

      // classAvailiability
      if (this.model.morning == true && this.model.afternoon == true && this.model.evening == true){
        classAvailiability = '&availiability[]=1&availiability[]=2&availiability[]=3';
      }else if (this.model.morning == true && this.model.afternoon == true && this.model.evening == false){
        classAvailiability = '&availiability[]=1&availiability[]=2';
      }else if (this.model.morning == true && this.model.afternoon == false && this.model.evening == false){
        classAvailiability = '&availiability[]=1';
      }else if (this.model.morning == false && this.model.afternoon == false && this.model.evening == false){
        classAvailiability = '';
      }

      // hour
      if (this.model.hour == 'low-to-high'){
        hour = '&lesson_hour_sort='+this.model.hour;
      }else {
        hour = '';
      }

      // interacted
      if (this.model.interacted == 'low-to-high'){
        interacted = '&student_interacted_sort='+this.model.interacted;
      }else {
        interacted = '';
      }

      // sort
      if (this.model.price == 'low-to-high'){
        sort = '&fee_sort='+this.model.price;
      }else {
        sort = '';
      }
      
      
      let maiApi = modeClass+avgReview+price+discount+classAvailiability+hour+interacted+sort;
      console.log('maiApi<<>>', maiApi);
    }, 500);
    
    
  }
  /* --------onSubmitFilter end-------- */

  /* --------Department start-------- */
  departmentData(){
    this.departmentLoadData = true;
    this.departmentDataSubscribe = this.http.get(this.department_url).subscribe(
      (res:any) => {
        this.departmentLoadData = false;
        this.departmentAllData = res.return_data;

        console.log('this.departmentAllData', this.departmentAllData);
        for (let i = 0; i < this.departmentAllData.length; i++) {
          if (this.departmentAllData[i].slug == this.parms_department) {
            this.model.department = this.departmentAllData[i];
            console.log('this.model.department',this.model.department);
            this.classData();
          }
        }
      },
      errRes => {
        this.departmentLoadData = false;
      }
    );
  }
  onChangeDepartment(event:any) {
    console.log(event?.detail?.value);
    this.classData();
  }
  /* Department end */

  /* --------Class start-------- */
  classData(){
    this.classLoadData = true;
    this.classDataSubscribe = this.http.get('fetch_sub_categories_using_categories?selected_categories='+ this.model.department.id).subscribe(
      (res:any) => {
        this.classLoadData = false;
        this.classAllData = res.return_data;

        console.log('this.classAllData', this.classAllData);

        for (let i = 0; i < this.classAllData.length; i++) {
          if (this.classAllData[i].slug == this.parms_class) {
            this.model.class = this.classAllData[i];
            console.log('this.model.class',this.model.class);
            this.boardData();
          }
        }
      },
      errRes => {
        this.classLoadData = false;
      }
    );
  }
  onChangeClass(event:any) {
    console.log(event?.detail?.value);
    this.boardData();
  }
  /* Class end */

  /* --------board start-------- */
  boardData(){
    this.boardLoadData = true;
    this.boardDataSubscribe = this.http.get('fetch_sub_subcategories_using_sub_categories?selected_categories='+this.model.department.id+'&selected_sub_categories='+ this.model.class.id).subscribe(
      (res:any) => {
        this.boardLoadData = false;
        this.boardAllData = res.return_data;

        console.log('this.boardAllData', this.boardAllData);
      },
      errRes => {
        this.boardLoadData = false;
      }
    );
  }
  onChangeBoard(event:any) {
    console.log(event?.detail?.value);
    this.subject_url = 'fetch_courses_using_sub_subcategories?selected_categories='+this.model.department.id+'&selected_sub_categories='+this.model.class.id+'&selected_sub_subcategories='+event?.detail?.value?.id;
    this.subjectData();
  }
  /* board end */

  /* --------subject start-------- */
  subjectData(){
    this.subjectLoadData = true;
    this.subjectDataSubscribe = this.http.get(this.subject_url).subscribe(
      (res:any) => {
        this.subjectLoadData = false;
        this.subjectAllData = res.return_data;

        console.log('this.subjectAllData', this.subjectAllData);
      },
      errRes => {
        this.subjectLoadData = false;
      }
    );
  }
  onChangeSubject(event:any) {
    console.log(event?.detail?.value);

    this.tutor_url = 'fetch_tutor_courses_using_sub_subcategories?selected_categories='+this.model.department.id+'&selected_sub_categories='+this.model.class.id+'&selected_sub_subcategories='+this.model.board.id+'&selected_course_id='+event?.detail?.value?.id;
    this.tutorData();
  }
  /* subject end */

  /* --------Tutor start-------- */
  tutorData(){
    this.tutorLoadData = true;
    this.tutorDataSubscribe = this.http.get(this.tutor_url).subscribe(
      (res:any) => {
        this.tutorLoadData = false;
        this.tutorAllData = res.return_data.class_availiability;

        console.log('this.tutorAllData', this.tutorAllData);
      },
      errRes => {
        this.tutorLoadData = false;
      }
    );
  }
  onChangetutor(event:any) {
    console.log(event?.detail?.value);
  }
  /* tutor end */

  menuOpen = false;
  openFilterMenu() {
    console.log('filter menu');
    if (this.menuOpen) {
      this.menuCtrl.close('filterMenu');
      this.menuOpen = false;
    }else {
      this.menuCtrl.open('filterMenu');
      this.menuOpen = true;
    }
    
  }

  // ----------- destroy subscription start ---------
  ngOnDestroy() {
    if(this.departmentDataSubscribe !== undefined){
      this.departmentDataSubscribe.unsubscribe();
    }
    if(this.classDataSubscribe !== undefined){
      this.classDataSubscribe.unsubscribe();
    }
    if(this.boardDataSubscribe !== undefined){
      this.boardDataSubscribe.unsubscribe();
    }
    if(this.subjectDataSubscribe !== undefined){
      this.subjectDataSubscribe.unsubscribe();
    }
    if(this.tutorDataSubscribe !== undefined){
      this.tutorDataSubscribe.unsubscribe();
    }
    if(this.teacherDataSubscribe !== undefined){
      this.teacherDataSubscribe.unsubscribe();
    }
  }
  // destroy subscription end

}