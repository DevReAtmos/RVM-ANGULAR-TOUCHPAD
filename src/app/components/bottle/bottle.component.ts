import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription, switchMap, timer } from 'rxjs';
import { BottleBlocService } from 'src/app/shared/services/bottle-bloc.service';
import { ConveyorCrusherMaintainanceService } from 'src/app/shared/services/conveyor-crusher-maintainance.service';
import { MachineDataService } from 'src/app/shared/services/machine-data.service';
import { SensorsService } from 'src/app/shared/services/sensors.service';

@Component({
  selector: 'app-bottle',
  templateUrl: './bottle.component.html',
  styleUrls: ['./bottle.component.scss']
})

export class BottleComponent implements OnInit{
  phoneNumber:string ='';
  totalBottleCount:number = 0;
  totalCanCount:number = 0;
  totalPolybagCount:number = 0;
  totalWeightBottle:number =0;
  totalWeightCans:number = 0;
  hideButtons:boolean = false;
  isCrushing: boolean = false;
  counter:number = 60;
  disableButton:boolean = false;
  statusColor:string = "green";
  showStatus:boolean = false;
  machineID: string = '';
  timeStamp: string = '';
  Location: string ='';
  isvalid :boolean = true;
  dataID: string = '';
  dateTimeObj = new Date();
  status:string = "Bottle is crushing please wait...";
  increment:boolean =false;
  conveyorCrusherData:any;
  counterSubsription: Subscription;
  dataSubscription: Subscription;
  isBottleDetected:boolean = false;
  // countsensorSubsription:Subscription;
  SavedData:any;
  machineInfo:any;
  setTimeoutHandle: any;
 
  inc = false;
  constructor(
    private router: Router,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private sensorsService: SensorsService,
    private machineData: MachineDataService,
    private bottleBlocService: BottleBlocService,
    private conCrushService: ConveyorCrusherMaintainanceService,
    
  ) {

    
    this.machineData.getMachineInfo().subscribe(
      (data:any) => {
        this.machineID = data.mcid;
        this.timeStamp = this.dateTimeObj.toLocaleString();
        this.timeStamp = this.timeStamp.replace(' ', '');
        this.timeStamp = this.timeStamp.replace('/', '');
        this.timeStamp = this.timeStamp.replace('/', '');
        this.timeStamp = this.timeStamp.replace(',', '');
        this.timeStamp = this.timeStamp.replace(':', '');
        this.timeStamp = this.timeStamp.replace(':', '');
        this.timeStamp = this.timeStamp.replace(' ', '');

        this.dataID = this.machineID + this.timeStamp;
        this.machineInfo ={
          mcid : data.mcid,
          city : data.city
        }
        this.machineData.setMachineInfoStoreLocally(this.machineInfo);
        console.log(this.dataID);
      },(err) => {
        toastr.error("Something went wrong please try again later");
        router.navigate(['/home']);
      });

    //  adding polybag counter
    this.activatedRoute.data.subscribe(
      (data:any) => {
        if(data.polybag){
          this.totalPolybagCount += 1;
        }
    });

    // counter details
    this.counterSubsription = timer(0,1000).pipe(
      ).subscribe(
          ()=>{
            if(this.counter > 0){
              this.counter--;
            }else{
              this.counterSubsription.unsubscribe();
              this.next();
          }
        }
      );
  // this.counterSubsription.unsubscribe();
      
  //   data = {
  //     "weight": tempweight,
  //     #"polybag": polybag,
  //     "metal": metal,
  //     "binfull": binfull,
  //     "bottleStatus": bottleStatus
  // }
      //  data  fromate will be this type and this data passed to decided

      this.dataSubscription = timer(0, 700).
        pipe(
          switchMap( () => this.sensorsService.getSensorsData())
        ).subscribe(
          (data: any) => {
            console.log("weights are",data);
            
            this.decider(data);
           
          },(err) => {
            toastr.error("Something went wrong please try again later");
            router.navigate(['/home']);
          });
 
   }

