import {AbstractControl, ValidatorFn } from '@angular/forms';
import * as moment from 'moment';

export function NotInThePast(): ValidatorFn {
  return (AC: AbstractControl): {[key: string]: any} | null => {
    const now = moment();
    const value = moment(AC.value);
    if (value.isBefore(now)) {
      return {'pastTime': true};
    }
    return null;
  }
}