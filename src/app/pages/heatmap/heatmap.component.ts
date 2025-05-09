import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OfficeService, User } from '../../services/office.service';
import { startOfMonth, endOfMonth, eachDayOfInterval, format } from 'date-fns';
import { MatTooltipModule } from '@angular/material/tooltip';
import { addMonths, subMonths } from 'date-fns';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';

interface CalendarCell {
  date: string;
  hasBooking: boolean;
}

@Component({
  selector: 'heatmap',
  standalone: true,
  imports: [CommonModule, MatTooltipModule, MatIconModule, RouterModule],
  templateUrl: './heatmap.component.html',
  styleUrls: ['./heatmap.component.scss']
})
export class HeatmapComponent {
  users: User[] = [];
  daysInMonth: string[] = [];
  dataMap: { [userId: number]: CalendarCell[] } = {};
  currentDate = new Date();

  constructor(
    private officeService: OfficeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDaysOfMonth();
    this.officeService.getAllUsers().subscribe(users => {
      this.users = users;
      this.loadBookings();
    });
  }

  loadDaysOfMonth() {
    const days = eachDayOfInterval({
      start: startOfMonth(this.currentDate),
      end: endOfMonth(this.currentDate)
    });
    this.daysInMonth = days.map(day => format(day, 'yyyy-MM-dd'));
  }

  loadBookings() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth() + 1; // getMonth es 0-indexado
  
    this.officeService.getMonthlyAvailability(year, month).subscribe(allBookings => {
      this.users.forEach(user => {
        this.dataMap[user.id] = this.daysInMonth.map(date => ({
          date,
          hasBooking: allBookings.some(b => b.userId === user.id && b.date === date)
        }));
      });
    });
  }

  getCellClass(user: User, date: string): string {
    const booking = this.dataMap[user.id]?.find(cell => cell.date === date);
    return booking?.hasBooking ? 'has-booking' : '';
  }
  

previousMonth() {
  this.currentDate = subMonths(this.currentDate, 1);
  this.loadDaysOfMonth();
  this.loadBookings();
}

nextMonth() {
  this.currentDate = addMonths(this.currentDate, 1);
  this.loadDaysOfMonth();
  this.loadBookings();
}

dayToParam(date: string | Date): string {
  return typeof date === 'string' ? date : format(date, 'yyyy-MM-dd');
}

isWeekend(date: string): boolean {
  const day = new Date(date).getDay();
  return day === 0 || day === 6; // Domingo o sábado
}

}
