import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-class-list',
  templateUrl: './class-list.page.html',
  styleUrls: ['./class-list.page.scss'],
})
export class ClassListPage implements OnInit {
  // server api
  api_url = environment.apiUrl;
  file_url = environment.fileUrl;
  
  viewLoadData:any;
  viewData:any;
  listing_view_url:any;
  private viewPageDataSubscribe: Subscription | undefined;
  model: any = {}
  parms_slug:any;
  pageName:any;

  constructor(
    private http : HttpClient,
    private activatedRoute : ActivatedRoute,
  ) { }

  ngOnInit() {
    this.parms_slug = this.activatedRoute.snapshot.paramMap.get('slug');
    console.log('parms_slug', this.parms_slug);
    this.pageName = this.parms_slug.replace(/-/g, " ");
    
    this.listing_view_url = 'view-all/'+this.parms_slug;
    this.viewPageData();
  }

  // ================== view data fetch start =====================
  viewPageData(){
    console.log('viewPageData', this.http);
    this.viewLoadData = true;
    this.viewPageDataSubscribe = this.http.get(this.listing_view_url).subscribe(
      (res:any) => {
        this.viewLoadData = false;
        this.viewData = res.return_data;

        console.log('this.viewData', this.viewData);
        // if(res.return_status > 0){
        //   this.viewData = res.return_data[this.parms_action_id];
        //   console.log("view data  res cmsssssssssss inner -------------------->", this.viewData);
        // }
      },
      errRes => {
        this.viewLoadData = false;
      }
    );
  }
  // view data fetch end

}
