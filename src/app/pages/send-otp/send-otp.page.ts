import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-send-otp',
  templateUrl: './send-otp.page.html',
  styleUrls: ['./send-otp.page.scss'],
})
export class SendOtpPage implements OnInit {
  otp: any;
  showOtpComponent = true;
  @ViewChild('ngOtpInput', { static: false}) ngOtpInput: any;
  constructor() { }

  ngOnInit() {
  }

  
  config = {
    allowNumbersOnly: false,
    length: 5,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
    inputStyles: {
      'width': '50px',
      'height': '50px'
    }
  };
  onOtpChange(otp:any) {
    this.otp = otp;
  }

}
