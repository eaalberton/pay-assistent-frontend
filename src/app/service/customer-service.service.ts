import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpUtils } from '../http';
import { environment } from 'src/environments/environment';
import { CustomerService, Merchant, Request, ServiceSummaryDto, User } from '../customer-service-summary/customer-service-summary.component.js';

@Injectable({
  providedIn: 'root'
})
export class CustomerServiceService {

  private readonly URL_API = `${environment.API}customer-service/`;
 
  constructor(
    private http:HttpClient, 
    private utils: HttpUtils
    ) { }

  findAllMerchants(): Observable<any> {
    const url = `${this.URL_API}find-all-merchants`;
    return this.http.get<Merchant[]>(url);
  }

  findAllRequests(): Observable<any> {
    const url = `${this.URL_API}find-all-requests`;
    return this.http.get<Request[]>(url);
  }

  findDetail(userId: number, merchantId: number): Observable<any> {
    const url = `${this.URL_API}find-detail?userId=${userId}&merchantId=${merchantId}`;
    return this.http.get<CustomerService[]>(url);
  }

  findSummary(userId: number): Observable<any> {
    const url = `${this.URL_API}find-summary?userId=${userId}`;
    return this.http.get<ServiceSummaryDto[]>(url);
  }

  save(customerService:CustomerService): Observable<any> {
    const url = `${this.URL_API}save`;
    return this.http.post<CustomerService>(url, customerService);
  }

  remove(id: number) {
    const url = `${this.URL_API}${id}`;
    return this.http.delete(url);
  }

}
