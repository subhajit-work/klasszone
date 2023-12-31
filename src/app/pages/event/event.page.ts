import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { InfiniteScrollCustomEvent, MenuController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { CommonUtils } from 'src/app/services/common-utils/common-utils';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-event',
  templateUrl: './event.page.html',
  styleUrls: ['./event.page.scss'],
})
export class EventPage implements OnInit {
  api_url = environment.apiUrl;
  file_url = environment.fileUrl;
  
  model: any = {};

  parms_department:any;
  private departmentDataSubscribe: Subscription | undefined;
  departmentLoadData:any;
  department_url:any;
  departmentAllData:any;

  private viewPageDataSubscribe: Subscription | undefined;
  parms_action_name:any;
  listing_view_url:any;
  viewLoadData:any = false;
  viewData:any = [];

  constructor(
    private menuCtrl: MenuController,
    private http : HttpClient,
    private commonUtils: CommonUtils,
  ) { }

  ngOnInit() {
    this.department_url = 'fetch_categories';
    this.departmentData();

    this.listing_view_url = 'load_more_events';
    this.viewPageData();
  }

  /* --------Department start-------- */
  departmentData(){
    this.departmentLoadData = true;
    this.departmentDataSubscribe = this.http.get(this.department_url).subscribe(
      (res:any) => {
        this.departmentLoadData = false;
        this.departmentAllData = res.return_data;
        
      },
      errRes => {
        this.departmentLoadData = false;
      }
    );
  }
  courseSlug:any = '';
  onChangeDepartment(event:any) {
    this.courseSlug = ''
    console.log(event?.detail?.value);
    let dropDownData = event?.detail?.value;
    for (let i = 0; i < dropDownData.length; i++) {
      this.courseSlug = this.courseSlug + dropDownData[i]+',';
    }
    console.log('courseSlug', this.courseSlug);
    this.viewData = [];
    this.offset = 0;
    this.limit = 8;
    this.viewPageData();
  }
  /* Department end */

  // ================== view data fetch start =====================
  offset:any = 0;
  limit:any = 8;
 
  viewPageData(){
    this.viewLoadData = true;
    let fd = new FormData();

    fd.append('limit', this.limit);
    fd.append('offset', this.offset);
    fd.append('course_slug', this.courseSlug);


    this.viewPageDataSubscribe = this.http.post(this.listing_view_url, fd).subscribe(
      (res:any) => {
        this.viewLoadData = false;
        
        if(res.return_status > 0){
          this.viewData = this.viewData.concat(res.return_data.result);
          this.offset = res.return_data.offset;
          this.limit = res.return_data.limit;
          if (res.return_data.result.length == 0) {
            this.commonUtils.presentToast('error', 'No more data available');
          }
        }
        console.log("view data  res cms -------------------->", this.viewData);
      },
      errRes => {
        this.viewLoadData = false;
      }
    );
  }
  // view data fetch end

  /* Infinite scroll start */
  onIonInfinite(ev:any) {
    console.log('infinite calling...');
    this.viewPageData();
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }
  /* Infinite scroll end */

  /* page refresher start */
  handleRefresh(event:any) {
    setTimeout(() => {
      this.viewData = [];
      this.offset = 0;
      this.limit = 8;
      this.viewPageData();
      event.target.complete();
    }, 2000);
  }
  /* page refresher end */

  // ----------- destroy subscription start ---------
  ngOnDestroy() {
    if(this.viewPageDataSubscribe !== undefined){
      this.viewPageDataSubscribe.unsubscribe();
    }
    if(this.departmentDataSubscribe !== undefined){
      this.departmentDataSubscribe.unsubscribe();
    }
  }
  // destroy subscription end
}
