import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ApiService } from '../../service/api.service';
import { ManualValidationService } from '../../service/manual-validation.service';

import { HomePage } from '../home/home';
import { PasswordValidation } from './password-validation';
@Component({
  selector: 'page-changepassword',
  templateUrl: 'changepassword.html'
})
export class ChangePasswordPage {
  changePassForm: FormGroup;
  private changePass = {id:'', oldPassword: '', newPassword: ''};
  mess: string;

  constructor(
    public navCtrl: NavController,
    private apiService: ApiService,
    public navParams: NavParams,
    private fb: FormBuilder,
    private validateService: ManualValidationService
  ) {
    this.changePass.id = this.navParams.get('username');
    this.initForm();
  }

  initForm() {
    this.changePassForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassValidate: this.fb.group({
        newPassword: ['', Validators.required],
        confirmPassword: ['', Validators.required]
      },
      {
        validator: PasswordValidation
      })
    });
  }

  validateAllFormFields(formGroup: FormGroup) {
    this.validateService.validateAllFormFields(formGroup);
  }

  isFieldValid(field: string, subgroup?: string) {
    return this.validateService.isFieldValid(this.changePassForm, field, subgroup);
  }

  displayFieldCss(field: string, subgroup?: string) {
    return this.validateService.displayFieldCss(this.changePassForm, field, subgroup);
  }

  onReset() {
    if(this.changePassForm.valid) {
      let fromControl =  this.changePassForm.controls;
      this.changePass.oldPassword = fromControl.oldPassword.value;
      this.changePass.newPassword =  fromControl.newPassValidate.value.newPassword;

      this.apiService
        .post('/user/password', this.changePass)
        .subscribe((res:any) => {
          if (res.status === 1) {
            this.navCtrl.setRoot(HomePage);
          } else {
            this.mess = res.message;
          }
        });
    } else {
      this.validateAllFormFields(this.changePassForm);
    }
  }
}