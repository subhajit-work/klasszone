import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { ToastController } from '@ionic/angular';


/* tslint:disable */ 
@Injectable({
    providedIn: 'root'
})
export class CommonUtils {
    
    constructor( 
        private http : HttpClient,
        private toastController : ToastController
    ) { }

    //----------- signin check start ------------
        private _signinCheck = new BehaviorSubject(null);

        get signinCheckObservable(){
            return this._signinCheck.asObservable();
        }

        onClicksigninCheck(data:any){
            this._signinCheck.next(data);
        }
    // signin check end

    //---------user info data fetch start ---------------
        private _signinUserInfoData = new BehaviorSubject([]);

        get userInfoDataObservable(){
            return this._signinUserInfoData.asObservable();
        }

        getUserInfoService(data:any){
            this._signinUserInfoData.next(data);
        }
    // cuser info data fetch end

    //--------- common header/footre/variable data fetch start ---------------
        private _commondata = new BehaviorSubject([]);

        get commonDataobservable(){
            return this._commondata.asObservable();
        }

        getCommonDataService(path:any){
            this._commondata.next(path);
        }
    // common header/footre/variable data fetch end

    //----------- site inforamation  start ------------
        private _siteInfoCheck = new BehaviorSubject(null);

        get getSiteInfoObservable(){
            return this._siteInfoCheck.asObservable();
        }

        setSiteInfo(type:any){
            // console.log('setSiteInfo SERVICE >>>>>>>>',type);
            this._siteInfoCheck.next(type);
        }
    // site inforamation  end

    //----------- user type start ------------
    private _userTypeCheck = new BehaviorSubject(null);

        get getUserTypeObservable(){
            return this._userTypeCheck.asObservable();
        }

        setUserType(type:any){
            this._userTypeCheck.next(type);
        }
    // user type end

    //--------- menu permission fetch start ---------------
        private _menuPermission = new BehaviorSubject([]);
        get menuPermissionObservable(){
            return this._menuPermission.asObservable();
        }
        menuPermissionService(data:any){
            this._menuPermission.next(data);
        }
    // menu permission fetch end

    // -----get url name all component start----
        private _pagepathName = new BehaviorSubject(null);

        get pagePathNameAnywhereObsv(){
            return this._pagepathName.asObservable();
        }

        getPathNameFun(path:any){
            this._pagepathName.next(path);
        }
    // -----get url name all component end----

    // ----add and remove item (+ -) start-----
        //Add more functions
        addToItem = function( items:any ) {
            items.push({});
        };

        //Remove more functions
	    removeToItem= function(index:any, event:any, items:any, action:any, isDefault:any) {
	        event.preventDefault();
	        if(items.length == 1 && isDefault && action == 'edit')
	        return;
	    	//items remove
	        items.splice( index, 1 );
	    };
    // add and remove item (+ -)end


    // ================= display page record start =========================
        displayRecord = '9';
        displayRecords = [
            { id : '1', displayValue: '10'},
            { id : '2', displayValue: '25'},
            { id : '3', displayValue: '50'},
            { id : '4', displayValue: '100'},
            { id : '5', displayValue: '200'}
        ];
    // display page record end

    // ====================== tost message start ==================
    async presentToast(_type:any, msg:any) {
        const toast = await this.toastController.create({
            message: msg,
            animated:true,
            translucent: true,
            duration: 2000,
            cssClass:"my-tost-custom-class" +_type,
        });
        toast.present();
    }
    // tost message end
    
}


