import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment.prod';

interface Company {
  id: number;
  name: string;
  stock_ticker: string;
  exchange: string;
  isin: string;
  website_url: string;
  user_id: number;
}

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit {
  companies: Company[] = [];
  searchId: string = '';
  searchIsin: string = '';

  constructor(
    private http: HttpClient,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.fetchAll();
  }

  getToken(): string {
    return localStorage.getItem('token') || '';
  }

  fetchAll(): void {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.getToken()}`,
    });

    this.http
      .get<
        Company[]
      >(`${environment.apiUrl}/api/get-all-companies`, { headers })
      .subscribe({
        next: (data) => (this.companies = data),
        error: (error) => {
          if (error.status === 401) {
            alert('Unauthorized');
            this.router.navigate(['/login']);
          } else {
            console.error('There was an error!', error);
          }
        },
      });
  }

  fetchById(): void {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.getToken()}`,
    });

    this.http
      .get<Company>(`${environment.apiUrl}/api/company/${this.searchId}`, {
        headers,
      })
      .subscribe({
        next: (data) => {
          this.companies = [data];
          this.searchId = '';
        },
        error: (error) => {
          if (error.status === 401) {
            alert('Unauthorized');
            this.router.navigate(['/login']);
          } else if (error.status === 404) {
            alert('Not found!');
          } else {
            console.error('There was an error!', error);
          }
        },
      });
  }

  fetchByIsin(): void {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.getToken()}`,
    });

    this.http
      .get<Company>(
        `${environment.apiUrl}/api/company/isin/${this.searchIsin}`,
        { headers }
      )
      .subscribe({
        next: (data) => {
          this.companies = [data];
          this.searchIsin = '';
        },
        error: (error) => {
          if (error.status === 401) {
            alert('Unauthorized');
            this.router.navigate(['/login']);
          } else if (error.status === 404) {
            alert('Not found!');
          } else {
            console.error('There was an error!', error);
          }
        },
      });
  }
}
