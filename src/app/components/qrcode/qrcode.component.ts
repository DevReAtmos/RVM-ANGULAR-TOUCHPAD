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


  data: any = {
    // dataID: '',
    machineID: '',

    bottles: 0,
    cans: 0,
    Date: "",
    Recycled_items: 2,
    Location:"Ahmedabad",
    Coin_Earned:"7000",
    Phone_no:"8511195381",
    transaction_id: "" ,
    
  
  };

  
  dataString:string = '';
  currentDate = new Date();
  date =this.currentDate.toISOString();
  Res =2;

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
    this.dataString = JSON.stringify(this.data);
    console.log("data are ",this.dataString);

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

  this.dataService.uploadImagesToCloud(this.data.dataID).subscribe(
    (data:any) => {
      console.log(data);
    }
  );
  }

  myObject(){
    return{
    Date: this.date,
    Recycled_items: this.Res,
    Location:"Ahmedabad",
    Coin_Earned:"7000",
    Phone_no:"8511195381",
    transaction_id: "",
    // valid:true
    };
  }

  getData(){
    let data = this.machineDataService.getSavedData();
    console.log("User data",data);
   
    
    // this.dataString = data; 
  }

  ngOnInit() { }



  //  when User pres next button this data will stored on database
  next(){
    let data = {
      // id: this.data.dataID,
      mcid: this.data.machineID,
      bottles: this.data.bottles,
      cans: this.data.cans,
      phone : '8511195381',
      date : this.date,
      // polybags: this.data.plastic,
      weight: 0,

    }
//  Here data is posting in backend
    this.dataService.postUserData(data).subscribe(
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
