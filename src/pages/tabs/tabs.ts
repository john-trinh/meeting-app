import { Component } from '@angular/core';

import { AboutPage } from '../about/about';
import { ListRoomPage } from '../list-room/list-room';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = ListRoomPage;
  tab2Root = AboutPage;

  constructor() {

  }
}
