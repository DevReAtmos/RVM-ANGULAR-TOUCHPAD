import { Injectable } from '@angular/core';
import { Config } from '../config/config';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class MachineDataService {

  apiUrl = Config.baseUrl

  constructor(
    private http: HttpClient
  ) { }

  getMachineData() {
    return this.http.get(this.apiUrl + '/get-machine-data');
  }

  clearMachineData(){
    return this.http.get(this.apiUrl + '/clear-machine-data');
  }

  getMachineInfo(){
    return this.http.get(this.apiUrl + '/get-machine-info');
  }

  updateMachineInfo(data:any){
    return this.http.post(this.apiUrl + '/update-machine-info', data);
  }

  updateMachineData(data:any){
    console.log("data that posting on back-end",data)
    return this.http.post(this.apiUrl + '/update-machine-data', data);
  }

  setSaveDataOnLocalStorage(savedData:any){
    console.log("------------data that saved on local-------------->",savedData );
    sessionStorage.setItem('data', JSON.stringify(savedData));
  }

  getSavedData(){
    let data = sessionStorage.getItem('data');
    console.log("------------data that get on local-------------->",data );
    return data ? JSON.parse(data) : null;
  }

  setMachineInfoStoreLocally(data:any){
    console.log(data)
    sessionStorage.setItem('machine' ,JSON.stringify(data))
  }

  getMachineInfoStoreLocally(){
    let data = sessionStorage.getItem('machine');
    return data ? JSON.parse(data) : null;
  }
}
