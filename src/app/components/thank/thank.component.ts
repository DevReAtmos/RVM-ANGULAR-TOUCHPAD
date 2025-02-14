import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/shared/services/data.service';
import { MachineDataService } from 'src/app/shared/services/machine-data.service';

@Component({
  selector: 'app-thank',
  templateUrl: './thank.component.html',
  styleUrls: ['./thank.component.scss']
})
export class ThankComponent implements OnInit{
  dataString: string = '';
  dataToPostAdmin: any;
  data: any;
  currentDate = new Date();
  date = this.currentDate.toISOString();
  localdata: any;
  machineinfo: any;
  isProcessing: boolean = false;
  constructor(
    private router: Router,
    private machineDataService:MachineDataService,
    private dataService:DataService

  ){
    this.localdata = this.machineDataService.getSavedData();
    this.machineinfo = this.machineDataService.getMachineInfoStoreLocally();
    this.data = { 
      mcid: this.machineinfo.mcid,
      bottles: this.localdata.totalBottleCount,
      cans: this.localdata.totalCanCount,
      polybag: this.localdata.totalPolybagCount,
      weight: this.localdata.totalWeightBottle + this.localdata.totalWeightCans,
      date: this.date.split('T')[0], // Assuming you want to send only the date part
      time: '', // Ensure time is filled as per your requirement
      city:  this.machineinfo.city, // Assuming city is constant for now
    };

    this.dataString = JSON.stringify(this.data);
    console.log("Donate data ----------", this.dataString);
    this.updateData()
    setTimeout(() => {
      sessionStorage.clear();
      this.router.navigate(['/']);
    }, 5000);
  }

  ngOnInit() { }

  updateData(){
    this.dataService.donatedata(this.dataString).subscribe(
        (data: any) => {
          console.log('Data posted successfully:', data);
          // this.router.navigate(['/thank']);
        },
        (error) => {
          console.error('Error posting data:', error);
          // this.router.navigate(['/thank']); // Handle error and navigate
        }
      );
  }
  ngOnDestroy() { 
        
    
  }

}
