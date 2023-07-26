import { Component } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.css']
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
