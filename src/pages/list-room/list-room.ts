import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ApiService } from '../../service/api.service';

import { RoomDetailPage } from '../room-detail/room-detail';

@Component({
  selector: 'page-list-room',
  templateUrl: 'list-room.html'
})
export class ListRoomPage implements OnInit{
  listRoom = [];
  path: string = '/listroom';

  constructor(public navCtrl: NavController, private apiService: ApiService) {

  }
  ngOnInit() {
    this.apiService.get(this.path).subscribe((res:any) => {
      this.listRoom = res;
    });
  }

  showRoom(room) {
    this.navCtrl.push(RoomDetailPage, {roomId: room.id, roomTitle: room.name});
  }
}
