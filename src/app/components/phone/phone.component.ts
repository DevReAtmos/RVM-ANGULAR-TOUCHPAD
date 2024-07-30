import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MachineDataService } from 'src/app/shared/services/machine-data.service';

@Component({
  selector: 'app-phone',
  templateUrl: './phone.component.html',
  styleUrls: ['./phone.component.scss']
})
export class PhoneComponent implements OnInit{

  phoneNumber: string = '';
  isPhoneNumberInvalid: boolean = false;

  constructor(
    private toastrService: ToastrService,
    private router: Router,
    private machineDataService :MachineDataService
  ){}

  ngOnInit(){}

  nextPressed(){
    if(this.phoneNumber.length == 10){
      this.setPhoneNumberOnLocalStorage(this.phoneNumber);
      this.router.navigateByUrl('/qr-code');
    }else{
      this.isPhoneNumberInvalid = true;
      setTimeout(() => {
        this.isPhoneNumberInvalid = false;
      }, 3000);

    }
  }

  //  If user has pressed enter then this Data should go Admin panel
  cancelPressed(){
    let data = this.machineDataService.getSavedData();
    this.machineDataService.updateMachineData(data);
    sessionStorage.clear();
    this.router.navigate(['/home']);
  }

  numPressed(number:string){
    this.phoneNumber += number;
  }

  clear(){
    this.phoneNumber = '';
  }

  delete(){
    this.phoneNumber = this.phoneNumber.slice(0, -1);
  }

  setPhoneNumberOnLocalStorage(phoneNumber:String){
    let data = this.machineDataService.getSavedData();
    console.log("==============> in setphone method",data);
    if (!data) {
      data = {
        totalBottleCount: 0,
        totalCanCount: 0,
        totalPolybagCount: 0,
        totalWeightBottle: 0,
        totalWeightCans: 0,
        phoneNumber: ''
      };
    }
    data.phoneNumber = phoneNumber;
    this.machineDataService.setSaveDataOnLocalStorage(data);
    this.machineDataService.updateMachineData(data);
  }

  ngOnDestroy(){
    
  }

}
