import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faEnvelope, faCheck, faLock } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../Services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  faEnvelope = faEnvelope;
  faCheck = faCheck;
  faLock = faLock;

  onLoginBtnClick() {
    this.router.navigate(['/login']);
  }

  onSignupBtnClick(email: string, password: string){
    this.authService.signUp(email,password).subscribe({
      next: (res: HttpResponse<any>) => {
      }
    })
  }

}
