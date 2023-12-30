import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-cms',
  templateUrl: './cms.page.html',
  styleUrls: ['./cms.page.scss'],
})
export class CmsPage implements OnInit {
  api_url = environment.apiUrl;
  file_url = environment.fileUrl;

  private viewPageDataSubscribe: Subscription | undefined;
  parms_action_name:any;
  listing_view_url:any;
  viewLoadData:any;
  viewData:any;

  constructor(
    private http : HttpClient,
    private activatedRoute : ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.parms_action_name = this.activatedRoute.snapshot.paramMap.get('action');
    console.log('this.parms_action_name CMS >>>>>>>>>>>>>>', this.parms_action_name);
    
    // view page url name
    this.listing_view_url = 'cms_pages/'+this.parms_action_name;
    this.viewPageData();
  }

  // ================== view data fetch start =====================
  viewPageData(){
    this.viewLoadData = true;
    this.viewPageDataSubscribe = this.http.get(this.listing_view_url).subscribe(
      (res:any) => {
        this.viewLoadData = false;
        console.log("view data  res cms -------------------->", res.return_data);
        if(res.return_status > 0){
          this.viewData = res.return_data;
          console.log("view data  res cmsssssssssss inner -------------------->", this.viewData);
        }
      },
      errRes => {
        this.viewLoadData = false;
      }
    );
  }
  // view data fetch end

  // ----------- destroy subscription start ---------
  ngOnDestroy() {
    if(this.viewPageDataSubscribe !== undefined){
      this.viewPageDataSubscribe.unsubscribe();
    }
  }
  // destroy subscription end

}
