import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription, timer } from 'rxjs';
import { DataService } from 'src/app/shared/services/data.service';
import { MachineDataService } from 'src/app/shared/services/machine-data.service';


@Component({
  selector: 'app-donate',
  templateUrl: './donate.component.html',
  styleUrls: ['./donate.component.scss']
})
export class DonateComponent implements OnInit{

  
  counter:number = 60;

  timerSubscription: Subscription;

  data: any = { 
    dataID: '', 
    machineID: '', 
    bottles: 0, 
    cans: 0,
    plastic: 0,
  };

  dataString:string = '';
  dataToPostAdmin: any;

  constructor(
    private toastr: ToastrService,
    private router: Router,
    private dataService: DataService,
    private machineDataService:MachineDataService
  ){
    this.dataToPostAdmin = this.machineDataService.getSavedData();
    
    // this.dataString = JSON.stringify(this.data);
    // console.log("Data string is ",this.dataString)
    this.timerSubscription = timer(0, 1000).subscribe(() => {
      if(this.counter > 0){
        this.counter--;
      }else{
        this.timerSubscription.unsubscribe();
        this.router.navigate(['/thank']);
      }
  });
  
  // this.dataService.postUserData(this.dataToPostAdmin).subscribe(
  //   (data:any) => {
  //     console.log(data);
  //   }
  // );

  // this.dataService.uploadImagesToCloud(this.data.dataID).subscribe(
  //   (data:any) => {
  //     console.log(data);
  //   }
  // );
  }

  
  ngOnInit() { }

  ngOnDestroy() {
    if (this.timerSubscription) {
    this.timerSubscription.unsubscribe();
  }
}

startTimer() {
  this.timerSubscription = timer(0, 1000).subscribe(() => {
    if (this.counter > 0) {
      this.counter--;
    } else {
      this.timerSubscription.unsubscribe();
      this.router.navigate(['/thank']);
    }
  });
}

// postInitialData() {
//   this.dataService.postUserData(this.data).subscribe(
//     (data: any) => {
//       console.log(data);
//     }
//   );

//   this.dataService.uploadImagesToCloud(this.data.dataID).subscribe(
//     (data: any) => {
//       console.log(data);
//     }
//   );
// }



  handleImageTap(destination: 'donate' | 'phone') {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }

    // let data = {
    //   id: this.data.dataID,
    //   mcid: this.data.machineID,
    //   bottles: this.data.bottles,
    //   cans: this.data.cans,
    //   polybags: this.data.plastic,
    // };
    if(destination == 'donate'){
      this.machineDataService.updateMachineData(this.dataToPostAdmin)
      // this.dataService.postUserData(this.dataToPostAdmin).subscribe(
      //   (response: any) => {
      //     console.log(response);
      //     this.navigateToDestination(destination);
      //   },
      //   (error) => {
      //     console.error('Error posting data:', error);
      //     // You might want to handle the error, maybe show a toastr message
      //     this.navigateToDestination(destination);
      //   }
      // );
    }
    else {
      this.navigateToDestination(destination);
    }
    
  }

  private navigateToDestination(destination: 'donate' | 'phone') {
    if (destination === 'donate') {
      this.router.navigate(['/thank']);
    } else {
      this.router.navigate(['/phone']);
    }
  }



  
  redirectToDonate() {
    this.stopTimerAndRedirect('/thank');
  }


  // New method for QR code image click
  redirectToPhone() {
    this.stopTimerAndRedirect('/phone');
  }

  private stopTimerAndRedirect(path: string) {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    this.postDataAndNavigate(path);
  }

  private postDataAndNavigate(path: string) {
    let data = {
      id: this.data.dataID,
      mcid: this.data.machineID,
      bottles: this.data.bottles,
      cans: this.data.cans,
      polybags: this.data.plastic,
    };

    this.dataService.postUserData(data).subscribe(
      (response: any) => {
        console.log(response);
        this.router.navigate([path]);
      },
      (error) => {
        console.error('Error posting data:', error);
        // You might want to handle the error, maybe show a toastr message
        this.router.navigate([path]);
      }
    );
  }  


}