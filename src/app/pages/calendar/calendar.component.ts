import { Component, OnInit } from '@angular/core';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { OfficeService } from '../../services/office.service';
import { format, startOfDay } from 'date-fns';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { CalendarWrapperModule } from '../../shared/calendar-wrapper.module';
import { Subject } from 'rxjs';
import { addMonths, subMonths } from 'date-fns';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { Booking } from '../../services/office.service';
import { AuthService } from '../../services/auth.service';
interface User {
  id: number;
  name: string;
  email: string;
}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  standalone: true,
  imports: [CommonModule, CalendarWrapperModule, MatIconModule, MatSelectModule, FormsModule]
})
export class CalendarComponent implements OnInit {
  view: CalendarView = CalendarView.Month;
  viewDate: Date = new Date();
  events: CalendarEvent[] = [];
  refresh: Subject<void> = new Subject();
  isMobile = false;
  attendedCount = 0;
  totalReservations = 0;
  futureReservations = 0;
  highlightMode: 'attended' | 'future' | 'all' | null = null;
  isAdmin = false;
  users: User[] = [];
  selectedUserId: number | null = null;

  constructor(
    private officeService: OfficeService,
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private authService: AuthService,

  ) { }

  ngOnInit(): void {
    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
      this.isMobile = result.matches;
    });

    const token = this.authService.getToken();
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.isAdmin = payload.role?.includes('ADMIN');
    }

    if (this.isAdmin) {
      this.officeService.getAllUsers().subscribe(users => {
        this.users = users;
      });
    }
    this.loadBookings();

  }



  loadBookings(): void {
    if (this.selectedUserId) {
      this.officeService.getBookingHistoryByUser(this.selectedUserId).subscribe(history => {
        this.processBookings(history);
      });
    } else {
      this.officeService.getMyBookingHistory().subscribe(history => {
        this.processBookings(history);
      });
    }
  }



  previousMonth(): void {
    this.viewDate = subMonths(this.viewDate, 1);
    this.loadBookings();
  }

  nextMonth(): void {
    this.viewDate = addMonths(this.viewDate, 1);
    this.loadBookings();
  }
  goToDate(date: Date) {
    const dateParam = format(date, 'yyyy-MM-dd');
    this.router.navigate(['/user-panel'], {
      queryParams: { date: dateParam }
    });
  }

  isAttended(date: Date): boolean {
    const today = new Date();
    return this.events.some(e => startOfDay(new Date(e.start)).getTime() === startOfDay(date).getTime() && new Date(e.start) < today);
  }

  isFuture(date: Date): boolean {
    const today = new Date();
    return this.events.some(e => startOfDay(new Date(e.start)).getTime() === startOfDay(date).getTime() && new Date(e.start) >= today);
  }
  hasEvent(date: Date): boolean {
    return this.events.some(e => startOfDay(new Date(e.start)).getTime() === startOfDay(date).getTime());
  }

  onUserChange() {
    this.loadBookings();
  }

  onUserSelected(userId: number) {
    if (userId) {
      this.officeService.getBookingHistoryByUser(userId).subscribe(history => {
        this.processBookings(history);
      });
    }
  }

  private processBookings(history: Booking[]) {
    const now = new Date();
    const currentMonth = this.viewDate.getMonth();
    const currentYear = this.viewDate.getFullYear();

    this.attendedCount = 0;
    this.totalReservations = 0;
    this.futureReservations = 0;

    this.events = history.map(booking => {
      const bookingDate = new Date(booking.date);
      const isPast = bookingDate < now;
      const isInMonth = bookingDate.getMonth() === currentMonth && bookingDate.getFullYear() === currentYear;

      if (isInMonth) {
        this.totalReservations++;
        if (isPast) {
          this.attendedCount++;
        } else {
          this.futureReservations++;
        }
      }

      return {
        start: startOfDay(bookingDate),
        title: this.isMobile ? 'P' : `Puesto ${booking.placeId}`,
        color: {
          primary: isPast ? '#4caf50' : '#007bff',
          secondary: isPast ? '#C8E6C9' : '#BBDEFB'
        },
        allDay: true
      };
    });

    this.refresh.next();
  }


}
