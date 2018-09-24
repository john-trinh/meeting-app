import { Component, ViewChild } from '@angular/core';
import { NavController, Nav } from 'ionic-angular';

import { TabsPage } from '../tabs/tabs';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  rootPage = TabsPage;

  @ViewChild(Nav) nav: Nav;


  constructor(public navCtrl: NavController) {

  }

  logout() {
    this.navCtrl.setRoot(LoginPage);
  }
}
