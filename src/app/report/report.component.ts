import { Component, OnInit } from '@angular/core';

import { ProjectService } from '../services/project.service';

import {Project} from '../models/project';

import { Router } from '@angular/router';
import { ReturnStatement } from '@angular/compiler';


declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})


export class ReportComponent implements OnInit {

  	public initDate:string;
    public endDate:string;
    private projectForm: Project;
    private projectTmpList :Project[];
    public  projectList:Project[];
    private pListGlobal: Project[];
    private graphicList: Project[];
    public serviceList:Project[];
    private myitem = [];
    public  isFull: boolean = false;
    private isUpdate: boolean = false;
    public  isSearch: boolean = false;
    public  isGraph:boolean=false;
    private nextUrl:string;
    private sURL: string;
  	private selectedValue:string;
    public search:string;
    public selector:string;
    public rootUrl:string=window["spSite"]; 
    public routerUrl:string=window["routeURL"]
    public newUrl:string = this.rootUrl+ "/_layouts/15/FormServer.aspx?XsnLocation=" + this.rootUrl + "/CARTProjects/Forms/template.xsn&SaveLocation="+ this.rootUrl + "/CARTProjects&ClientInstalled=true&Source=" + this.rootUrl +"/SitePages/CARTDash.aspx?PageView=Shared&InitialTabId=Ribbon.WebPartPage&VisibilityContext=WSSWebPartPage&openin=browser";
	//new code.............................
    public data;
    public dataGlobal;
    public filterQuery = "";
    public rowsOnPage = 100;
    public sortBy = "email";
    public sortOrder = "asc";
    public isInGroup:boolean=false;
    public currentUser:any;
    public isDateChanged:boolean=false;
    public MaxRecords:any=0;
    public isInArray=[];
	//................................
  	constructor(public _projectService: ProjectService , 
			 private _router: Router) { 

		this.isFull = false;
      //this.projectList = _projectService.filterRecords;
		this.projectForm = new Project('','','','','',0,'','','','','','','','','','',''
		,'','','','','','','','','','','','','',
		'','','','','','','','','','','','','','','','');
	 
    setInterval(()=>{
				 				
      if(this._projectService.filterRecords && this.projectList && 
         (this._projectService.filterRecords.length != this.projectList.length)){
         
           this.serviceList = _projectService.filterRecords;
         
      }
      },1000)
    
    }
	  
	

	//sendCARTItems
	sendCARTItems(xData:any , index:any){
		
		if(xData.length>=index && xData[index]){
			console.log('ready for CARTProjectsContent ',index, xData[index].ID);
			let metaData ={
				__metadata:{type:'SP.Data.CARTProjectsContentListItem'},
				Title:xData[index].Title,CARTProject_x0020_ID:xData[index].ID.toString()
			}
			
			this._projectService.postProjects(metaData,"CARTProjectsContent")
			.then(e =>{
				this.sendCARTItems(xData,index+1);
			}, err => { console.log('Error posting ' , err)}) 
		}
		
  }
  
	//CARTProjects CRUD. 
	setCARTProjects(){
      this._projectService.getListbyName('CARTProjects',"?$orderby=ID&$top=1000")
      .subscribe(data =>{
        
          this.sendCARTItems(data,0)
        
      });
    }
  public searchKey:string="All"
  public isPromise;
	  //getFieldAsXML
	  getFieldAsXML(){
		
	
      this._projectService.getFieldListbyName('CARTProjects')
        .then(data =>{
          let arrField = this._projectService.transform(data,"ReadOnlyField");
          arrField = arrField[0].key =="true"?arrField[1].value:[];
          //new code 
          
          
        });
		
    }
    
    private  validateDate(field:any){

      if(field == null || field.toString() == "undefined") return false;
      
      if(field && field.length<=0) return false;

      let dateChk = new Date(field);
     
      return dateChk.toString().indexOf("Invalid")<0;

  }


    calculateBGColor(xvalue){

      if(this.validateDate(xvalue))
      return {
        background: '#6ece76'
      }
      else
      return {
        background: '#ddd'
      }

    }
  	goProject(project){
	    this._router.navigate([this.routerUrl +'/', { id: null }]);
  	}

    showMy(){

        var user = this.currentUser.Title;
        var requesters = []
        for(var i=0; i < this.pListGlobal.length;i++){
          var item = this.pListGlobal[i];
          if(item.requester && item.requester != null  && 
            item.requester.toLowerCase().indexOf(user.toLowerCase())> -1){
              this._projectService.isRequester = true;
              //console.log('found requester ' , item);
              requesters.push(item);
          }else if(item.TeamNames && item.TeamNames != null  && 
            item.TeamNames.toLowerCase().indexOf(user.toLowerCase())> -1){
              this._projectService.isRequester = true;
              //console.log('found requesterTeam ' , item);
              requesters.push(item);
          }


		    }//end loop
    
        this.projectList = requesters;
        this.filterQuery = "My";
        this._projectService.filterQuery = this.filterQuery;
        ProjectService.filteredData = this.projectList;
        this._projectService.filterRecords = this.projectList;
		

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
      this.data = arrayDT;
      ProjectService.filteredData = this.projectList;
      this.createGraphic(this.projectList);
      this.isDateChanged = true;
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
        //this.isSearch = false;
        window["isChange"] = true;
      }
  	}
  
  
	  changeValue(value){
      this.selectedValue = value;
      //this.isSearch = false;
      //console.log(this.selectedValue);
      window["selected"] = true;
      this.search = "";
      this._projectService.filterQuery = value
      if(value =="All" ) {
        this.isSearch = true;
        this.searchKey = value;
        this.data = this.dataGlobal;
        this.projectList = this.pListGlobal; 
        window["isChange"] = true;window["isAll"]=true;
        this.initDate ="";this.endDate="";
        this.serviceList = undefined;
        //this.createGraphic(this.projectList);
        ProjectService.filteredData = this.projectList;
        this.filterQuery = "";
        this.isSearch = false;
        
      }
  	}
  
	  //ngOnInit this.service.filterRecords
    ngOnInit() {
      window["selected"] = false;
      this.isInGroup = false;
      
      if (ProjectService.filteredData.length>0){
        this.projectList = ProjectService.filteredData;
        this.pListGlobal = this.projectList;
        this.isFull = true;
        window["isChange"] = this.isFull;  
        window["isAll"]=this.isFull;
        this.isInGroup = this._projectService.isInGroup;
       
      } 
      
      
    }

	  public toInt(num: string) {
        return +num;
    }

    public sortByWordLength = (a: any) => {
        return a.city.length;
    }

	

}
