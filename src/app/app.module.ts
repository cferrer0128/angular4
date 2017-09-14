import { BrowserModule } from '@angular/platform-browser';
import { NgModule, OnInit } from '@angular/core';
import { RouterModule  } from '@angular/router';
import { AppComponent } from './app.component';
import { DetailComponent } from './detail/detail.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProjectService } from './services/project.service';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms'

@NgModule({
  declarations: [
    AppComponent,
    DetailComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    RouterModule.forRoot([
      {
        path: "sites/dev/SitePages/a4page.aspx/dash",
        component: DashboardComponent
       
       
      }
     ])

  ],
  providers: [ProjectService],
  bootstrap: [AppComponent]
})
export class AppModule {


 }
