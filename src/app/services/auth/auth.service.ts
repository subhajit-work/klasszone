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
          if(!storData || !storData.token){
            return null;
          }
          const storeauth:any = {
            'token': storData.token,
            'username': storData.username,
            'uid': storData.uid,
            'authority': storData.authority,
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
    // ---setGlobalParams function defination----
    private setGlobalParams(resData:any){
      localStorage.setItem('userdata', resData.authority);
      if(resData.status > 200){
        this.commonUtils.presentToast('success', resData.message);
      }
      this._globalparamsData.next(null); 
      this.storeAuthData(resData);
    }
    //--- storeAuthData function defination---
    private storeAuthData(_data:any) {
      // console.log('data>>>>>>>>>>>>>>>>>>>>>>>>', _data);
      // set stroage data
      this.storage.set('setStroageGlobalParamsData',  {
        'token': _data.token,
        'username': _data.username,
        'uid': _data.uid,
        'authority': _data.authority,
      });
      
      // Plugins.Storage.set({ key: 'authData', value: data });
    }
  //login service call end

  //======================= logout functionlity start ==============
    logout() {
      this.storage.clear().then(() => {
        // console.log('all stroage data cleared');
        
        // this.router.navigateByUrl('/auth');
        
        // .then(() => {
          window.location.reload();
        // });

        this._globalparamsData = new BehaviorSubject(null);
        
        /* this.router.routeReuseStrategy.shouldReuseRoute = function () {
          return false;
        }; */

        // location.reload();

        // window.location.replace('/auth');

        // location.reload();
        setTimeout(() => {
          // window.location.reload(); //working
        }, 1000);
         this.commonUtils.presentToast('success',"Logout successfully")

      });
      // this._globalparamsData = null;
    }
  // logout functionlity end
 
}