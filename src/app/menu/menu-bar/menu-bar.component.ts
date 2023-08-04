import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.css'],
  animations: [
    trigger('rotate', [
      transition(':enter', [
        animate('600ms 1200ms',
          keyframes([
            style({transform: 'rotate(0deg)', offset: '0'}),
            style({transform: 'rotate(5turn)', offset: '1'})
          ])
        )
      ])
    ]),
    trigger('move', [
      transition(':enter', [
        animate('200ms 800ms', style({ transform: 'scale(1.3)' })),
        animate('200ms', style({ transform: 'translateX(0)' }))
      ])
    ])
  ]
})
export class MenuBarComponent {

  isLogged: boolean = false;

  constructor(private authService: AuthService){}
  
  ngOnInit() {
    if (this.authService.getAuthToken() !== null)
      this.isLogged = true;

    this.authService.isLogged.subscribe(
      isLogged => this.isLogged = isLogged
    );
  }

}
