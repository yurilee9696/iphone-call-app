import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-user-detail',
  templateUrl: 'user-detail.html'
})
export class UserDetailPage {
  user: any;

  constructor(public navCtrl: NavController, navParams: NavParams) {
    this.user = navParams.get('user');
  }

}