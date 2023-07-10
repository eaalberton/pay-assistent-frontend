import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
  })
  export class HttpUtils {
  
    apiUrl = 'http://localhost:8080/';
  
    constructor() { }
  
    public setParams(parameters: any = {}) {
      return { params: parameters };
    }
  
    public setJsonBody(data: any): string {
      return JSON.stringify(data);
    }
  
    public jsonParse(data: any): string {
      return JSON.parse(data);
    }
  
    get skipInterceptorHeader() {
      return 'X-Skip-Interceptor';
    }
  }