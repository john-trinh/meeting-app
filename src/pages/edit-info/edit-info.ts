import { Component, OnInit } from "@angular/core";
import {
  NavController,
  ViewController,
  NavParams,
  ModalController
} from "ionic-angular";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiService } from "../../service/api.service";
import { ManualValidationService } from "../../service/manual-validation.service";

import { SeatMap } from "../seatmap/seatmap";

@Component({
  selector: "page-editifo",
  templateUrl: "edit-info.html"
})
export class EditStaff implements OnInit {
  staffForm: FormGroup;
  private path = "/updatestaff";
  listProject;
  listRole;

  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    private apiService: ApiService,
    private fb: FormBuilder,
    private validateService: ManualValidationService
  ) {}

  ngOnInit() {
    this.getConfigs();
    this.initForm();
  }

  initForm() {
    const staff = this.navParams.get("staff");

    this.staffForm = this.fb.group({
      avatar: [staff.avatar, Validators.required],
      name: [staff.name, Validators.required],
      user: [staff.user, Validators.required],
      email: [staff.email, [Validators.email, Validators.required]],
      project: [staff.project, Validators.required],
      role: [staff.role, Validators.required],
      serviceUnit: ["SU1 - Globe", Validators.required],
      phone: [
        staff.phone,
        [
          Validators.required,
          Validators.maxLength(11),
          Validators.minLength(10)
        ]
      ],
      skype: [staff.skype, [Validators.required]],
      coordinatesX: parseInt(staff.coordinates.x, 10),
      coordinatesY: parseInt(staff.coordinates.y, 10)
    });
  }

  dismissModal() {
    this.viewCtrl.dismiss();
  }

  getConfigs() {
    this.apiService.get("/config").subscribe((res: any) => {
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
    return this.validateService.displayFieldCss(
      this.staffForm,
      field,
      subgroup
    );
  }

  changeOccupation() {
    const coordinates = {
      x: this.staffForm.controls.coordinatesX.value,
      y: this.staffForm.controls.coordinatesY.value
    };
    let modal = this.modalCtrl.create(SeatMap, { coordinates: coordinates });

    modal.onDidDismiss((res: any) => {
      if (res) {
        this.changeCoordinates(res.x, res.y);
      }
    });
    modal.present();
  }

  changeCoordinates(x, y) {
    this.staffForm.controls.coordinatesX.setValue(x);
    this.staffForm.controls.coordinatesY.setValue(y);
  }

  onSubmit() {
    if (this.staffForm.valid) {
      this.apiService.post(this.path, this.staffForm.value).subscribe(res => {
        console.log(res);
        this.viewCtrl.dismiss();
      });
    } else {
      this.validateAllFormFields(this.staffForm);
    }
  }
}
