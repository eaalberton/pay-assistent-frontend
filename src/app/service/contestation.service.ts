import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CheckContestationDTO } from '../model/CheckContestation.js';
import { HttpUtils } from '../http';

@Injectable({
  providedIn: 'root'
})
export class ContestationService {

  //private url:string = 'http://localhost:8080/contestation';
 
  constructor(
    private http:HttpClient, 
    private utils: HttpUtils
    ) { }

  check1(check:CheckContestationDTO):Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'text/xml; charset=utf-8;' });
    const options = {headers, responseType: 'text' as 'json'};
    return this.http.get<any>(this.utils.apiUrl += `contestation/check?cpf=${check.document}&merchant=${check.merchant}`, options);
  }

  check(check:CheckContestationDTO): Observable<any> {
    const url = `${this.utils.apiUrl}contestation/check`;
    return this.http.post<CheckContestationDTO>(url, check);
  }

}