import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpUtils } from '../http';
import { environment } from 'src/environments/environment';
import { FileDTO, ReceiptDTO } from '../receipt/receipt.component';

@Injectable({
  providedIn: 'root'
})
export class ReceiptService {

  private readonly URL_API = `${environment.API}receipt/`;
 
  constructor(
    private http:HttpClient, 
    private utils: HttpUtils
    ) { }

  generateReceipt(receiptDTO: ReceiptDTO): Observable<any> {
    //console.log(receiptDTO.metadata);
    const url = `${this.URL_API}generate`;
    return this.http.post(url, receiptDTO, {
      responseType: 'blob' as 'json'
    });
  }

  generateReceiptInMemory(receiptDTO: ReceiptDTO): Observable<any> {
    //console.log(receiptDTO.metadata);
    const url = `${this.URL_API}generate-in-memory`;
    return this.http.post<FileDTO>(url, receiptDTO);
  }
}
