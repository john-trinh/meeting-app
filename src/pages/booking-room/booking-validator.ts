import { AbstractControl, ValidatorFn } from "@angular/forms";
import * as moment from "moment";

export function freeTime(meetings): ValidatorFn {
  return (ac: AbstractControl): { [key: string]: boolean } | null => {
    let start = ac.get("meetingstart");
    let end = ac.get("meetingend");
    let status = false;
    if (start.errors !== null || end.errors !== null) {
      return null;
    }

    if (!isStartBeforeEnd(start.value, end.value)) {
      return { startafterend: true };
    }

    meetings.forEach(meeting => {
      if (
        isBooked(start.value, parseInt(meeting.start, 10), parseInt(meeting.end, 10)) || isBooked(end.value, parseInt(meeting.start, 10), parseInt(meeting.end, 10))
      ) {
        status = true;
      }
      if (
        isBooked(parseInt(meeting.start, 10), start.value, end.value) ||
        isBooked(parseInt(meeting.end, 10), start.value, end.value)
      ) {
        status = true;
      }
    });

    if (status) {
      return { overlapped: true };
    } else {
      return null;
    }
  };
}

function isBooked(time, start, end) {
  let comparedTime = moment(time);
  let begin = moment(start);
  let over = moment(end);
  if (comparedTime.isBetween(begin, over)) {
    return true;
  }
  return false;
}

function isStartBeforeEnd(start, end) {
  let startTime = moment(start);
  const endTime = moment(end);
  if (startTime.isBefore(endTime)) {
    return true;
  }
  return false;
}
