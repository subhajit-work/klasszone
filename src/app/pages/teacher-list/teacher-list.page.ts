import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { InfiniteScrollCustomEvent, MenuController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { CommonUtils } from 'src/app/services/common-utils/common-utils';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-teacher-list',
  templateUrl: './teacher-list.page.html',
  styleUrls: ['./teacher-list.page.scss'],
})

export class TeacherListPage implements OnInit {
  api_url = environment.apiUrl;
  file_url = environment.fileUrl;
  
  model: any = {};
  parms_class:any;
  parms_department:any;
  parms_board:any;
  parms_subject:any;
  dropdown_department:any;
  dropdown_class:any;
  dropdown_board:any;
  dropdown_subject:any;


  private departmentDataSubscribe: Subscription | undefined;
  departmentLoadData:any;
  department_url:any;
  departmentAllData:any;

  private teacherDataSubscribe: Subscription | undefined;
  teacherLoadData:any;
  teacher_url:any;
  pageLoad_url:any;
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

  openFilter = false;
  filterEnabled = false;
  noTutors = false;
  panelOpenState: boolean = false;
  pageName:any;
  className:any;
  boardName:any;
  subjectName:any;

  constructor(
    private menuCtrl: MenuController,
    private activatedRoute : ActivatedRoute,
    private http : HttpClient,
    private commonUtils: CommonUtils,
  ) { }

