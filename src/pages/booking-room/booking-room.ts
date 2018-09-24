import { Component, OnInit } from '@angular/core';
import { NavController, ViewController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';
import * as moment from 'moment';
import { freeTime } from './booking-validator';
import { ApiService } from '../../service/api.service';
import { ManualValidationService } from '../../service/manual-validation.service';
import { NotInThePast } from './not-in-the-past-validator';

@Component({
  selector: 'page-booking-room',
  templateUrl: 'booking-room.html'
})

export class BookingRoomPage implements OnInit {
  private bookingForm: FormGroup;
  private meetingList;
  private now = moment();
  present = this.now.format('YYYY-MM-DD').toString();
  private path = '/bookmeeting';
  private meeting = {
    room: '',
    start: '',
    end: '',
    title: '',
    description: '',
    author: ''
  };

  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public navParams: NavParams,
    private fb: FormBuilder,
    private storage: Storage,
    private apiService: ApiService,
    private validateService: ManualValidationService
  ) {
    this.meetingList = this.navParams.get('meetinglist');
    this.initForm();
  }

  ngOnInit() {
    this.storage.get('username').then(val => {
      if (val) {
        this.meeting.author = val;
      }
    });
  }

  dismissModal() {
    this.viewCtrl.dismiss();
  }

  initForm() {
    this.bookingForm = this.fb.group({
      date: [this.navParams.get('selectedDate').format(), Validators.required],
      title: [null, Validators.required],
      description: [null, Validators.required],
      meetingtime: this.fb.group({
        meetingstart: [this.changeDate(this.now, this.navParams.get('selectedDate')).format(), [Validators.required, NotInThePast()]],
        meetingend: [this.changeDate(moment(this.now.add(30, 'minute')).format(), this.navParams.get('selectedDate')).format(),[Validators.required, NotInThePast()]]
      },
      {
        validator: [freeTime(this.meetingList)]
      })
    });
  }

  validateAllFormFields(formGroup: FormGroup) {
    this.validateService.validateAllFormFields(formGroup);
  }

  isFieldValid(field: string, subgroup?: string) {
    return this.validateService.isFieldValid(this.bookingForm, field, subgroup);
  }

  displayFieldCss(field: string, subgroup?: string) {
    return this.validateService.displayFieldCss(this.bookingForm, field, subgroup);
  }

  changeDate(oldDate, newDate) {
    let now = moment(oldDate);
    let then = moment(newDate);
    return now.date(then.date()).month(then.month());
  }

  refractorData(form) {
    const controls = form.controls;
    let start;
    let end;
    const meetingGroup = controls.meetingtime.controls;
    const meetingstart = meetingGroup.meetingstart.value;
    const meetingend = meetingGroup.meetingend.value;
    const date = controls.date.value;

    if(moment(meetingstart).date() !== moment(date).date()) {
      start = this.changeDate(meetingstart, date).valueOf().toString();
      end = this.changeDate(meetingend, date).valueOf().toString();
    } else {
      start = moment(meetingstart).valueOf().toString();
      end = moment(meetingend).valueOf().toString();
    }

    return {
      title: controls.title.value,
      description: controls.description.value,
      room: this.navParams.get('id'),
      start: start,
      end: end,
      author: this.meeting.author
    }
  }

  onSubmit() {
    if (this.bookingForm.valid) {
      this.meeting = this.refractorData(this.bookingForm);
      this.apiService.post(this.path, this.meeting)
        .subscribe(res => {
          this.viewCtrl.dismiss(res);
        });
    } else {
      this.validateAllFormFields(this.bookingForm);
    }
  }
}
