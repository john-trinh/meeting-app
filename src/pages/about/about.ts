import { Component, OnInit } from '@angular/core';
import { NavController, ModalController, AlertController } from 'ionic-angular';
import { DetailInfo } from '../detail-info/detail-info';
import { AddStaff } from '../add-staff/add-staff';

import { ApiService } from '../../service/api.service';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage implements OnInit {
  path = '/seat';
  listSeat = [];

  constructor(
    public navCtrl: NavController,
    private apiService: ApiService,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.apiService.get(this.path).subscribe((res:any) => {
      this.listSeat = res;
    });
  }

  getDetailInfo(seat) {
    if (seat.status) {
      let modal = this.modalCtrl.create(DetailInfo, {seatinfo: seat.user});
      modal.present();
    } else {
      this.getAlert(seat);
    }
  }

  getAlert(seat) {
    const alert =  this.alertCtrl.create({
      title: 'Add ocupation?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'OK',
          handler: () => {
            this.setOccupation(seat.x, seat.y);
          }
        }
      ]
    });
    alert.present();
  }

  setOccupation(coordinateX, coordinateY) {
    let modal = this.modalCtrl.create(AddStaff, {coordinates: {x: coordinateX, y: coordinateY}});
    modal.present();
  }
}
