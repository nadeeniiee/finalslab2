import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Firestore, collection, collectionData, addDoc, doc, deleteDoc, updateDoc } from
'@angular/fire/firestore';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-rabies-case',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, RouterOutlet],
  templateUrl: './rabies-case.html',
  styleUrl: './rabies-case.css',
})
export class RabiesCase  {
  title = signal('Rabies Case Report');

  date = signal('');
  patientName = signal('');
  age = signal<number | null>(null);
  gender = signal('');
  animalType = signal('');
  rabiesStatus = signal('');
  treatmentGiven = signal('');

  editingId = signal<string | null>(null);

  records: any[] = [];

  constructor(private firestore: Firestore) {
    const rabies_cases = collection(this.firestore, 'rabies_cases');
    collectionData(rabies_cases, { idField: 'id' })
    .subscribe(data => {
      this.records = data; 
    });
  }

  resetForm() {
    this.date.set('');
    this.patientName.set('');
    this.age.set(null);
    this.gender.set('');
    this.animalType.set('');
    this.rabiesStatus.set('');
    this.treatmentGiven.set('');
    this.editingId.set(null);
  }

  addRecord() {
    const date = this.date();
    const patientName = this.patientName();
    const age = this.age();
    const gender = this.gender();
    const animalType = this.animalType();
    const rabiesStatus = this.rabiesStatus();
    const treatmentGiven = this.treatmentGiven();
    const id = this.editingId();

    if (date && patientName && age) {
      const rabies_cases = collection(this.firestore, 'rabies_cases');
      if (id) {
        this.editRecord(id, date, patientName, age, gender, animalType, rabiesStatus, treatmentGiven);
      } else {
        addDoc(rabies_cases, { date, patientName, age, gender, animalType, rabiesStatus, treatmentGiven});
        this.resetForm();
      }
    }
  }

  startEditRecord(id: string, date: string, patientName: string, age: number | null, gender: string, animalType: string, rabiesStatus: string, treatmentGiven: string) {
    this.date.set(date);
    this.patientName.set(patientName);
    this.age.set(age);
    this.gender.set(gender);
    this.animalType.set(animalType);
    this.rabiesStatus.set(rabiesStatus);
    this.treatmentGiven.set(treatmentGiven);
    this.editingId.set(id);
  }

  deleteRecord(id: string) {
    const recordDoc = doc(this.firestore, `rabies_cases/${id}`);
    deleteDoc(recordDoc);
    if (this.editingId() === id) {
      this.resetForm();
    }
  }

  editRecord(id: string, newDate: string, newPatientName: string, newAge: number | null, newGender: string, newAnimalType: string, newRabiesStatus: string, newTreatmentGiven: string) {
    const recordDoc = doc(this.firestore, `rabies_cases/${id}`);
    updateDoc(recordDoc, { date: newDate, patientName: newPatientName, age: newAge, gender: newGender, animalType: newAnimalType, rabiesStatus: newRabiesStatus, treatmentGiven: newTreatmentGiven});
    this.resetForm();
  }
}