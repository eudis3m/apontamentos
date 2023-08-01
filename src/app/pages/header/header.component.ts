import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import { Component, OnInit, ViewChild } from '@angular/core';
import {Observable} from 'rxjs';
import {AuthService} from '../../auth/auth.service';
import { MatSidenav } from '@angular/material';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],

})
export class HeaderComponent implements OnInit {

  @ViewChild('sidenav') sidenav: MatSidenav;

  isLoggedIn: Observable<boolean>;

  constructor(private authService: AuthService,  private router: Router) { }

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn;
  }

  onLogout() {
    this.authService.logout();
  }

  close() {
    this.sidenav.close();
  }

  teste() {
    close();
  }
}


