import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { MainComponent } from './main.component';
import { environment } from '../../environments/environment.prod';

describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;
  let httpMock: HttpTestingController;

  const mockCompanies = [
    {
      id: 1,
      name: 'Company One',
      stock_ticker: 'COM1',
      exchange: 'NYSE',
      isin: 'US1234567890',
      website_url: 'http://companyone.com',
      user_id: 1,
    },
    {
      id: 2,
      name: 'Company Two',
      stock_ticker: 'COM2',
      exchange: 'NASDAQ',
      isin: 'US0987654321',
      website_url: 'http://companytwo.com',
      user_id: 1,
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MainComponent],
      imports: [HttpClientTestingModule, RouterTestingModule, FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);

    // mock the initial request for all companies
    fixture.detectChanges();
    const req = httpMock.expectOne(
      `${environment.apiUrl}/api/get-all-companies`
    );
    req.flush(mockCompanies);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch all companies on init', () => {
    expect(component.companies.length).toBe(2);
    expect(component.companies).toEqual(mockCompanies);
  });

  it('should fetch company by ID', () => {
    component.searchId = '1';
    component.fetchById();
    const req = httpMock.expectOne(`${environment.apiUrl}/api/company/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCompanies[0]);

    expect(component.companies.length).toBe(1);
    expect(component.companies[0]).toEqual(mockCompanies[0]);
    expect(component.searchId).toBe('');
  });

  it('should fetch company by ISIN', () => {
    component.searchIsin = 'US1234567890';
    component.fetchByIsin();
    const req = httpMock.expectOne(
      `${environment.apiUrl}/api/company/isin/US1234567890`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockCompanies[0]);

    expect(component.companies.length).toBe(1);
    expect(component.companies[0]).toEqual(mockCompanies[0]);
    expect(component.searchIsin).toBe('');
  });

  it('should handle unauthorized error', () => {
    spyOn(window, 'alert');
    spyOn(component['router'], 'navigate');

    component.fetchAll();
    const req = httpMock.expectOne(
      `${environment.apiUrl}/api/get-all-companies`
    );
    req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

    expect(window.alert).toHaveBeenCalledWith('Unauthorized');
    expect(component['router'].navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should handle not found error on fetchById', () => {
    spyOn(window, 'alert');

    component.searchId = '1';
    component.fetchById();
    const req = httpMock.expectOne(`${environment.apiUrl}/api/company/1`);
    req.flush('Not found', { status: 404, statusText: 'Not found' });

    expect(window.alert).toHaveBeenCalledWith('Not found!');
  });

  it('should handle not found error on fetchByIsin', () => {
    spyOn(window, 'alert');

    component.searchIsin = 'US1234567890';
    component.fetchByIsin();
    const req = httpMock.expectOne(
      `${environment.apiUrl}/api/company/isin/US1234567890`
    );
    req.flush('Not found', { status: 404, statusText: 'Not found' });

    expect(window.alert).toHaveBeenCalledWith('Not found!');
  });
});
