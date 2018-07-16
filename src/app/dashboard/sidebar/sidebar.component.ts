import { Component, OnInit } from '@angular/core';
import { AuthentificationService } from '../../shared/authentification.service';
import { Router } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  user: any;
  menu: boolean

  constructor(
    private authentification: AuthentificationService,
    private router: Router,
    private storage: LocalStorageService
  ) { }

  ngOnInit() {
    this.user = this.storage.retrieve('user');
    this.menu = false;
  }

  logout(){
    console.log('deleting storage');
    this.authentification.logout();
    this.router.navigate(['/']);
  }

  openMenu(){
    this.menu = true;
  }

  closeMenu(){
    this.menu = false;
  }

}
