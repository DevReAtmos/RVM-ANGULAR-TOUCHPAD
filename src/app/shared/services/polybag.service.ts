import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Config } from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class PolybagService {

  apiUrl = Config.baseUrl;

  constructor(
    private http: HttpClient,    
  ) { }


  // getPolybagStatus(){
  //   return this.http.get(this.apiUrl + '/get-polybag-status');
  // }

  getCounterStatus(){
    return this.http.get(this.apiUrl + '/get-counter-status');
  }

  // getPolybagData(){
  //   return this.http.get(this.apiUrl + '/get-polybag-data');
  // }

  getCounterData(){
    return this.http.get(this.apiUrl + '/get-counter-data');
  }

  // bypassPolybag(active:boolean){
  //   return this.http.post(this.apiUrl + '/bypass-polybag', {"active": active});
  // }

  bypassCounter(active:boolean){
    return this.http.post(this.apiUrl + '/bypass-counter', {"active": active});
  }
}
