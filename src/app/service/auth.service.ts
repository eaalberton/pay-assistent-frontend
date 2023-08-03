import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CheckContestationDTO } from '../model/CheckContestation.js';
import { HttpUtils } from '../http';
import { environment } from 'src/environments/environment';
import { CredentialsDto } from '../model/CredentialsDto.js';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly URL_API = `${environment.API}`;

  isLogged = new EventEmitter<boolean>();

  constructor(
    private http:HttpClient, 
    private utils: HttpUtils
    ) { }

    getAuthToken(): string | null {
      return window.localStorage.getItem("auth_token");
    }
  
    setAuthToken(token: string | null): void {
      if (token !== null) {
        window.localStorage.setItem("auth_token", token);
        this.isLogged.emit(true);
      } else {
        window.localStorage.removeItem("auth_token");
        this.isLogged.emit(false);
      }
    }

  login(credentialsDto:CredentialsDto): Observable<any> {
    const url = `${this.URL_API}login`;
    return this.http.post<CheckContestationDTO>(url, credentialsDto);
  }

  register(credentialsDto:CredentialsDto): Observable<any> {
    const url = `${this.URL_API}register`;
    return this.http.post<CheckContestationDTO>(url, credentialsDto);
  }

  validadeAuth(): Observable<any> {
    //const headers = new HttpHeaders({ 'Content-Type': 'text/xml; charset=utf-8;' });
    //const options = {headers, responseType: 'text' as 'json'};
    const url = `${this.URL_API}validate`;
    return this.http.get<string>(url);//, options);
  }
}
