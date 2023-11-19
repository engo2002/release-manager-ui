import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-chassis-header',
  templateUrl: './chassis-header.component.html',
  styleUrls: ['./chassis-header.component.css']
})
export class ChassisHeaderComponent implements OnInit {
  isMobile: boolean = false;
  showMenu: boolean = false;

  // Setze isMobile auf true, wenn die Fensterbreite kleiner als 768px ist
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isMobile = event.target.innerWidth < 768;
  }

  constructor() { }

  ngOnInit(): void {
    // Initialisiere isMobile basierend auf der Fensterbreite beim Laden der Seite
    this.isMobile = window.innerWidth < 768;
  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }
}
