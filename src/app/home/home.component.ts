import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.validadeAuth();
  }

  validadeAuth() {
    this.authService.validadeAuth().subscribe()
  }

}
