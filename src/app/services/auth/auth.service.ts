import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { take, map, tap, delay, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { environment } from '../../../environments/environment';
import { Location } from '@angular/common';
import { CommonUtils } from '../common-utils/common-utils';
import { BehaviorSubject, from } from 'rxjs';

 
const API_URL = environment.apiUrl;
// const API_MASTER = environment.apiMaster;

/* tslint:disable */ 
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  // private _globalparamsData = null;
  private _globalparamsData = new BehaviorSubject(null);

  // get token session master as observable
  get globalparamsData(){
    return this._globalparamsData.asObservable();
  }

  // get token session master as a non observable
  public getTokenSessionMaster() {
    return this._globalparamsData.value;
  }

  public userId:any;
  public userType:any;

  constructor(
    private storage: Storage, 
    private plt: Platform,
    private http : HttpClient,
    private router: Router,
    private location: Location,
    private commonUtils: CommonUtils 
  ) { 
  }
 

  //================== auto login start ===================
    autoLogin(){
      
      return from(this.storage.get('setStroageGlobalParamsData')).pipe(
        map(storData => {
          console.log('storData @@@@@@@>>>>>', storData);
          if(!storData){
            return null;
          }else {
            this.userId = storData.id;
            this.userType = storData.user_type
          }
          const storeauth:any = {
            'id': storData.id,
            'user_type': storData.user_type,
          }
          return storeauth;
        }),
        tap(storeauthtication => {
          if (storeauthtication) {
            this._globalparamsData.next(storeauthtication);
          }
        }),
        map(userLog => {
          return !!userLog;  
        })
      );
    }
  // auto login end
  
  // ================= login service call start ==================
    login(_url:any, _data:any) {
      return this.http.post(`${_url}`, _data).pipe(
        tap(this.setGlobalParams.bind(this)) //use for response value send
      );
    }

    /* User details api start */
    userDetails() {
      return this.http.get(`user_dashboard/${this.userId}?user_type=${this.userType}`).pipe(
        // tap(this.setUserGlobalParams.bind(this)) //use for response value send
      );
    }

    // ---setGlobalParams function defination----
    private setGlobalParams(resData:any){
      console.log('resData', resData);

      localStorage.setItem('userId', resData.return_data);
      localStorage.setItem('user_type', resData.user_type);

      
      console.log('userDetails>>',  localStorage.getItem('userId'));
      

      if(resData.status > 200){
        this.commonUtils.presentToast('success', resData.message);
      }
      // this._globalparamsData.next(null); 
      this.storeAuthData(resData);
    }
    //--- storeAuthData function defination---
    private storeAuthData(_data:any) {
      console.log('data>>>>>>>>>>>>>>>>>>>>>>>>', _data);
      // set stroage data
      this.storage.set('setStroageGlobalParamsData',  {
        'id': _data.return_data,
        'user_type': _data.user_type,
      });
      
      // Plugins.Storage.set({ key: 'authData', value: data });
    }
  //login service call end

  //======================= logout functionlity start ==============
  logout() {
    this.storage.clear().then(() => {
      console.log('all stroage data cleared');
      // this.router.navigateByUrl('/auth');

      this._globalparamsData = new BehaviorSubject(null);
      window.location.reload(); //working
      // this.router.navigateByUrl('/auth');
      this.router.navigate(['auth'], {replaceUrl: true});


    });
    // this._globalparamsData = null;
  }
  // logout functionlity end
 
}