import { Component, OnInit } from "@angular/core";
import { ActionSheetController } from "ionic-angular";
import { NavController, NavParams, ViewController, ModalController} from "ionic-angular";
import { Camera, CameraOptions } from "@ionic-native/camera";
import { HttpParams } from "@angular/common/http";
import { DomSanitizer } from "@angular/platform-browser";
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

import { EditStaff } from "../edit-info/edit-info";
import { ApiService } from "../../service/api.service";

@Component({
  selector: "detail-info",
  templateUrl: "detail-info.html"
})
export class DetailInfo implements OnInit {
  path = "/getstaff";
  info;
  base64Image;
  options: CameraOptions = {
    quality: 30,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    sourceType: this.camera.PictureSourceType.CAMERA,
    targetWidth: 768,
    targetHeight: 768
  };

  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    private navParams: NavParams,
    private modalCtrl: ModalController,
    private apiService: ApiService,
    private camera: Camera,
    public actionSheetCtrl: ActionSheetController,
    private sanitizer: DomSanitizer,
    private storage: SQLite
  ) {
    this.initDb();
  }

  ngOnInit() {
    const seat = this.navParams.get("seatinfo");
    this.getDetailInfo(seat);
  }

  getDetailInfo(seat) {
    let params = { user: seat };
    this.apiService
      .get(this.path, new HttpParams({ fromObject: params }))
      .subscribe((res: any) => {
        this.info = res[0];
        this.setInfoToDb(this.info);
      });
  }

  dismissModal() {
    this.viewCtrl.dismiss();
  }

  takePicture() {
    this.camera.getPicture(this.options).then(
      imageCamera => {
        this.base64Image = this.sanitizer.bypassSecurityTrustUrl(imageCamera);
        console.log(this.base64Image);
      },
      (err: any) => {
        console.log(err, "fail");
      }
    );
  }

  openGallery() {
    const options = {
      quality: 30,
      allowEdit: true,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      saveToPhotoAlbum: false,
      correctOrientation: true,
      encodingType: this.camera.EncodingType.JPEG,
      destinationType: this.camera.DestinationType.FILE_URI,
      targetWidth: 768,
      targetHeight: 768
    };

    this.camera.getPicture(options).then(
      imageCamera => {
        console.log(imageCamera);
        this.base64Image = this.sanitizer.bypassSecurityTrustUrl(imageCamera);
      },
      (err: any) => {
        console.log(err, "fail");
      }
    );
  }

  changeAvatar() {
    const actionSheet = this.actionSheetCtrl.create({
      title: "Change avatar?",
      buttons: [
        {
          text: "Open Camera",
          handler: () => {
            this.takePicture();
          }
        },
        {
          text: "Open Gallery",
          handler: () => {
            this.openGallery();
          }
        },
        {
          text: "Cancel",
          role: "cancel"
        }
      ]
    });
    actionSheet.present();
  }

  editUser() {
    let editUser = this.modalCtrl.create(EditStaff, { staff: this.info });
    editUser.present();
  }

  setInfoToDb(seat) {
    const query =  `INSERT OR REPLACE INTO staffs VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    this.storage.create({
      name: 'staff-info.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql(query, [
        seat.user,
        seat.email,
        seat.name,
        seat.project,
        seat.role,
        seat.serviceUnit,
        seat.phone,
        seat.skype,
        seat.coordinates.x,
        seat.coordinates.y,
        seat.avatar
      ]).catch(e => console.log(e, 'failedddddd'));
    });
  }

  initDb() {
    this.storage.create({
      name: 'staff-info.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql(`create table if not exists staffs(
        user CHAR(20) PRIMARY KEY,
        email CHAR(40),
        name CHAR(50),
        project CHAR(8),
        role CHAR(30),
        su CHAR(20),
        phone CHAR(11),
        skype CHAR(40),
        coordinatex INT,
        coordinatey INT,
        avatar CHAR(200)
      )`, {});
    });
  }

  getDataFromDb() {
    this.storage.create({
      name: 'staff-info.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql(`SELECT * FROM staffs`, {})
        .then((resp: any) => {
          let data = [];
          if (resp.rows.length > 0) {
            for(let i=0; i <resp.rows.length; i++) {
              data.push(resp.rows.item(i));
            }
          }
          console.log(data);
        });
    });
  }
}
