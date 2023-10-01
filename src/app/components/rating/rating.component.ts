import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

/* tslint:disable */ 
@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss'],
})
export class RatingComponent implements OnInit {

  @Input() rating: any;
  @Input() itemId: any;
  @Output() ratingClick: EventEmitter<any> = new EventEmitter<any>();

  inputName: any;
  ngOnInit() {
    this.inputName = this.itemId + '_rating';
  }
  onClick(rating: number): void {
    console.log('rating component itemId >>>>>>>>>>', this.itemId);
    console.log('rating component rating >>>>>>>>>>', rating);
    this.rating = rating;
    this.ratingClick.emit({
      itemId: this.itemId,
      rating: rating
    });
  }

}
