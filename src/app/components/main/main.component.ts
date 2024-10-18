import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, switchMap, timer, windowToggle } from 'rxjs';
// import { ConveyorCrusherMaintainanceService } from 'src/app/shared/services/conveyor-crusher-maintainance.service';
import { SensorsService } from 'src/app/shared/services/sensors.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit{

  isfalty = false;
  // dataSubscription: Subscription;

  constructor(
    private router: Router,
    private sensorsService: SensorsService,
   
  ) {

      // this.dataSubscription = timer(0, 500)
      // .pipe(
      //   switchMap(
      //     () => this.sensorsService.getSensorsData()
      //   )
      // ).subscribe(
      //   (data: any) => {
  
      //     this.decider(data);

      //   },
      //   (error) => {
      //     window.location.reload();
      //   }
      // )

   }
 
  ngOnInit(){

  }

  // deactivateSubscription(){
  //   this.dataSubscription.unsubscribe();
  // }


  decider(data: any){
    console.log(data);
    //for binful
    if(data.binfull){
      this.router.navigateByUrl('/filled-win');
      // this.deactivateSubscription();
    }
    //for bottle
   

      if(data.bottleStatus && data.metal == false && (data.weight > 6 && data.weight < 100) ){
        this.router.navigateByUrl('/bottle');
        // this.deactivateSubscription();
      }else if(data.bottleStatus && data.weight > 100){
        this.router.navigateByUrl('/bottle-error');
        // this.deactivateSubscription();
      }
    
   
    //for polybag
    if(data.polybag){
      this.router.navigateByUrl('/bottle',{state: {polybag: true}});
      // this.deactivateSubscription();
    }

    //for cans
    if(data.metal && (data.weight>6 && data.weight<30)){
      console.log("metal detected");
      this.router.navigateByUrl('/bottle');
      // this.deactivateSubscription();
    }else if(data.metal && (data.weight < 0 && data.weight > 40)){
      this.router.navigateByUrl('/bottle-error');
      // this.deactivateSubscription();
    }

  }
  ngOnDestroy(){

    // this.dataSubscription.unsubscribe();

  }

}
