import { Component , OnInit} from '@angular/core';
import { Router  } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']

})
export class AppComponent  implements OnInit {
  title = 'app';

  constructor( private router: Router ) {
   // console.log('router services running..!');
  }

  ngOnInit() {
   
      //this.router.navigate([window["routeURL"]]);
  }

}
