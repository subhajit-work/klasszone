import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-custom-modal',
  templateUrl: './custom-modal.page.html',
  styleUrls: ['./custom-modal.page.scss'],
})
export class CustomModalPage implements OnInit {
  name: any;

  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss(this.name, 'confirm');
  }

}
