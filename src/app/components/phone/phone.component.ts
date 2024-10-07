import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/shared/services/data.service';
import { MachineDataService } from 'src/app/shared/services/machine-data.service';

@Component({
  selector: 'app-phone',
  templateUrl: './phone.component.html',
  styleUrls: ['./phone.component.scss']
})
export class PhoneComponent implements OnInit{

  phoneNumber: string = '';
  isPhoneNumberInvalid: boolean = false;
  count:any;
  localdata:any;
  machineinfo:any;
  data:any;
  dataString:any;
  currentDate = new Date();
  date =this.currentDate.toISOString();

  constructor(
    private toastrService: ToastrService,
    private router: Router,
    private machineDataService :MachineDataService,
    private dataService: DataService,
  ){

  }

  ngOnInit(){}

  nextPressed(){
    
    if(this.phoneNumber.length == 10){
      this.setPhoneNumberOnLocalStorage(this.phoneNumber);
      // this.submitData();

      console.log("Local data value is",this.localdata);
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
    // let data = this.machineDataService.getSavedData();
    // this.machineDataService.updateMachineData(data);
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

  submitData(){
    this.getData();
    this.localdata =this.machineDataService.getSavedData();
    this.machineinfo = this.machineDataService.getMachineInfoStoreLocally();
    this.count = this.localdata.totalBottleCount + this.localdata.totalCanCount
    console.log("Local data value is",this.localdata);
    this.data = {
      // dataID: '',
      mcid: this.machineinfo.mcid,
      phone: this.localdata.phoneNumber,
      bottle: this.localdata.totalBottleCount,
      can: this.localdata.totalCanCount,
      bags: 0,
      dt: this.date.split('T')[0],
      time : '',
      city:  this.machineinfo.city,
      // weight: this.localdata.totalWeightBottle + this.localdata.totalWeightCans,
      // transaction_id: "", 
    };
    this.dataString = JSON.stringify(this.data);
    this.dataService.postUserData(this.dataString).subscribe((data:any)=>{
      console.log("data posted ",data);
    });
  }

  getData(){
    let data = this.machineDataService.getSavedData();
    console.log("User data",data);
    this.machineDataService.updateMachineData(data);
    // this.dataString = data; 
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
    else {
      console.log("Here this statement must print!!");
    }
    data.phoneNumber = phoneNumber;
    this.machineDataService.setSaveDataOnLocalStorage(data);
    // this.machineDataService.updateMachineData(data);
  }

  ngOnDestroy(){
    
  }

}