  ngOnInit() { }

//  here identifying that is bottle crushing or cans or polybag 
  crush(dataID: string, bottle: boolean, can: boolean, polybag: boolean){
    let trigger = polybag? false: true;
    let timeOut = polybag? 2000: 8000;

    this.bottleBlocService.triggerCrush(bottle, can, polybag, trigger, dataID).subscribe(
    (data)=>{
      setTimeout(() => {
        this.bottleBlocService.triggerCrush(bottle, can, polybag, false, dataID).subscribe(
          (data:any) => {
            console.log(data);
          },(err) => {
            this.toastr.error("Something went wrong please try again later");
            this.router.navigate(['/home']);
          }
        )
        this.isCrushing = false;
        this.hideButtons = false;
      }, timeOut);
    },(err) => {
      this.toastr.error("Something went wrong please try again later");
      this.router.navigate(['/home']);
    }
  );
  }

  reverseConvActive(){
    console.log("conveyor crusher data" ,this.conveyorCrusherData);
    this.conCrushService.gpioTrigger(this.conveyorCrusherData.conveyor_rw.pin,true)
    .subscribe(
      (data:any)=>{
        setTimeout(()=>{
          console.log("getting out put of crushconveyor data",data);
          this.resetConvActive();
        },4000);
      },(error)=>{
        this.toastr.error(error.message,'Error');
      }
    );

  }

  resetConvActive(){
      this.conCrushService.gpioTrigger(this.conveyorCrusherData.conveyor_rw.pin,false)
      .subscribe(
        (data:any)=>{
          this.isCrushing = false;
          this.hideButtons = false;
        },(error)=>{
          this.toastr.error(error.message,'Error');
        }
      );
  
  }


  getconcrusherinfo(){
    this.conCrushService.getConvCrusherInfo().subscribe(
            (data:any)=>{
              this.conveyorCrusherData = data;
              this.reverseConvActive();
            },(error)=>{
              console.log(error);
            }
          );
  }

   //   data = {
  //     "weight": tempweight,
  //     #"polybag": polybag,
  //     "metal": metal,
  //     "binfull": binfull,
  //     "bottleStatus": bottleStatus
  // }
  //  this data formated passes here

  decider(data:any){
    if(!this.isCrushing){
       console.log("data are",data);
       let inc = data.counter;
       console.log("counter value is",data.counter);
       if(inc){
        console.log("counter value is",inc);
            if(data.bottleStatus && (data.weight > 6 && data.weight < 100)){ 
              console.log("bottle status",data.bottleStatus);
              console.log("weight of bottle",data.weight);
              this.isBottleDetected =true; //weight
              this.isCrushing = true;
              this.hideButtons = true;
              this.isvalid = true;
              this.totalBottleCount = this.totalBottleCount + 1;
              clearTimeout(this.setTimeoutHandle);
              // Adding weight for bottles 
              this.totalWeightBottle = this.totalWeightBottle + data.weight;
              console.log("Total bottle weight right now",this.totalWeightBottle);
              this.counter = 60;
              this.crush(this.dataID, true, false, false);
            }
            else if(data.bottleStatus && data.weight > 100){
              this.counter = 60;
              this.isCrushing = true;
              this.hideButtons = true;
              this.getconcrusherinfo();
              // this.reverseConvActive();
              this.toastr.error("Error","Please empty the bottle", {timeOut: 3000});
            }

            if(data.metal && (data.weight > 0 && data.weight < 30)){
              this.isCrushing = true;
              this.hideButtons = true;
              this.totalCanCount = this.totalCanCount + 1;
              clearTimeout(this.setTimeoutHandle);
              this.isvalid = true;
              this.isBottleDetected =true;
              this.totalWeightCans = this.totalWeightCans + data.weight;
              console.log("Total can weight right now",this.totalWeightCans);
              this.counter = 60;
              this.crush(this.dataID, false, true, false);
            }
            else if(data.metal && data.weight > 30){
              this.isCrushing = true;
              this.hideButtons = true;
              this.counter = 60;
              this.getconcrusherinfo();
              this.toastr.error("Error","Please empty the can", {timeOut: 3000});
              // this.router.navigateByUrl('/can-error');
            }
       }
       else{
          console.log("in else part ",inc);
          console.log("conveyour trun off");
          if(data.bottleStatus ){
            this.isvalid = true;
          }
          // if(this.isvalid ){
          //   this.isvalid = false;
          //   console.log("running convy second time");

          //   this.crush(this.dataID, true, false, false);
          //   this.setTimeoutHandle = setTimeout(() => { 
          //     if(this.totalBottleCount == 0 && this.totalCanCount == 0 ){
          //       this.toastr.error("Error","Please insert bottle", {timeOut: 3000});
          //       this.router.navigateByUrl('/home');
          //     }
          //   }, 8000);
          // }       
       }   
      if(data.bottleStatus && data.weight > 100){
        this.counter = 60;
        this.isCrushing = true;
        this.hideButtons = true;
        this.getconcrusherinfo();
        // this.reverseConvActive();
        this.toastr.error("Error","Please empty the bottle", {timeOut: 3000});
      }

      //for polybag
      if(data.polybag){
        console.log(data.bottleStatus);
        console.log(data.weight);
        this.isCrushing = true;
        this.hideButtons = true;
        this.totalPolybagCount = this.totalPolybagCount + 1;
        this.counter = 60;
        this.crush(this.dataID, false, false, true);
      }

     
      if(data.metal && data.weight > 30){
        this.isCrushing = true;
        this.hideButtons = true;
        this.counter = 60;
        this.getconcrusherinfo();
        this.router.navigateByUrl('/can-error');
      }

    }
  }


