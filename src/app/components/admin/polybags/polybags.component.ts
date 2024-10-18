import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription, filter, switchMap, timer } from 'rxjs';
import { PolybagService } from 'src/app/shared/services/polybag.service';

@Component({
  selector: 'app-polybags',
  templateUrl: './polybags.component.html',
  styleUrls: ['./polybags.component.scss']
})
export class PolybagsComponent implements OnInit{
  CounterSensorConfig: any;

  offDisabled = false;
  onDisabled = false;
  dataSubscription: Subscription;
  pauseDataService = false;

  sensorStatus:boolean = true;


  constructor(
    private toastr: ToastrService,
    private polybagsService: PolybagService
  ) {
    this.polybagsService.getCounterStatus().subscribe((data:any)=>{
      this.CounterSensorConfig = data;
      if(this.CounterSensorConfig.active == true){
        this.onDisabled = true;
      }else{
        this.offDisabled = true;
        this.pauseDataService = true;
      }
    },
    (error)=>{
      this.toastr.error('Error getting data from server', 'Error');
    });

    this.dataSubscription = timer(0,1000)
    .pipe(
      switchMap(()=>this.polybagsService.getCounterData())
    )
    .pipe(
      filter((data: any) => {
        return !this.pauseDataService;
      })
    ).subscribe(
      (data:any)=>{
        this.sensorStatus = data["polybag"];
        console.log(this.sensorStatus);
      },
      (error)=>{
        this.toastr.error('Error getting data from server', 'Error');
      }
    );
    
  }


  ngOnInit() {}


  byPass(){
    this.polybagsService.bypassCounter(false).subscribe((data:any)=>{
      this.CounterSensorConfig = data;
      this.offDisabled = true;
      this.onDisabled = false;
      this.pauseDataService = true;
      this.toastr.warning('Counter Sensor Bypassed', 'Warning');
    },
    (error)=>{
      this.toastr.error('Error Bypassing Counter Sensor', 'Error');
    });
  }

  removeByPass(){
    this.polybagsService.bypassCounter(true).subscribe((data:any)=>{
      this.CounterSensorConfig = data;
      this.offDisabled = false;
      this.onDisabled = true;
      this.pauseDataService = false;
      this.toastr.success('Counter Sensor bypass Removed', 'Success');
    },(error)=>{
      this.toastr.error('Error Removing Counter bypass Sensor', 'Error');
    });
  }

  ngOnDestroy(){
    this.dataSubscription.unsubscribe();
  }

}
