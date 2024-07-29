// import { Component } from '@angular/core';
import { Component, OnInit, Renderer2 } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent  {
  title = 'reatmos_new_rvm_frontend';
  constructor(private renderer: Renderer2) {}

  ngOnInit() {

    document.addEventListener('touchstart', this.handleTouchStart, { passive: false });
    this.renderer.listen('window', 'touchstart', (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    });

    // Prevent pinch-to-zoom on touchmove
    this.renderer.listen('window', 'touchmove', (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    });

    // Prevent pinch-to-zoom on gesturestart
    this.renderer.listen('window', 'gesturestart', (e: Event) => {
      e.preventDefault();
    });

    // Prevent pinch-to-zoom on gesturechange
    this.renderer.listen('window', 'gesturechange', (e: Event) => {
      e.preventDefault();
    });
  }

  handleTouchStart(event: TouchEvent) {
    event.preventDefault(); // Prevent default zooming behavior
  }
}
