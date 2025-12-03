import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Firestore, collection, collectionData, addDoc, doc, deleteDoc, updateDoc } from
'@angular/fire/firestore';
import {  RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-water-analysis',
  standalone: true,
  imports: [CommonModule, FormsModule,  RouterOutlet],
  templateUrl: './water-analysis.html',
  styleUrl: './water-analysis.css',
})
export class WaterAnalysis  {
  title = signal('Water Analysis Result');

  date = signal('');
  sourceAddress = signal('');
  waterStatus = signal('');
  remarks = signal('');

  editingId = signal<string | null>(null);

  records: any[] = [];

  constructor(private firestore: Firestore) {
    const water_analysis_results = collection(this.firestore, 'water_analysis_results');
    collectionData(water_analysis_results, { idField: 'id' })
    .subscribe(data => {
      this.records = data; 
    });
  }

  resetForm() {
    this.date.set('');
    this.sourceAddress.set('');
    this.waterStatus.set('');
    this.remarks.set('');
    this.editingId.set(null);
  }

  addRecord() {
    const date = this.date();
    const sourceAddress = this.sourceAddress();
    const waterStatus = this.waterStatus();
    const remarks = this.remarks();
    const id = this.editingId();

    if (date && sourceAddress) {
      const water_analysis_results = collection(this.firestore, 'water_analysis_results');
      if (id) {
        this.editRecord(id, date, sourceAddress, waterStatus, remarks);
      } else {
        addDoc(water_analysis_results, { date, sourceAddress, waterStatus, remarks});
        this.resetForm();
      }
    }
  }

  startEditRecord(id: string, date: string, sourceAddress: string, waterStatus: string, remarks: string) {
    this.date.set(date);
    this.sourceAddress.set(sourceAddress);
    this.waterStatus.set(waterStatus);
    this.remarks.set(remarks);
    this.editingId.set(id);
  }

  deleteRecord(id: string) {
    const recordDoc = doc(this.firestore, `water_analysis_results/${id}`);
    deleteDoc(recordDoc);
    if (this.editingId() === id) {
      this.resetForm();
    }
  }

  editRecord(id: string, newDate: string, newSourceAddress: string, newWaterStatus: string, newRemarks: string) {
    const recordDoc = doc(this.firestore, `water_analysis_results/${id}`);
    updateDoc(recordDoc, { date: newDate, sourceAddress: newSourceAddress, waterStatus: newWaterStatus, remarks: newRemarks});
    this.resetForm();
  }
}