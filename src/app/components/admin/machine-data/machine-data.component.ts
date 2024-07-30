import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MachineDataService } from 'src/app/shared/services/machine-data.service';

@Component({
  selector: 'app-machine-data',
  templateUrl: './machine-data.component.html',
  styleUrls: ['./machine-data.component.scss']
})
export class MachineDataComponent implements OnInit{
  totalBottles:number = 0;
  totalCans:number = 0;
  totalPolybags: number = 0;
  totalWeightBottle:number =0;
  totalWeightCans:number = 0;

  
  constructor(
    private toastr: ToastrService,
    private machineDataServie: MachineDataService
  ) {

      this.getData();

   }

  ngOnInit() { }

  resetData(){
    this.machineDataServie.clearMachineData().subscribe((res:any) => {
      this.totalBottles = 0;
      this.totalCans = 0;
      this.totalPolybags = 0;
      this.totalWeightBottle = 0;
      this.totalWeightCans = 0;
      this.toastr.warning("Local Data Counter Reset", "Warning");
    },
    (err:any) => {
      this.toastr.error(err.error.message);
    });
  }
// Admin Panel visible data
  getData(){
   
    // console.log("debugging statement of saved data",data);
    this.machineDataServie.getMachineData().subscribe((res:any) => {

      this.totalBottles = res.bottles;
      this.totalCans = res.cans;
      this.totalPolybags = res.polybags;
      this.totalWeightBottle = res.totalWeightBottle ;
      this.totalWeightCans = res.totalWeightCans;

    },
    (err:any) => {
      this.toastr.error(err.error.message);
    });
  }
  
  


}
