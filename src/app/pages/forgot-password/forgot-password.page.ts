import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Platform, ModalController, AlertController, MenuController } from '@ionic/angular';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CommonUtils } from 'src/app/services/common-utils/common-utils';



const API_MASTER = environment.apiMaster;

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})

export class ForgotPasswordPage implements OnInit, OnDestroy {
  constructor(
    public menuCtrl: MenuController,
    private router: Router,
    private http : HttpClient,
    private commonUtils: CommonUtils // common functionlity come here
  ) { }

  // variable declartion section
  model: any = {};
  private formSubmitSubscribe: Subscription | undefined;
  curentDate:any;
  // select checkbox end

//--------------  getlist data fetch start -------------
  transaction_id:any;
  account:any;
  accountList:any;
  lender:any;
  lenderList:any;
  borrower:any;
  borrowerList:any;
  principle:any;
  interest:any;
  setStartdate:any;
  setEnddate:any;
  contact_by_company:any;
  servicesList:any;
  selectLoading:any;
  selectLoadingDepend:any;
  groupList:any;
  form_submit_text = 'Submit';
  form_api:any;
  companyByContact_api:any;
  uploadURL:any;
  interestCycle = '1';
  parms_action_name:any;
  parms_action_id:any;
  actionHeaderText:any;
  toggleShow:any;
  companyList:any;
  countryList:any;
  stateList:any;
  onEditField = 'PUT';

  // ------ init function call start ------

    commonFunction(){

      // get active url name
      this.commonUtils.getPathNameFun(this.router.url.split('/')[1]);

      // form submit api add
      this.form_api = `login`;

      setInterval(() => {
        this.curentDate = new Date();
      }, 1);

      // init call
      this.init();
    }

    // init
    ngOnInit() {
      // menu hide
      this.menuCtrl.enable(false);

    //  this.commonFunction();
    }

    ionViewWillEnter() {
      this.commonFunction();
    }
  // init function call end
  
  // ---------- init start ----------
  init(){
  }
  // ---------- init end ----------

// ======================== form submit start ===================
  clickButtonTypeCheck = '';
  form_submit_text_save = 'Save';
  form_submit_text_save_another = 'Save & Add Another' ;

  // click button type 
  clickButtonType( _buttonType:any ){
    this.clickButtonTypeCheck = _buttonType;
  }

  onSubmitForm(form:NgForm){
    console.log("add form submit >", form.value);
    
    if(this.clickButtonTypeCheck == 'Save'){
      this.form_submit_text_save = 'Submitting';
    }else{
      this.form_submit_text_save_another = 'Submitting';
    }

    this.form_submit_text = 'Submitting';

    // get form value
    let fd = new FormData();
    for (let val in form.value) {
      if(form.value[val] == undefined){
        form.value[val] = '';
      }
      fd.append(val, form.value[val]);
    };

    console.log('value >', fd);

    if(!form.valid){
      return;
    }

    this.formSubmitSubscribe = this.http.post(this.form_api, fd).subscribe(
      (response:any) => {

        if(this.clickButtonTypeCheck == 'Save'){
          this.form_submit_text_save = 'Save';
        }else{
          this.form_submit_text_save_another = 'Save & Add Another';
        }
        this.form_submit_text = '';
        console.log("add form response >", response);

        if(response.return_status > 0){
          // this.commonUtils.presentToast(response.return_message);
          this.commonUtils.presentToast('success', response.return_message);

            this.router.navigateByUrl('/auth');


          // this.notifier.notify( type, 'aa' );
    
          form.reset();
          
        }else{
          this.commonUtils.presentToast('info', response.return_message);
        }
      },
      errRes => {
        if(this.clickButtonTypeCheck == 'Save'){
          this.form_submit_text_save = 'Save';
        }else{
          this.form_submit_text_save_another = 'Save & Add Another';
        }
        this.form_submit_text = '';
      }
    );

  }
// form submit end

// ----------- destroy subscription start ---------
  ngOnDestroy() {
    if(this.formSubmitSubscribe !== undefined){
      this.formSubmitSubscribe.unsubscribe();
    }
  }
// destroy subscription end
}