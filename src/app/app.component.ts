import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { App } from '@capacitor/app';
import { AlertController, Platform } from '@ionic/angular';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Inbox', url: '/folder/inbox', icon: 'mail' },
    { title: 'Outbox', url: '/folder/outbox', icon: 'paper-plane' },
    { title: 'Favorites', url: '/folder/favorites', icon: 'heart' },
    { title: 'Archived', url: '/folder/archived', icon: 'archive' },
    { title: 'Trash', url: '/folder/trash', icon: 'trash' },
    { title: 'Spam', url: '/folder/spam', icon: 'warning' },
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  constructor(
    private platform: Platform,
    private router : Router,
    private alertController : AlertController,
  ) {
    this.backButtonEvent();
  }

  // back button start
  backButtonEvent() {
    this.platform.backButton.subscribeWithPriority(-1, () => {
      if (this.router.url === '/auth') {
        this.presentAlertConfirm();
      }
    });
  }

  // exit app aleart start
  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'Exit App',
      message: 'Are you sure you want to exit the app?',
      cssClass: 'custom-alert',
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'cancelBtn',
        handler: (blah) => {}
      }, {
        text: 'Close App',
        handler: () => {
          App.exitApp();
        }
      }]
    });
  
    await alert.present();
  }
}
