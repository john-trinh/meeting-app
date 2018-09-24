import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HttpClientModule  } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicStorageModule } from '@ionic/storage';
import { Camera } from '@ionic-native/camera';
import { SQLite } from '@ionic-native/sqlite';
import { SQLitePorter } from '@ionic-native/sqlite-porter';
import { SQLiteMock, SQLitePorterMock } from './mockSQL';
// import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
// import { File } from '@ionic-native/file';

import { HomePage } from '../pages/home/home';
import { AboutPage } from '../pages/about/about';
import { ListRoomPage } from '../pages/list-room/list-room';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { ChangePasswordPage } from '../pages/changepassword/changepassword';
import { RoomDetailPage } from '../pages/room-detail/room-detail';
import { BookingRoomPage } from '../pages/booking-room/booking-room';
import { DetailInfo } from '../pages/detail-info/detail-info';
import { AddStaff } from '../pages/add-staff/add-staff';
import { SeatMap } from '../pages/seatmap/seatmap';
import { EditStaff } from '../pages/edit-info/edit-info';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { ApiService } from '../service/api.service';
import { ManualValidationService } from '../service/manual-validation.service';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    AboutPage,
    ListRoomPage,
    TabsPage,
    LoginPage,
    ChangePasswordPage,
    RoomDetailPage,
    BookingRoomPage,
    DetailInfo,
    AddStaff,
    SeatMap,
    EditStaff
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpModule,
    ReactiveFormsModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    AboutPage,
    ListRoomPage,
    TabsPage,
    LoginPage,
    ChangePasswordPage,
    RoomDetailPage,
    BookingRoomPage,
    DetailInfo,
    AddStaff,
    SeatMap,
    EditStaff
  ],
  providers: [
    StatusBar,
    SplashScreen,
    HttpClientModule,
    HttpModule,
    ApiService,
    ManualValidationService,
    Camera,
    {provide: SQLite, useClass: SQLiteMock},
    {provide: SQLitePorter, useClass: SQLitePorterMock },
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
