import { Component, OnInit } from '@angular/core';
import { NavController, ViewController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../service/api.service';
import { ManualValidationService } from '../../service/manual-validation.service';

@Component({
  selector: 'page-addstaff',
  templateUrl: 'add-staff.html'
})
export class AddStaff implements OnInit {
  staffForm: FormGroup;
  private path = '/addstaff';
  listProject;
  listRole;

  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public navParams: NavParams,
    private apiService: ApiService,
    private fb: FormBuilder,
    private validateService : ManualValidationService
  ) {
  }

  ngOnInit() {
    this.getConfigs();
    this.initForm();
  }

  initForm() {
    const coordinates = this.navParams.get('coordinates');

    this.staffForm = this.fb.group({
      avatar: ['', Validators.required],
      name: ['', Validators.required],
      user: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
      project: ['', Validators.required],
      role: ['', Validators.required],
      serviceUnit: ['SU1 - Globe', Validators.required],
      phone: ['', [Validators.required, Validators.maxLength(11), Validators.minLength(10)]],
      skype: ['', [Validators.required]],
      coordinatesX: parseInt(coordinates.x, 10),
      coordinatesY: parseInt(coordinates.y, 10)
    });
  }

  dismissModal() {
    this.viewCtrl.dismiss();
  }

  getConfigs() {
    this.apiService.get('/config').subscribe((res: any) => {
      this.listProject = res.project;
      this.listRole = res.role;
    });
  }

  validateAllFormFields(formGroup: FormGroup) {
    this.validateService.validateAllFormFields(formGroup);
  }

  isFieldValid(field: string, subgroup?: string) {
    return this.validateService.isFieldValid(this.staffForm, field, subgroup);
  }

  displayFieldCss(field: string, subgroup?: string) {
    return this.validateService.displayFieldCss(this.staffForm, field, subgroup);
  }

  onSubmit() {
    if (this.staffForm.valid) {
      this.apiService.post(this.path, this.staffForm.value).subscribe((res) => {
        console.log(res);
        this.viewCtrl.dismiss();
      });
    } else {
      this.validateAllFormFields(this.staffForm);
    }
  }

}