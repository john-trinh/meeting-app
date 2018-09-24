import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ApiService } from '../../service/api.service';
import { HomePage } from '../home/home';
import { ChangePasswordPage } from '../changepassword/changepassword';
import { Storage } from '@ionic/storage';
import { ManualValidationService } from '../../service/manual-validation.service';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  private loginForm: FormGroup;
  public invalid = false;
  private path = '/login';

  constructor(
    public navCtrl: NavController,
    private apiService: ApiService,
    private fb: FormBuilder,
    private storage: Storage,
    private validateService: ManualValidationService
  ) {
    this.initForm();
  }

  initForm() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
  isFieldValid(field: string) {
    return this.validateService.isFieldValid(this.loginForm, field);
  }
  displayFieldCss(field: string) {
    return this.validateService.displayFieldCss(this.loginForm, field);
  }

  onLogin() {
    if(this.loginForm.valid) {
      this.apiService.post(this.path, this.loginForm.value).subscribe((res:any) => {
        const status = res.status
        switch (status) {
          case 1: {
            this.invalid = false;
            this.navCtrl.setRoot(HomePage, {username: this.loginForm.controls.username.value});
            this.storage.set('username', this.loginForm.controls.username.value);
            break;
          }
          case 2: {
            this.invalid = false;
            this.navCtrl.setRoot(ChangePasswordPage, {username: this.loginForm.controls.username.value});
            this.storage.set('username', this.loginForm.controls.username.value);
            break;
          }
          case 0: {
            this.invalid = true;
            break;
          }
        }
      });
    } else {
      this.validateService.validateAllFormFields(this.loginForm);
    }
  }
}