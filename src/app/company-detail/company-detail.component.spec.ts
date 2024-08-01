import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { CompanyDetailComponent } from './company-detail.component';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment.prod';

describe('CompanyDetailComponent', () => {
  let component: CompanyDetailComponent;
  let fixture: ComponentFixture<CompanyDetailComponent>;
  let httpMock: HttpTestingController;
  let router: Router;

  const mockCompany = {
    id: '1',
    name: 'Test Company',
    stock_ticker: 'TEST',
    exchange: 'NYSE',
    isin: 'US1234567890',
    website_url: 'http://testcompany.com',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompanyDetailComponent],
      imports: [HttpClientTestingModule, RouterTestingModule, FormsModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => '1',
              },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CompanyDetailComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);

    // mock the GET request before each test
    fixture.detectChanges();
    const req = httpMock.expectOne(`${environment.apiUrl}/api/company/1`);
    req.flush(mockCompany);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch company data on init', () => {
    expect(component.company).toEqual(mockCompany);
    expect(component.originalCompany).toEqual(mockCompany);
  });

  it('should handle unauthorized error on fetchCompany', () => {
    spyOn(window, 'alert');
    spyOn(router, 'navigate');

    // retry initialization to trigger the HTTP request again
    component.ngOnInit();

    const req = httpMock.expectOne(`${environment.apiUrl}/api/company/1`);
    req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

    expect(window.alert).toHaveBeenCalledWith('Unauthorized');
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should update company data on submit', () => {
    component.company = mockCompany;

    spyOn(window, 'alert');

    component.onSubmit();

    const req = httpMock.expectOne(`${environment.apiUrl}/api/company/update`);
    expect(req.request.method).toBe('PUT');
    req.flush({});

    expect(window.alert).toHaveBeenCalledWith('Company updated successfully');
    expect(component.originalCompany).toEqual(mockCompany);
    expect(component.hasChanges).toBe(false);
  });

  it('should handle unauthorized error on submit', () => {
    component.company = mockCompany;

    spyOn(window, 'alert');
    spyOn(router, 'navigate');

    component.onSubmit();

    const req = httpMock.expectOne(`${environment.apiUrl}/api/company/update`);
    req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

    expect(window.alert).toHaveBeenCalledWith('Unauthorized');
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should navigate back to main page on goBack', () => {
    spyOn(router, 'navigate');
    component.goBack();
    expect(router.navigate).toHaveBeenCalledWith(['/main']);
  });

  it('should detect changes correctly', () => {
    component.company = mockCompany;
    component.originalCompany = { ...mockCompany };

    expect(component.hasChanges).toBe(false);

    component.company.name = 'Updated Company';
    component.checkForChanges();

    expect(component.hasChanges).toBe(true);

    component.company.name = 'Test Company';
    component.checkForChanges();

    expect(component.hasChanges).toBe(false);
  });
});
