import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MachineDataService } from 'src/app/shared/services/machine-data.service';

@Component({
  selector: 'app-thank',
  templateUrl: './thank.component.html',
  styleUrls: ['./thank.component.scss']
})
export class ThankComponent implements OnInit{

  constructor(
    private router: Router,
    private machineDataService:MachineDataService
  ){
    setTimeout(() => {
      sessionStorage.clear();
      this.router.navigate(['/']);
    }, 5000);
  }

  ngOnInit() { }

  ngOnDestroy() { 
        
  }

}
