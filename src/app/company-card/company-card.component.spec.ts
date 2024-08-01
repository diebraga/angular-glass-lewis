import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CompanyCardComponent } from './company-card.component';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

describe('CompanyCardComponent', () => {
  let component: CompanyCardComponent;
  let fixture: ComponentFixture<CompanyCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompanyCardComponent],
      imports: [RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(CompanyCardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render company details correctly', () => {
    const mockCompany = {
      id: 1,
      name: 'Test Company',
      stock_ticker: 'TEST',
      exchange: 'NYSE',
      isin: 'US1234567890',
      website_url: 'http://testcompany.com',
    };

    component.company = mockCompany;
    fixture.detectChanges();

    const companyName = fixture.debugElement.query(By.css('h3')).nativeElement;
    const companyId = fixture.debugElement.queryAll(By.css('p'))[0]
      .nativeElement;
    const companyTicker = fixture.debugElement.queryAll(By.css('p'))[1]
      .nativeElement;
    const companyExchange = fixture.debugElement.queryAll(By.css('p'))[2]
      .nativeElement;
    const companyIsin = fixture.debugElement.queryAll(By.css('p'))[3]
      .nativeElement;
    const companyWebsite = fixture.debugElement.query(
      By.css('a[href]')
    ).nativeElement;
    const updateLink = fixture.debugElement.queryAll(By.css('a'))[1]
      .nativeElement;

    expect(companyName.textContent).toContain('Test Company');
    expect(companyId.textContent).toContain('ID: 1');
    expect(companyTicker.textContent).toContain('Ticker: TEST');
    expect(companyExchange.textContent).toContain('Exchange: NYSE');
    expect(companyIsin.textContent).toContain('ISIN: US1234567890');
    expect(companyWebsite.textContent).toContain('http://testcompany.com');
    expect(updateLink.getAttribute('href')).toBe('/main/1');
  });
});
