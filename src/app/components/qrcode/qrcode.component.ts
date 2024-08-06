import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription, timer } from 'rxjs';
import { DataService } from 'src/app/shared/services/data.service';
import { MachineDataService } from 'src/app/shared/services/machine-data.service';


@Component({
  selector: 'app-qrcode',
  templateUrl: './qrcode.component.html',
  styleUrls: ['./qrcode.component.scss']
})
export class QrcodeComponent implements OnInit{
  counter:number = 60;
  timerSubscription: Subscription;
  Location ='';
  city ="";
  data: any;
  qrdata:any;
  dataString:string = '';
  currentDate = new Date();
  date =this.currentDate.toISOString();
  count:any;
  localdata:any;
  machineinfo:any;

  constructor(
    private toastr: ToastrService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dataService: DataService,
    private machineDataService :MachineDataService
  ){
    currentDate:Date;
    // this.activatedRoute.queryParams.subscribe(params => {
    //   console.log('Query Params:', params);  // Debug query parameters

    //   // Check if params are available and assign values, default to 0 or empty string
    //   this.data.dataID = params['dataID'] || '';
    //   this.data.machineID = params['machineID'] || '';
    //   this.data.bottles = this.isValidNumber(params['bottles']) ? Number(params['bottles']) : 0;
    //   this.data.cans = this.isValidNumber(params['cans']) ? Number(params['cans']) : 0;
    //   this.data.plastic = this.isValidNumber(params['plastic']) ? Number(params['plastic']) : 0;

    //   const totalWeightBottle = this.isValidNumber(params['totalWeightBottle']) ? Number(params['totalWeightBottle']) : 0;
    //   const totalWeightCans = this.isValidNumber(params['totalWeightCans']) ? Number(params['totalWeightCans']) : 0;
    //   this.data.weight = totalWeightBottle + totalWeightCans;

    //   console.log('Data after assignment:', this.data);  
    //   // console.log('Query Params:', params);
    //   // this.data.dataID = params['dataID'];
    //   // this.data.machineID = params['machineID'];
    //   // this.data.bottles = params['bottles'];
    //   // this.data.cans = params['cans'];
    //   // this.data.plastic = params['plastic'];
    //   // this.data.weight = params['totalWeightBottle'] +  params['totalWeightCans'] ;
    //   // totalPolybagCount: this.totalPolybagCount, totalWeightBottle :this.totalWeightBottle,totalWeightCans :this.totalWeightCans
    // });
    
    this.getData(); 
    this.localdata =this.machineDataService.getSavedData();
    this.machineinfo = this.machineDataService.getMachineInfoStoreLocally();
    this.count = this.localdata.bottles + this.localdata.cans
    console.log("Local data value is",this.localdata);

    this.data = {
      // dataID: '',
      mcid: this.machineinfo.mcid,
      phone: this.localdata.phone,
      bottle: this.localdata.totalBottleCount,
      can: this.localdata.totalCanCount,
      bags: 0,
      dt: this.date,
      time : '',
      weight: this.localdata.totalWeightBottle + this.localdata.totalWeightCans,
      // transaction_id: "", 
    };

    this.dataString = JSON.stringify(this.data);
    console.log("data are ",this.dataString);
    this.qrdata = this.getObjectAsString(this.myObject());
    this.timerSubscription = timer(0, 1000).subscribe(() => {
      if(this.counter > 0){
        this.counter--;
      }else{
        this.timerSubscription.unsubscribe();
        this.router.navigate(['/thank']);
      }
  });
  
  this.dataService.postUserData(this.data).subscribe(
    (data:any) => {
      console.log(data);
    }
  );


  // this.dataService.uploadImagesToCloud(this.data.dataID).subscribe(
  //   (data:any) => {
  //     console.log(data);
  //   }
  // );
  }

  myObject(){
    return{
    Date: this.date,
    Recycled_items: this.count ,
    Location: this.machineinfo.city,
    Coin_Earned: this.count,
    Phone_no: this.localdata.phoneNumber,
    transaction_id: "",
    // valid:true
    };
  }

  
  getData(){
    let data = this.machineDataService.getSavedData();
    console.log("User data",data);
    this.machineDataService.updateMachineData(data);
    // this.dataString = data; 
  }

  getObjectAsString(obj: any): string {
    return JSON.stringify(obj);
  }

  ngOnInit() { }

  //  when User pres next button this data will stored on database
  next(){  
//  Here data is posting in backend
    this.dataService.postUserData(this.data).subscribe(
      (data:any) => {
        console.log(data);
      }
    );
    
    this.router.navigate(['/thank']);
  }

  isValidNumber(value: any): boolean {
    return !isNaN(value) && value !== null && value !== '' && value !== undefined;
  }

  ngOnDestroy() {
    this.timerSubscription.unsubscribe();
  }

}
