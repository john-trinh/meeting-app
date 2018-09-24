import {AbstractControl } from '@angular/forms';

export function PasswordValidation (AC: AbstractControl): {[key: string]: boolean} | null {
  let password = AC.get('newPassword');
  let confirmPassword = AC.get('confirmPassword');
  const reg: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}/;
  if (password.value === confirmPassword.value) {
    if (reg.test(password.value)) {
      return null;
    } else {
      return {matchPassword: true};
    }
  } else {
    return {matchPassword: true};
  }
}