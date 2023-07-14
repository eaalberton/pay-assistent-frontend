import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CheckContestationDTO } from '../model/CheckContestation.js';
import { HttpUtils } from '../http';
import { environment } from 'src/environments/environment';
import { ImportContestationDTO } from '../model/ImportContestationDTO.js';

@Injectable({
  providedIn: 'root'
})
export class ContestationService {

  private readonly URL_API = `${environment.API}contestation/`;
 
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
    const url = `${this.URL_API}check`;
    return this.http.post<CheckContestationDTO>(url, check);
  }

  import(file:FormData): Observable<any> {
    const url = `${this.URL_API}import`;
    return this.http.post<any>(url, file);
  }

}