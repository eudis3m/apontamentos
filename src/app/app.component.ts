import {Component, OnInit, ViewChild, Input} from '@angular/core';
import {MatSidenav} from '@angular/material';
import {Observable} from 'rxjs';
import {AuthService} from './auth/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  @Input()
  hideToggle: boolean;

  @ViewChild('sidenav') sidenav: MatSidenav;

  isLoggedIn: Observable<boolean>;

  constructor(private authService: AuthService, private router: Router) {
  }

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn;
  }

  onLogout() {
    this.authService.logout();
  }

  close() {
    this.sidenav.close();
  }

}