  ngOnInit() {
    this.parms_department = this.activatedRoute.snapshot.paramMap.get('department');
    this.parms_class = this.activatedRoute.snapshot.paramMap.get('class');
    this.parms_board = this.activatedRoute.snapshot.paramMap.get('board');
    this.parms_subject = this.activatedRoute.snapshot.paramMap.get('subject');

    this.pageLoad_url = "all_courses/"+this.parms_department+"/"+this.parms_class;

    if (this.parms_board !== 'null') {
      this.pageLoad_url = this.pageLoad_url + '/'+ this.parms_board;
    }
    if (this.parms_board !== 'null' && this.parms_subject !== 'null') {
      this.pageLoad_url = this.pageLoad_url + '/'+ this.parms_subject;
    }

    console.log('parms_board', this.parms_board);
    console.log('parms_subject', this.parms_subject);
    this.pageName = this.parms_department.replace(/-/g, " ");
    this.className = this.parms_class.replace(/-/g, " ");
    
    this.onPageLoadFilter();

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

  /* mat-expansion-panel open/close */
  togglePanel() {
    console.log('this.panelOpenState', this.panelOpenState);
    
    this.panelOpenState = !this.panelOpenState
  }

  /* --------onSubmitFilter start-------- */
  onSubmitFilter(){
    this.noTutors = false;
    this.pageName = this.dropdown_department.slug.replace(/-/g, " ");
    this.boardName = '';
    this.subjectName = '';
    if (this.dropdown_department) {
      this.teacher_url = "all_courses/"+this.dropdown_department.slug;
    }
    if (this.dropdown_class) {
      this.teacher_url = "all_courses/"+this.dropdown_department.slug+"/"+this.dropdown_class.slug;
    } 
    if (this.dropdown_board) {
      this.boardName = this.dropdown_board.name;
      this.teacher_url = "all_courses/"+this.dropdown_department.slug+"/"+this.dropdown_class.slug+"/"+this.dropdown_board.slug
    }
    if (this.dropdown_subject) {
      this.subjectName = this.dropdown_subject.name;
      this.teacher_url = "all_courses/"+this.dropdown_department.slug+"/"+this.dropdown_class.slug+"/"+this.dropdown_board.slug+"/"+this.dropdown_subject.slug
    }
    
    if (this.openFilter == true) {
      this.filterEnabled = true;
      this.onPageLoadFilter();
    }else {
      this.filterEnabled = false;
      this.teacherDataSubscribe = this.http.get(this.teacher_url).subscribe(
        (res:any) => {
          this.teacherLoadData = false;
          this.teacherAllData = res.return_data;
          
          console.log('this.teacherAllData', this.teacherAllData);
          const allInnerArraysEmpty = this.teacherAllData.courses.every((item: { tutors: string | any[]; }) => item.tutors.length === 0);
  
          if (allInnerArraysEmpty) {
            this.noTutors = true;
          } else {
            this.noTutors = false;
          }
        },
        errRes => {
          this.teacherLoadData = false;
        }
      );
    }
  }
  /* --------onSubmitFilter end-------- */

  /* onPageLoadFilter start */
  offset:any = 0;
  limit:any = 8;
  filterQuery:any = '';
  infiniteTeacherData:any = [];
  onPageLoadFilter(){
    this.noTutors = false;
    console.log('model>>>', this.model);
    
    if (this.filterEnabled) {
      let fd = new FormData();

      fd.append('limit', this.limit);
      fd.append('offset', this.offset);
      fd.append('category_slug', this.parms_department);
      fd.append('sub_category_slug', this.parms_class);
      fd.append('sub_subcategory_slug', this.parms_board);
      fd.append('course_slug', this.parms_subject);
      fd.append('filter_query_string', this.filterQuery);


      this.teacherDataSubscribe = this.http.post('load_more_tutors2', fd).subscribe(
        (res:any) => {
          this.teacherLoadData = false;
          this.infiniteTeacherData = this.infiniteTeacherData.concat(res.return_data.result);
          this.offset = res.return_data.offset;
          this.limit = res.return_data.limit;
          if (res.return_data.result.length == 0) {
            this.commonUtils.presentToast('error', 'No more data available');
          }
        },
        errRes => {
          this.teacherLoadData = false;
        }
      );
    }else {
      this.teacherDataSubscribe = this.http.get(this.pageLoad_url).subscribe(
        (res:any) => {
          this.teacherLoadData = false;
          this.teacherAllData = res.return_data;
          const allInnerArraysEmpty = this.teacherAllData.courses.every((item: { tutors: string | any[]; }) => item.tutors.length === 0);
  
          if (allInnerArraysEmpty) {
            this.noTutors = true;
          } else {
            this.noTutors = false;
          }
        },
        errRes => {
          this.teacherLoadData = false;
        }
      );
    }
    

  }
  /* onPageLoadFilter end */

  /* onFilterTeacher start */
  onFilterTeacher(_value:any, _identifier:any){
    this.pageLoad_url = '';
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
      this.filterQuery = maiApi;
      console.log('maiApi<<>>', maiApi);
      this.pageLoad_url = this.teacher_url+'?'+maiApi;
      this.onPageLoadFilter();
    }, 500);
    
    
  }
  /* onFilterTeacher end */

  /* --------Department start-------- */
  departmentData(){
    this.departmentLoadData = true;
    this.departmentDataSubscribe = this.http.get(this.department_url).subscribe(
      (res:any) => {
        this.departmentLoadData = false;
        this.departmentAllData = res.return_data;
        if (res.return_data.length == 0) {
          this.openFilter = true;
        }else {
          this.openFilter = false;
        }

        console.log('this.departmentAllData', this.departmentAllData);
        for (let i = 0; i < this.departmentAllData.length; i++) {
          if (this.departmentAllData[i].slug == this.parms_department) {
            this.dropdown_department = this.departmentAllData[i];
            console.log('this.dropdown_department',this.dropdown_department);
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

    this.parms_class = '';
    this.parms_department = event?.detail?.value?.slug;
    
    this.dropdown_class = '';
    this.className = '';
    this.dropdown_board = '';
    this.dropdown_subject = '';


    this.classData();
  }
  /* Department end */

  /* --------Class start-------- */
  classData(){
    this.classLoadData = true;
    this.classDataSubscribe = this.http.get('fetch_sub_categories_using_categories?selected_categories='+ this.dropdown_department.id).subscribe(
      (res:any) => {
        this.classLoadData = false;
        this.classAllData = res.return_data;
        if (res.return_data.length == 0) {
          this.openFilter = true;
        }else {
          this.openFilter = false;
        }

        console.log('this.classAllData', this.classAllData);

        for (let i = 0; i < this.classAllData.length; i++) {
          if (this.classAllData[i].slug == this.parms_class) {
            this.dropdown_class = this.classAllData[i];
            console.log('this.dropdown_class',this.dropdown_class);
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
    this.dropdown_board = '';
    this.parms_class = event?.detail?.value?.slug;
    this.className = event?.detail?.value?.name;
    this.dropdown_subject = '';
    this.boardData();
  }
  /* Class end */

  /* --------board start-------- */
  boardData(){
    this.boardLoadData = true;
    this.boardDataSubscribe = this.http.get('fetch_sub_subcategories_using_sub_categories?selected_categories='+this.dropdown_department.id+'&selected_sub_categories='+ this.dropdown_class.id).subscribe(
      (res:any) => {
        this.boardLoadData = false;
        this.boardAllData = res.return_data;
        if (res.return_data.length == 0) {
          this.openFilter = true;
        }else {
          this.openFilter = false;
        }

        console.log('this.boardAllData', this.boardAllData);
      },
      errRes => {
        this.boardLoadData = false;
      }
    );
  }
  onChangeBoard(event:any) {
    console.log(event?.detail?.value);
    this.dropdown_subject = '';
    this.parms_board = event?.detail?.value?.slug;
    this.subject_url = 'fetch_courses_using_sub_subcategories?selected_categories='+this.dropdown_department.id+'&selected_sub_categories='+this.dropdown_class.id+'&selected_sub_subcategories='+event?.detail?.value?.id;
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
        if (res.return_data.length == 0) {
          this.openFilter = true;
        }else {
          this.openFilter = false;
        }

        console.log('this.subjectAllData', this.subjectAllData);
      },
      errRes => {
        this.subjectLoadData = false;
      }
    );
  }
  onChangeSubject(event:any) {
    console.log(event?.detail?.value);
    this.parms_subject = event?.detail?.value?.slug;
    if (event?.detail?.value) {
      this.openFilter = true;
    }else {
      this.openFilter = false;
    }
    
  }
  /* subject end */

  /* Infinite scroll start */
  onIonInfinite(ev:any) {
    console.log('infinite calling...');
    this.onPageLoadFilter();
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }
  /* Infinite scroll end */

  /* page refresher start */
  handleRefresh(event:any) {
    console.log('refresh calling...');
    this.offset = 0;
    this.limit = 8;
    this.filterQuery = '';
    this.infiniteTeacherData = [];
    this.onPageLoadFilter();
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }
  /* page refresher end */

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
    if(this.teacherDataSubscribe !== undefined){
      this.teacherDataSubscribe.unsubscribe();
    }
  }
  // destroy subscription end

}