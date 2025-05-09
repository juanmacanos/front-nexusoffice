import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environments';

export interface Place {
  placeId: number;
  name: string;
  x: number;
  y: number;
  occupied: boolean;
  userId: number | null;
  userName: string | null;
  preferredUserId: number;
  date?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Booking {
  id: number;
  userId: number;
  placeId: number;
  date: string;
}


@Injectable({ providedIn: 'root' })
export class OfficeService {
    private readonly AVAILABILITY_EP = `${environment.apiUrl}/bookings/availability`;

  constructor(private http: HttpClient) {}

  getAvailability(date: string): Observable<Place[]> {
    return this.http.get<Place[]>(this.AVAILABILITY_EP,  { params: {date}});
    
  }
  
  getMonthlyAvailability(year: number, month: number): Observable<Place[]> {
    const url = `${environment.apiUrl}/bookings/monthly-availability`;
    return this.http.get<Place[]>(url, {
      params: {
        year: year.toString(),
        month: month.toString()
      }
    });
  }
  
  createPlace(data: { name: string, x: number; y: number }): Observable<any> {
    return this.http.post(`${environment.apiUrl}/places`, data);
  }

  assist(date: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/bookings/assist`, {
      date
    });
  }
  
  cancelAssist(date: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/bookings/cancelAssist`, {
      date
    });
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.apiUrl}/users`);
  }

  updatePreferredUser(placeId: number, userId: number): Observable<any> {
    const url = `${environment.apiUrl}/places/${placeId}/preferreduser`;
    return this.http.patch(url, { userId });
  }  

  getMyBookingHistory(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${environment.apiUrl}/bookings/history`);
  }  

  getBookingHistoryByUser(userId: number): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${environment.apiUrl}/bookings/history/${userId}`);
  }  
  

  
}
