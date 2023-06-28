import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonicSlides } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { register } from 'swiper/element/bundle';

register();
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  // server api
  api_url = environment.apiUrl;
  file_url = environment.fileUrl;
  
  viewLoadData:any;
  viewData:any;
  listing_view_url:any;
  private viewPageDataSubscribe: Subscription | undefined;

  slideOpts = {
    initialSlide: 1,
    speed: 400,
    autoplay: true,
    loop: true,
  };

  swiperModules = [IonicSlides];
  @ViewChild('swiper')
  swiperRef: ElementRef | undefined;

  constructor(
    private http : HttpClient,
  ) { }

  ngOnInit() {
    this.listing_view_url = 'home-page';
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

  // ----------- destroy subscription start ---------
  ngOnDestroy() {
    if(this.viewPageDataSubscribe !== undefined){
      this.viewPageDataSubscribe.unsubscribe();
    }
  }
// destroy subscription end

}
