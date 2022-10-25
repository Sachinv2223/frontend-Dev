import { HttpResponse } from '@angular/common/http';
import { AuthService } from './../Services/auth.service';
import { Component, OnInit } from '@angular/core';
import { faEnvelope, faCheck, faLock } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  faEnvelope = faEnvelope;
  faCheck = faCheck;
  faLock = faLock;

  onLoginBtnClick(email: string, password: string) {
    this.authService.logIn(email, password).subscribe({
      next: (res: HttpResponse<any>) => {
        // console.log(`Response in login comp is : ${JSON.stringify(res)}`);
        console.log(res);

      }
    })
  }

}
