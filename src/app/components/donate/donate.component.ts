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
export class DonateComponent implements OnInit {
  counter: number = 60;
  timerSubscription: Subscription;
  dataString: string = '';
  dataToPostAdmin: any;
  data: any;
  currentDate = new Date();
  date = this.currentDate.toISOString();
  localdata: any;
  machineinfo: any;
  isProcessing: boolean = false;

  constructor(
    private toastr: ToastrService,
    private router: Router,
    private dataService: DataService,
    private machineDataService: MachineDataService
  ) {
    this.localdata = this.machineDataService.getSavedData();
    this.machineinfo = this.machineDataService.getMachineInfoStoreLocally();
    this.data = {
      mcid: this.machineinfo.mcid,
      bottles: this.localdata.totalBottleCount,
      cans: this.localdata.totalCanCount,
      weight: this.localdata.totalWeightBottle + this.localdata.totalWeightCans,
      date: this.date.split('T')[0], // Assuming you want to send only the date part
      time: '', // Ensure time is filled as per your requirement
      city:  this.machineinfo.city, // Assuming city is constant for now
    };

    this.dataString = JSON.stringify(this.data);
    console.log("Donate data ----------", this.dataString);
    
    this.timerSubscription = timer(0, 1000).subscribe(() => {
      if (this.counter > 0) {
        this.counter--;
      } else {
        this.timerSubscription.unsubscribe();
        this.router.navigate(['/thank']);
      }
    });
  }

  ngOnInit() {}

  ngOnDestroy() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  handleImageTap(destination: 'donate' | 'phone') {
    if (this.isProcessing) {
      return; // Exit if already processing
    }
    
    this.isProcessing = true;

    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }


    if (destination === 'donate') {
      this.dataService.donatedata(this.dataString).subscribe(
        (data: any) => {
          console.log('Data posted successfully:', data);
          this.router.navigate(['/thank']);
        },
        (error) => {
          console.error('Error posting data:', error);
          this.router.navigate(['/thank']); // Handle error and navigate
        }
      );
    } else {
      this.router.navigate(['/phone']);
    }
  }
}
