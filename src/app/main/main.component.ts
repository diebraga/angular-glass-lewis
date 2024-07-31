import { Component } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent {
  companies = [
    {
      id: 2,
      name: 'Apple Inc.',
      stock_ticker: 'AAPL',
      exchange: 'NASDAQ',
      isin: 'US0378331005',
      website_url: 'http://www.apple.com',
      user_id: 1,
    },
    {
      id: 1,
      name: 'Updated Company Name',
      stock_ticker: 'UPDT',
      exchange: 'Updated Exchange',
      isin: 'US1234567890',
      website_url: 'http://www.updatedcompany.ie',
      user_id: 1,
    },
    {
      id: 4,
      name: 'Google',
      stock_ticker: 'GOOG',
      exchange: 'NASDAQ',
      isin: 'US0378354344',
      website_url: 'http://www.google.com',
      user_id: 1,
    },
    {
      id: 5,
      name: 'Stripe',
      stock_ticker: 'STRI',
      exchange: 'NYSE',
      isin: 'US030000044',
      website_url: 'http://www.stripe.com',
      user_id: 1,
    },
    {
      id: 3,
      name: 'LINUX',
      stock_ticker: 'LINX',
      exchange: 'NYSE',
      isin: 'US5678946789',
      website_url: 'www.lnx.ie',
      user_id: 1,
    },
  ];
}
