import { Component, OnInit } from "@angular/core";
import { NavController, ViewController, NavParams } from "ionic-angular";
import { ToastController } from "ionic-angular";

import { ApiService } from "../../service/api.service";

@Component({
  selector: "page-seatmap",
  templateUrl: "seatmap.html"
})
export class SeatMap implements OnInit {
  path = "/seat";
  listSeat = [];
  currentCoordinates;

  constructor(
    public navCtrl: NavController,
    private apiService: ApiService,
    public viewCtrl: ViewController,
    public toastCtrl: ToastController,
    public navParams: NavParams
  ) {}

  ngOnInit() {
    this.apiService.get(this.path).subscribe((res: any) => {
      this.listSeat = res;
    });

    this.currentCoordinates = this.navParams.get("coordinates");
  }

  getSeatColor(seat) {
    if (
      seat.x === this.currentCoordinates.x &&
      seat.y === this.currentCoordinates.y
    ) {
      return "danger";
    }
    if (seat.status) {
      return "newred";
    } else {
      return "newgray";
    }
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  getSeat(seat) {
    if (!seat.status) {
      this.viewCtrl.dismiss(seat);
    } else {
      const toast = this.toastCtrl.create({
        message: "Seat has occupied! :(",
        duration: 1000
      });
      toast.present();
    }
  }
}
