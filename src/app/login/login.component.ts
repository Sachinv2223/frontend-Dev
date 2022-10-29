import { HttpResponse } from '@angular/common/http';
import { AuthService } from './../Services/auth.service';
import { Component, OnInit } from '@angular/core';
import { faEnvelope, faCheck, faLock } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  faEnvelope = faEnvelope;
  faCheck = faCheck;
  faLock = faLock;

  onLoginBtnClick(email: string, password: string) {
    this.authService.logIn(email, password).subscribe({
      next: (res: HttpResponse<any>) => {
        this.router.navigate(['/lists']);
      }
    })
  }

  onSignUpBtnClick(){
    this.router.navigate(['/signup'])
  }

}
