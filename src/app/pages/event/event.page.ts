import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Subscription } from 'rxjs';
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

  constructor(
    private menuCtrl: MenuController,
    private http : HttpClient,
  ) { }

  ngOnInit() {
    this.department_url = 'fetch_categories';
    this.departmentData();
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
  onChangeDepartment(event:any) {
    console.log(event?.detail?.value);

  }
  /* Department end */

}
