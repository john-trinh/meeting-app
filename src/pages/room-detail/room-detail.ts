import { Component, OnInit } from '@angular/core';
import { NavController, ModalController, NavParams } from 'ionic-angular';
import { HttpParams } from '@angular/common/http';
import { ApiService } from '../../service/api.service';
import * as moment from 'moment';

import { BookingRoomPage } from '../booking-room/booking-room';

@Component({
  selector: 'page-room-detail',
  templateUrl: 'room-detail.html'
})
export class RoomDetailPage implements OnInit {
  private dateList: any[];
  private meetingsBK: any[];
  private selectedDate;
  title: string;
  private id: string;
  private meetingList;
  path: string = '/listmeeting';

  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    private navParams: NavParams,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.title = this.navParams.get('roomTitle');
    this.id = this.navParams.get('roomId');
    this.dateList = this.getDate();
    this.getToday();
    this.getListMeeting(this.selectedDate);
  }

  getDate() {
    let i = 1;
    let days = [];
    while(days.length < 10) {
      let count = moment().startOf('week').add(i, 'day');
      days.push(count);
      i++;
    }
    return days;
  }

  selectDate(date) {
    this.selectedDate = date;
    this.meetingList = this.filterMeetingByDate(this.meetingsBK, this.selectedDate);

  }

  getToday() {
    let today = moment();
    this.dateList.forEach(date => {
      if (date.date() === today.date()) {
        this.selectedDate = date;
      }
    });
  }

  bookingRoom() {
    let modal = this.modalCtrl.create(BookingRoomPage, {selectedDate: this.selectedDate, id: this.id, meetinglist: this.meetingList});
    modal.onDidDismiss(res => {
      if (res) {
        this.meetingsBK = res;
        this.meetingList = this.filterMeetingByDate(this.meetingsBK, this.selectedDate);
      }
    });
    modal.present();
  }

  getListMeeting(date) {
    let params = {room: this.id};

    this.apiService.get(this.path, new HttpParams({fromObject: params}))
      .subscribe((res:any) => {
        this.meetingsBK = res;
        this.meetingList = this.filterMeetingByDate(this.meetingsBK, date);
      });
  }

  filterMeetingByDate(data, date) {
    let rootDate = moment(date);
    return data.filter(meeting => {
      let date = moment(parseInt(meeting.start, 10));
      if(date.isSame(rootDate, 'day')) {
        return meeting;
      }
    });
  }

  isEmptyList() {
    if (!this.meetingList) {
      return true;
    } else {
       return false;
    }
  }
}
