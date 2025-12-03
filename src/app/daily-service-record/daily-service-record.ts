import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Firestore, collection, collectionData, addDoc, doc, deleteDoc, updateDoc } from
'@angular/fire/firestore';
import { RouterOutlet  } from '@angular/router';

@Component({
  selector: 'app-daily-service-record',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet],
  templateUrl: './daily-service-record.html',
  styleUrl: './daily-service-record.css',
})
export class DailyServiceRecord  {
  title = signal('Daily Service Record');

  date = signal('');
  patientName = signal('');
  age = signal<number | null>(null);
  gender = signal('');
  sicknessDiagnosed = signal('');
  treatmentProvided = signal('');
  attendingPhysician = signal('');

  editingId = signal<string | null>(null);

  records: any[] = [];

  constructor(private firestore: Firestore) {
    const daily_service_records = collection(this.firestore, 'daily_service_records');
    collectionData(daily_service_records, { idField: 'id' })
    .subscribe(data => {
      this.records = data; 
    });
  }

  resetForm() {
    this.date.set('');
    this.patientName.set('');
    this.age.set(null);
    this.gender.set('');
    this.sicknessDiagnosed.set('');
    this.treatmentProvided.set('');
    this.attendingPhysician.set('');
    this.editingId.set(null);
  }

  addRecord() {
    const date = this.date();
    const patientName = this.patientName();
    const age = this.age();
    const gender = this.gender();
    const sicknessDiagnosed = this.sicknessDiagnosed();
    const treatmentProvided = this.treatmentProvided();
    const attendingPhysician = this.attendingPhysician();
    const id = this.editingId();

    if (date && patientName && age) {
      const daily_service_records = collection(this.firestore, 'daily_service_records');
      if (id) {
        this.editRecord(id, date, patientName, age, gender, sicknessDiagnosed, treatmentProvided, attendingPhysician);
      } else {
        addDoc(daily_service_records, { date, patientName, age, gender, sicknessDiagnosed, treatmentProvided, attendingPhysician});
        this.resetForm();
      }
    }
  }

  startEditRecord(id: string, date: string, patientName: string, age: number | null, gender: string, sicknessDiagnosed: string, treatmentProvided: string, attendingPhysician: string) {
    this.date.set(date);
    this.patientName.set(patientName);
    this.age.set(age);
    this.gender.set(gender);
    this.sicknessDiagnosed.set(sicknessDiagnosed);
    this.treatmentProvided.set(treatmentProvided);
    this.attendingPhysician.set(attendingPhysician);
    this.editingId.set(id);
  }

  deleteRecord(id: string) {
    const recordDoc = doc(this.firestore, `daily_service_records/${id}`);
    deleteDoc(recordDoc);
    if (this.editingId() === id) {
      this.resetForm();
    }
  }

  editRecord(id: string, newDate: string, newPatientName: string, newAge: number | null, newGender: string, newSicknessDiagnosed: string, newTreatmentProvided: string, newAttendingPhysician: string) {
    const recordDoc = doc(this.firestore, `daily_service_records/${id}`);
    updateDoc(recordDoc, { date: newDate, patientName: newPatientName, age: newAge, gender: newGender, sicknessDiagnosed: newSicknessDiagnosed, treatmentProvided: newTreatmentProvided, attendingPhysician: newAttendingPhysician});
    this.resetForm();
  }
}