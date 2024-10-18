import { Component } from '@angular/core';
import { Router,NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
    logo1: string = 'assets/images/logo.png';
    logo2: string = 'assets/images/logo.png';
    hideImages: boolean = false;


  constructor(
    private router: Router,
  ){
           
  }

  ngOnInit(){
    this.updateImageVisibility(this.router.url);

    // Subscribe to router events to detect navigation changes
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(event => {
        // Type assertion to ensure `event` is of type `NavigationEnd`
        this.updateImageVisibility((event as NavigationEnd).url);
      });
  }


  private updateImageVisibility(url: string) {
    this.hideImages = url === '/password' || url === '/phone';
  }



  openAdmin(){
    if(this.router.url === '/home' || this.router.url === '/filled-win'){
      this.router.navigate(['password']);
    }
  }

}
