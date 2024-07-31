import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';

@Component({
  selector: 'app-company-detail',
  templateUrl: './company-detail.component.html',
  styleUrls: ['./company-detail.component.css'],
})
export class CompanyDetailComponent implements OnInit {
  company: any = {};
  fields: string[] = [
    'name',
    'stock_ticker',
    'exchange',
    'isin',
    'website_url',
  ];

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.fetchCompany(id);
    } else {
      console.error('Company ID is null');
      this.router.navigate(['/main']);
    }
  }

  getToken(): string {
    return localStorage.getItem('token') || '';
  }

  fetchCompany(id: string): void {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.getToken()}`,
    });

    this.http
      .get<any>(`${environment.apiUrl}/api/company/${id}`, { headers })
      .subscribe({
        next: (data) => (this.company = data),
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

  onSubmit(): void {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.getToken()}`,
    });

    const body = {
      companyId: this.company.id,
      ...this.company,
    };

    this.http
      .put(`${environment.apiUrl}/api/company/update`, body, { headers })
      .subscribe({
        next: (response) => {
          console.log('Company updated successfully', response);
          alert('Company updated successfully');
        },
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
}