  saveData(){
    let data = {
      "dataID": this.dataID,
    }
    this.bottleBlocService.uploadImagesCloud(data).subscribe(
      (data:any) => {
        console.log(data);
      },(err) => {
        this.toastr.error("Something went wrong please try again later");
        this.router.navigate(['/home']);
      }
    );
  }
  
  //  Here if user pressed back then route moved to home and only dataId will save
  //   this.dataID = this.machineID + this.timeStamp; Here data id generate.
  // ************** require to add function such that when user cancel ahead procedure then 
  // their data must save and visible at amdin panel

  back(){
    this.disableButton = true;
    // this.saveData();
    this.savedData();
    sessionStorage.clear();
    this.router.navigate(['/home']);
  }

  

  next(){
    this.disableButton = true;
    // this.saveData();
    this.savedData();
    // this.savedData();
    // this.router.navigate(['/qr-code'], {queryParams: {totalBottleCount: this.totalBottleCount, totalCanCount: this.totalCanCount, totalPolybagCount: this.totalPolybagCount, totalWeightBottle :this.totalWeightBottle,totalWeightCans :this.totalWeightCans , dataID: this.dataID, machineID: this.machineID, timeStamp: this.timeStamp}});
    this.router.navigateByUrl('/donate');
   
  }

  savedData(){
   
    this.SavedData ={
      totalBottleCount: this.totalBottleCount,
      totalCanCount:this.totalCanCount ,
      totalPolybagCount:this.totalPolybagCount,
      totalWeightBottle:this.totalWeightBottle,
      totalWeightCans:this.totalWeightCans,
      phoneNumber :''
    }

     this.machineData.setSaveDataOnLocalStorage(this.SavedData);
     let data = this.machineData.getSavedData();
     console.log("After retriving data from local",data);
     this.machineData.updateMachineData(data).subscribe((res)=>{
        console.log("After retriving data from local", res);
     },(error) =>{
      console.error("Error occurred :",error);
     },
    );

    // sessionStorage.setItem('data', this.SavedData);
  }

  
  //  future work
  SaveLocalStorageOFmachine(){

  }

  ngOnDestroy() { 
    this.counterSubsription.unsubscribe();
    this.dataSubscription.unsubscribe();
  }

}
