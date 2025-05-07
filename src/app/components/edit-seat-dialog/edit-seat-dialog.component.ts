import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { OfficeService } from '../../services/office.service';
interface User {
  id: number;
  name: string;
  email: string
}
@Component({
  selector: 'app-edit-seat-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    ReactiveFormsModule
  ],
  templateUrl: './edit-seat-dialog.component.html',
  styleUrls: ['./edit-seat-dialog.component.scss']
})



export class EditSeatDialogComponent {
  form: FormGroup;
  users: User[] = [];
  
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditSeatDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { name: string; preferredUserId: string | null ,},
    private officeService: OfficeService
  ) {
    this.form = this.fb.group({
      name: [data.name, Validators.required],
      priorityUser: [data.preferredUserId]
    });

    console.log("priorityuser", data.preferredUserId)
    this.loadUsers(); 

  }

  save() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  close() {
    this.dialogRef.close();
  }

  loadUsers() {
    this.officeService.getAllUsers().subscribe(users => {
      this.users = users;
    });
  }
}
