import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-big-blue-button',
  templateUrl: './big-blue-button.page.html',
  styleUrls: ['./big-blue-button.page.scss'],
})
export class BigBlueButtonPage implements OnInit {
  big_blue_link:any
  constructor() { }

  ngOnInit() {
    this.big_blue_link = localStorage.getItem('big_blue_link');
    console.log('big_blue_link',this.big_blue_link);
    
  }
  

}
