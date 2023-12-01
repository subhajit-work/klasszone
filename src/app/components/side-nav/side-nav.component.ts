import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { MenuController, NavController } from '@ionic/angular';
import profileMenuData from 'src/app/services/profilemenu.json';

@Component({
  selector: 'side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
})
export class SideNavComponent  implements OnInit {
  userType:any;
  profileSideMenuData:any;
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef, 
    media: MediaMatcher,
    private menuCtrl: MenuController,
    private router:Router,
    private navCtrl : NavController,
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
   }

  ngOnInit() {
    this.menuCtrl.getMenus().then((menu) => {
      console.log('menu@@@>>', menu);
      
      menu[0].disabled = false;
      menu[1].disabled = false;
    })
    this.userType = localStorage.getItem('user_type');

    if (this.userType == 'tutor') {
      this.profileSideMenuData = profileMenuData.tutorMenuData;
    }else {
      this.profileSideMenuData = profileMenuData.studentMenuData;
    }
  }

  goToPage(_url:any){
    let url = '/user/'+_url;
    this.navCtrl.navigateRoot(url);
    console.log('_url>>>>', url);
    
  }

  openSecondMenu() {
    console.log('clickkk');
    this.menuCtrl.getMenus().then((menu) => {
      
      menu[0].disabled = false;
      menu[1].disabled = false;
    })
    this.menuCtrl.open('second-menu');
  }

}
