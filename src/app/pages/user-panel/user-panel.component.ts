import { Component, OnInit } from '@angular/core';
import { OfficeService } from '../../services/office.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { EditSeatDialogComponent } from '../../components/edit-seat-dialog/edit-seat-dialog.component';
import { SnackbarComponent } from '../../components/snackbar/snackbar.component';

interface Place {
  placeId: number;
  name: string;
  x: number;
  y: number;
  occupied: boolean;
  username: string | null;
  preferredUserId: number;
}

@Component({
  selector: 'app-user-panel',
  standalone: true,
  templateUrl: './user-panel.component.html',
  styleUrls: ['./user-panel.component.scss'],
  imports: [CommonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatIconModule,
    MatSnackBarModule
  ]
})
export class UserPanelComponent implements OnInit {
  userName!: string;
  userId!: number;
  places: Place[] = [];
  userHasBooking = false;
  isAdmin = false;
  editMode = false;
  selectedSeat: Place | null = null;
  selectedDate: Date = new Date();
  viewMode: 'grid' | 'list' = 'grid';
  isMobile = false;

  readonly gridWidth = 7;
  readonly gridHeight = 7;

  gridCells: { x: number; y: number }[] = [];



  constructor(
    private route: ActivatedRoute,
    private officeService: OfficeService,
    private authService: AuthService,
    private dialog: MatDialog,
    private breakpointObserver: BreakpointObserver,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
      this.isMobile = result.matches;
    });

    this.route.queryParams.subscribe(params => {
      if (params['date']) {
        this.selectedDate = parseISO(params['date']);
      }
      this.loadUser();
      this.loadOfficeData();
    });
  }

  loadUser() {
    const token = this.authService.getToken();

    if (!token) return;
    const payload = JSON.parse(atob(token.split('.')[1]));
    this.isAdmin = payload.role?.includes('ADMIN');
    this.userName = payload.sub || 'Usuario';
  }

  loadOfficeData() {
    this.gridCells = [];
    for (let y = 1; y <= this.gridHeight; y++) {
      for (let x = 1; x <= this.gridWidth; x++) {
        this.gridCells.push({ x, y });
      }
    }

    const dateStr = format(this.selectedDate, 'yyyy-MM-dd');
    console.log("ISO", this.selectedDate.toISOString())
    this.officeService.getAvailability(dateStr).subscribe(places => {
      this.places = places;
      console.log("places", places)
      this.userHasBooking = this.places.some(p => p.username === this.userName);
    });
  }

  getPlace(cell: { x: number; y: number }): Place | undefined {
    return this.places.find(p => p.x === cell.x && p.y === cell.y);
  }


  onReserve() {
    const date = format(this.selectedDate, 'yyyy-MM-dd');

    this.officeService.assist(date).subscribe({
      next: () => {
        this.snackbar.openFromComponent(SnackbarComponent, {
          data: { message: 'Reservado correctamente', type: 'success' },
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: "success"
        });

        this.loadOfficeData();
      },
      error: err => {
        this.snackbar.openFromComponent(SnackbarComponent, {
          data: { message: err.error.error, type: 'error' },
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: "error"
        });
      }
    });
  }

  onCancel() {
    const date = format(this.selectedDate, 'yyyy-MM-dd');

    this.officeService.cancelAssist(date).subscribe({
      next: () => {
        this.snackbar.openFromComponent(SnackbarComponent, {
          data: { message: 'Reserva cancelada', type: 'success' },
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: "success"
        }); 
        this.loadOfficeData();
      },
      error: err => {
        this.snackbar.openFromComponent(SnackbarComponent, {
          data: { message: 'No se pudo cancelar la reserva', type: 'error' },
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: "error"
        });
      }
    });
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
    this.selectedSeat = null; // Limpia el menú contextual si lo había
  }


  onSeatClick(cell: Place | { x: number; y: number }) {
    this.selectedSeat = {
      ...cell,
      placeId: (cell as Place).placeId ?? null,
      name: (cell as Place).name ?? null,
      username: (cell as Place).username ?? null,
      occupied: (cell as Place).occupied ?? false,
      preferredUserId: (cell as Place).preferredUserId ?? null
    };
  }


  closeContextMenu() {
    this.selectedSeat = null;
    console.log(this.selectedSeat);
  }

  addSeat(place: { x: number; y: number }) {
    console.log('Añadir asiento en:', place);

    this.officeService.createPlace({ name: "Puesto", x: place.x, y: place.y }).subscribe(() => {
      this.loadOfficeData();
    }
    );

    this.closeContextMenu();
  }


  removeSeat(place: Place) {
    console.log('Eliminar asiento:', place);
    this.closeContextMenu();
  }

  get formattedDate(): string {
    return format(this.selectedDate, "EEEE, d MMMM", { locale: es });
  }

  onDateChange(date: Date) {
    this.selectedDate = new Date(date);
    console.log(this.selectedDate);
    this.loadOfficeData();
  }

  toggleView() {
    this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
    if (this.viewMode === 'list') this.editMode = false;
  }

  editSeat(seat: Place) {
    const dialogRef = this.dialog.open(EditSeatDialogComponent, {
      data: {
        name: seat.name,
        preferredUserId: seat.preferredUserId
      },
      panelClass: 'custom-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.officeService.updatePreferredUser(seat.placeId, result.priorityUser).subscribe({
          next: () => { this.loadOfficeData() },
          error: () => {
            this.snackbar.openFromComponent(SnackbarComponent, {
              data: { message: "No pueden existir dos asientos con el mismo usuario prioritario.", type: 'error' },
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: "error"
            });
          }

        });
      }
    });

    this.closeContextMenu();
  }

  get isPastDate(): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selected = new Date(this.selectedDate);
    selected.setHours(0, 0, 0, 0);
    return selected < today;
  }

}
