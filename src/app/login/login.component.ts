import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AuthService } from '../auth/auth.service';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { RouterModule, Router } from '@angular/router';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
} from '@angular/material/card';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatCard,
    MatCardHeader,
    MatCardActions,
    MatCardContent,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  credentials = { username: '', password: '' };

  constructor(private readonly authService: AuthService, private readonly router: Router) {}

  userLogin() {
    this.authService.login(this.credentials).subscribe({
      next: (res) => {
        console.log(res);
        this.router.navigate(['/products']);
        return res;
      },
      error: (err) => {
        console.log(err);
        return err;
      },
    });
  }
}
