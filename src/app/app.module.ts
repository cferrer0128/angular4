import { BrowserModule } from '@angular/platform-browser';
import { NgModule, OnInit } from '@angular/core';
import { RouterModule  } from '@angular/router';
import { AppComponent } from './app.component';
import { DetailComponent } from './detail/detail.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProjectService } from './services/project.service';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms'
//new 
import { DataTableModule } from "angular2-datatable";
import { DataFilterPipe }   from './data-filter.pipe';
import { ReportComponent } from './report/report.component';
import { NewComponent } from './new/new.component';





@NgModule({
  declarations: [
    AppComponent,
    DetailComponent,
    DashboardComponent,
    DataFilterPipe,
    ReportComponent,
    NewComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    DataTableModule,
    RouterModule.forRoot([
      {
        path: "sites/dev/SitePages/CARTDash.aspx",
        component: DashboardComponent
       
      },
      {
        path: "sites/dev/SitePages/CARTDash.aspx/:id",
        component: DetailComponent
       
      },
      {
        path: "sites/dev/SitePages/CARTDash.aspx/new/:id",
        component: NewComponent
       
      },
      {
        path: "sites/dev/SitePages/CARTDash.aspx/report/:id",
        component: ReportComponent
       
      }
     ])

  ],
  providers: [ProjectService],
  bootstrap: [AppComponent]
})
export class AppModule {


 }
