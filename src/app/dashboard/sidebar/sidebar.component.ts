import { Component, OnInit } from '@angular/core';
import { AuthentificationService } from '../../shared/authentification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  constructor(
    private authentification: AuthentificationService,
    private router: Router  ) { }

  ngOnInit() {
  }

  logout(){
    console.log('deleting storage');
    this.authentification.logout();
    this.router.navigate(['/']);
  }

}
