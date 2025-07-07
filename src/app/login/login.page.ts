import { Component } from '@angular/core';
import { LoginService } from './login-service';

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
  standalone: false,
})
export class LoginPage {

  constructor(public loginService: LoginService) { }

  ionViewDidEnter() {
    this.loginService.initialize();
  }
}
