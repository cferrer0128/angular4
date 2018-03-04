import { Component, OnInit } from '@angular/core';

import { ProjectService } from '../services/project.service';

import {Project} from '../models/project';

import { Router } from '@angular/router';
//import { error, promise } from 'selenium-webdriver';

declare var jquery: any;
declare var $: any;


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
    public  projectList:Project[];
    private pListGlobal: Project[];
    private graphicList: Project[];
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
							 //console.log("setInterval...Changed", _projectService.filterRecords);
							
							this.projectList = _projectService.filterRecords;
							this.MaxRecords = this.projectList.length;
							window["isChange"] = true;this.createGraphic(this.projectList);
						
				 }

				 if(this.nextUrl && this.nextUrl.length>0){
					 
					window["isAll"]=false;

					 this._projectService.getProjects(undefined, this.nextUrl)
					 .subscribe(data => {
					
						this.nextUrl= data[data.length-1].next;
						this.data = Project.fromJsonList(data);
						var userName = this.currentUser.Title;
						
						for(var x=0; x<this.data.length;x++){
							var items=[];
							if(this.data[x].id && this.data[x].status !="New"){
								var item = this.data[x];
								if(!this.isInGroup){
									if(item.requester && item.requester.indexOf(userName)>=0){
										items.push(item);
										this._projectService.isRequester = true;
										if(this.projectList && this.projectList.length>0) this.projectList.push(item);
										else this.projectList = items;
									}
										
									else if (item.TeamNames && item.TeamNames.indexOf(userName)>=0)	{
										items.push(item);
										this._projectService.isRequester = true;
										if(this.projectList && this.projectList.length>0) this.projectList.push(item);
										else this.projectList = items;
									}
									

								}else this.projectList.push(item);

			
							}//if id

						}//end loop
						
						if (this.projectList && this.projectList.length >= 0) {
							this.MaxRecords = this.projectList.length;
							
							this.createGraphic(this.projectList);
							this.pListGlobal = this.projectList;
							//console.log('pListGlobal Data -->', this.pListGlobal.length);
							this._projectService.filterRecords = this.projectList;
							ProjectService.filteredData = this.projectList;
	
						 }
						

					 })
				 }else if (this.pListGlobal && this.projectList.length === this.pListGlobal.length){
					//console.log('full  Data -->', this.nextUrl);
					window["isAll"]=!window["selected"]
					//console.log('full  Data -->', window["isAll"]);
					

				 }
				 
				 //console.log('Next Url ' , this.nextUrl);
				
	   },1500);
	}
	  
	  //sendContentFields
	sendContentFields(xData:any , index:any):boolean{

		if(xData.length>=index && xData[index]){
			
			let xmlData ={
				__metadata:{type:'SP.Field'},
				FieldTypeKind:xData[index].FieldTypeKind,
				Title:xData[index].Title,
				InternalName:xData[index].InternalName

			}
			
			this._projectService.postCARTProject(xmlData,"CARTProjectsContent")
					.then(field =>{
						console.log('data from fields inserted -->',xData.length,xmlData, index);
						this.sendContentFields(xData,index+1);
					}, err => {console.log('error  fields  -->', xmlData); this.sendContentFields(xData,index+1);}) 
		}
		else if(xData.length>=index){this.setCARTProjects(); return true}
		//else if(xData.length>=index) return  true;
		return false;
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
	public isPromise;
	//getFieldAsXML
	getFieldAsXML(){
		//https://yome.sharepoint.com/sites/dev/_api/web/lists/getByTitle('CARTProjects')/fields/
		//data: "{ '__metadata': { 'type': 'SP.Field' }, 'Title': 'Comments', 'FieldTypeKind': 3 }",
	
		this._projectService.getFieldListbyName('CARTProjects')
		.then(data =>{
			let arrField = this._projectService.transform(data,"ReadOnlyField");
			arrField = arrField[0].key =="true"?arrField[1].value:[];
			//new code 
			this.isPromise = this.sendContentFields(arrField,0)
			
		});
		
	}

  	goProject(project){
	  this._router.navigate([this.routerUrl +'/', { id: null }]);
  	}

  
  	public searchKey:string="All"

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
			this.createGraphic(this.projectList);
			ProjectService.filteredData = this.projectList;
			this.filterQuery = "";
			this.isSearch = false;
			
		}
  	}
  
	//ngOnInit
  	ngOnInit() {
		window["selected"] = false;
		this.isInGroup = false;
		/*
		if (this._projectService.filterRecords && this._projectService.filterRecords.length>0 && this._projectService.newRecordId<=0){
			this.projectList = this._projectService.filterRecords;
			this.isFull = true;
			window["isChange"] = this.isFull;  
			window["isAll"]=this.isFull;
			this.isInGroup = this._projectService.isInGroup;
			return;
		} */
		
		this.nextUrl="";
		var groups = window["spGroups"];
		var userName='';
		window["isAll"]=false;
		var startTime = Date.now();
		//one time only
		//this.getFieldAsXML();
		console.log('onInit ' , this.projectList)
		this._projectService.getProjects(undefined , undefined)
		.subscribe(data => {
			
			this.nextUrl = data[data.length-1].next;
			if(this.nextUrl) data.splice(-1,1)
			this.data = Project.fromJsonList(data);
			this.projectTmpList = Project.fromJsonList(data);
			
			this._projectService.getCurrentUser()
			.then(user =>{
				this.currentUser = user;
				
				this._projectService.spCurrentUser = user;

			})
			.then(user => {
				this._projectService.getUserGroup(window["userId"])
				.subscribe(group =>{
					
					for (var i = 0; i < group.length; i++) 
						if(groups.indexOf(group[i].Title)>=0){
								this.isInGroup = true;
								this._projectService.isInGroup = this.isInGroup;
								break;	
						}
						var userName = this.currentUser.Title;
						var items=[];
						var itemsFiltered=[];
						if(!this.isInGroup){
							for (var i = 0; i < this.projectTmpList.length; i++) {
								var item = this.projectTmpList[i];
								if(this.projectTmpList[i].id && this.projectTmpList[i].requester && this.projectTmpList[i].requester.indexOf(userName)>=0){
									items.push(item);this._projectService.isRequester = true;
								}
								else if (this.projectTmpList[i].id && this.projectTmpList[i].TeamNames && this.projectTmpList[i].TeamNames.indexOf(userName)>=0){
									items.push(item);this._projectService.isRequester = true;
								}	
									

								
							}//for
						}else{

							this.projectTmpList.map(e =>{
								if(e.status != "New") itemsFiltered.push(e);
							});
							this.projectList = itemsFiltered;
						}
						
						if(items.length>0){
							
							this.projectList = items;

						} 

						this.isFull = true;
						//this.isSearch = false;
						window["isChange"] = true;  

						//new code...
						if (this.projectList && this.projectList.length >= 0) {
							this.MaxRecords = this.projectList.length;
							console.log('2nd call Data -->', this.projectList.length);
							
							this.createGraphic(this.projectList);
							
							//this.pListGlobal = this.projectList;
							this._projectService.filterRecords = this.projectList;
							ProjectService.filteredData = this.projectList;

						}
						
					
				})
			})
			
			

		}, err => {
			console.log(' Error on getProjects : ');
		});
      
    }

	public toInt(num: string) {
        return +num;
    }

    public sortByWordLength = (a: any) => {
        return a.city.length;
    }

	

}
