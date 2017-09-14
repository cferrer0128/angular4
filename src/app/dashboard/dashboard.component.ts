import { Component, OnInit } from '@angular/core';

import { ProjectService } from '../services/project.service';

import {Project} from '../models/project';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {


  	public initDate:string;
    public endDate:string;
    private projectForm: Project;
    private projectTmpList :Project[];
    public projectList:Project[];
    private pListGlobal: Project[];
    private graphicList: Project[];
    private myitem = [];
    public isFull: boolean = false;
    private isUpdate: boolean = false;
    public isSearch: boolean = false;
    public isGraph:boolean=false;
    private nextUrl:string;
    private sURL: string;
  	private selectedValue:string;
    public search:string;
    public selector:string;
	private rootUrl:string="https://chieftechnologyoffice.home.citi.net/sandbox/cart";

	public newUrl:string = this.rootUrl+ "/_layouts/15/FormServer.aspx?XsnLocation=" + this.rootUrl + "/CARTProjects/Forms/template.xsn&SaveLocation="+ this.rootUrl + "/CARTProjects&ClientInstalled=true&Source=" + this.rootUrl +"/SitePages/CARTDash.aspx?PageView=Shared&InitialTabId=Ribbon.WebPartPage&VisibilityContext=WSSWebPartPage&openin=browser";

  
  constructor(private _projectService: ProjectService) { 

      this.projectList = [];
      this.projectForm = new Project('','','','','',0,'','');
       console.log('Project services is running..!');
  }

  goSearch(){
		this.isSearch = true;
		this.selector = this.selectedValue;
		
		if(this.search)
		{
			this.myitem = [];	
			var dateChanged = false;
			if(this.initDate && this.endDate){dateChanged=true;}
			var iniDT = new Date(this.initDate);
			var endDT = new Date(this.endDate);
			var data = this.pListGlobal;
			 for (var i = 0; i < data.length; i++) {
							
				 switch (this.selector) {
					 
					 case 'ProjectName':
						if (data[i].name.toString().toUpperCase().indexOf(this.search.toUpperCase())>=0) {
							if(dateChanged ==true && data[i].created >=iniDT  
								&&  data[i].created <=endDT){
								
								this.myitem.push(data[i]);
							}else if(!dateChanged) this.myitem.push(data[i]);
							
						}
						break;
					 case 'Status':
						if (data[i].status.toString().toUpperCase().substring(0,this.search.length) == this.search.toUpperCase()) {
							
							if(dateChanged ==true && data[i].created >=iniDT  
								&&  data[i].created <=endDT){
								
								this.myitem.push(data[i]);
							}else if(!dateChanged) this.myitem.push(data[i]);
						}
						break;
					case 'Requester':
						if (data[i].requester && data[i].requester.toString().toUpperCase().indexOf(this.search.toUpperCase())>=0) {
							
						if(dateChanged ==true && data[i].created >=iniDT  
								&&  data[i].created <=endDT){
								
								this.myitem.push(data[i]);
							}else if(!dateChanged) this.myitem.push(data[i]);
							
						}
						break;
					case 'Reviewer':
						if (data[i].reviewer && data[i].reviewer.toString().toUpperCase().indexOf(this.search.toUpperCase())>=0) {
							
							if(dateChanged ==true && data[i].created >=iniDT  
								&&  data[i].created <=endDT){
								
								this.myitem.push(data[i]);
							}else if(!dateChanged) this.myitem.push(data[i]);
							
							
						}
						break;
					case 'ID':
						if (data[i].id.toString() == this.search) {
							this.myitem = [data[i]];
							this.projectList = Project.fromJsonList(this.myitem);
					
						}
				 }
				
		 }//end loop
			this.projectList = this.myitem;
			this.createGraphic(this.projectList);
			this.isSearch = false;
			window["isChange"] = true;
		}		
		
  }
  
  goGraphic(){
		this.isGraph = true;
		this.isFull = false;
		
	}
  createGraphic(data){
	
	  	window["monthArray"] = this._projectService.transform(data,'partCreatedDT');
		window["daysArray"] = this._projectService.transform(data,'newdate');
		
  }
  
  getProjectsByDate(){
		if(this.pListGlobal && this.pListGlobal.length>this.projectList.length) this.projectList = this.pListGlobal;
		this.projectTmpList = this.projectList;
		var arrayDT = [];
		
		this.projectTmpList.map(r => {
					var item = r;
					if(this.initDate && this.endDate){
						var iniDT = new Date(this.initDate);
						var endDT = new Date(this.endDate);
						if(item.created >=iniDT  &&  item.created <=endDT){
							arrayDT.push(item);
						}
					}
					
		});
				
		this.projectList = arrayDT;
		this.createGraphic(this.projectList);
		window["isChange"] = true;
				
		
	}

  changeDateValue(mydate,nameDT){
		
		this.search = "";
		var isOK = false;
		if(nameDT =="initDate" && mydate != this.initDate){ this.initDate = mydate; isOK = true;}
		else if(nameDT =="endDate" && mydate != this.endDate){ this.endDate = mydate; isOK = true;}
		else if((this.initDate && this.endDate) && (this.initDate.length>=10 && this.endDate.length>=10)){isOK=true}
		if(isOK && (this.initDate && this.endDate)){
			this.isSearch = true;
			this.projectList = this.pListGlobal;
			this.getProjectsByDate();
			this.isSearch = false;
			window["isChange"] = true;
		}
  }
  changeValue(value){
		this.selectedValue = value;
		this.isSearch = false;
		console.log(this.selectedValue);
		this.search = "";
	
		if(value =="All" ) {this.projectList = this.pListGlobal; window["isChange"] = true;this.createGraphic(this.projectList);if(this.initDate && this.endDate)this.getProjectsByDate();}
  }
  
  ngOnInit() {
      this.nextUrl="";
      this.isFull = false;
      this._projectService.getProjects(undefined , undefined)
      .subscribe(data => {
          console.log('data has been returned');
          var myArr = data[data.length-1];
          if(myArr && myArr.next) data.splice(-1,1)
          this.projectTmpList = Project.fromJsonList(data);
          this.projectTmpList.map(r => {
            var item = r;
            if(this.initDate && this.endDate){
              var iniDT = new Date(this.initDate);
              var endDT = new Date(this.endDate);
              if(item.created >=iniDT  &&  item.created <=endDT){
                this.projectList.push(item);
              }
            }else this.projectList.push(item);
            
          });
          //new code...
          if (this.projectList.length >= 0) this.isFull = true;
          this.isSearch = false;
          this.createGraphic(this.projectList);
          window["isChange"] = true;
          this.nextUrl=myArr.next;
                 
          this.pListGlobal = this.projectList;

      }, err => {
        console.log(' Error on getProjects : ');
      });
      
    }

}
