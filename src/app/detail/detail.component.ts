import { Component, OnInit, OnDestroy } from '@angular/core';

import { ProjectService } from '../services/project.service';

import { Router, ActivatedRoute } from '@angular/router';

import {Project} from '../models/project';
import { retry } from 'rxjs/operator/retry';
import { Observable } from 'rxjs/Observable';

declare var jquery: any;
declare var $: any;
declare var ActiveXObject:any;

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit, OnDestroy {

	public Id:any;
	public localProject: any;
	public isReady: boolean = false;
	public isuserReady:boolean=false
	public isNew:boolean = true;
	public dataYearsList:any;
	public sectorList:any;
	public businessUList:any;
	public dataCatalogList:any;
	public dataClassiList:any;
	public dataTypeOfReqList:any;
	public fullName:string="";
	public sector:string="";
	public BusinessUnit:string="";
	public Supplier:string="";
	public Product:string="";
	public focusMessage:string="";
	public isFocus:boolean=false;
	public file:any;
	public fileList:any;
	public className:string="dropdown";
	public currentUser:any;
	public isfound:boolean=false;
	public Revalue:string;
	public person:any;
	public dataClassiValue:any;
	public Dataclassi:any;
	public BISO:any;
	public ReqDescription:any;
	public RequesterTeamIDs:any;
	public AppReYear:any;
	public voteList=[];
	public isApproved:boolean=false;
	public isRejected:boolean=false;
	public isInfo:boolean=false;
	public isUserReq:boolean=false;
	public typeofVote:string;
	public VoteComment:string;
	public arrReplayTo:any;
	private votes=['Approved','Rejected','More Information Need'];
	private votesReq=['Information Returned','Information Rejected'];
	public  superChild =[];
	public superParent=[];
	public superArray=[];
	public ReqDescriptionLocal:any;

	constructor(private _route: Router , 
    private _activeroute: ActivatedRoute,
    public _projectService: ProjectService) { 
		 this.localProject = new Project('','','','','',0,'','','','','','',''
		 ,'','','','','','','','','','','','','','','','','',
		 '','','','','','','','','','','','','','','','');
        this._activeroute.params.subscribe( params => {
				
				this.isUserReq = this._projectService.isRequester;
				this.Id = params["id"];
				
        });
      
        
	  }
	  
	  //....
	fileUploaded(){

		$('#uploadSuccess').css('display','none');
		this.getFiles(this.localProject.name);

	}

	changeVote(vote){
	
		this.progBarValue = vote.value;
		switch (vote.value) {
			case "Approved":
				this.isApproved = true;this.isRejected = false;this.isInfo=false;
				break;
			case "Rejected":
				this.isRejected = true;this.isApproved = false;this.isInfo=false;
				break;	
			case "More Information Need":
				this.isRejected = false;this.isApproved = false;this.isInfo=true;
				break;
		}

	}


	getNodeXml(elem:any,toFindWord:string, isChildNode:boolean){
		var node:any;
		var subnode='';
		if(elem && elem.children &&  !this.isfound)
			for(var i=0; i<=elem.children.length;i++){
				node = elem.children[i];
				//try to find the node at level 1
				if(node && node.localName.toLowerCase() == toFindWord.toLowerCase()){
					//console.log('Found!!',node.localName);
					this.Revalue = node.innerHTML;
					this.isfound=true;
					break;
				}
				
				if(node && !this.isfound)
					this.getNodeXml(node,toFindWord,false);
				
			}
		else if(elem.documentElement && !this.isfound)
			for(var i=0; i<=elem.childNodes.length;i++){
				if(elem.childNodes[i].nodeName == "my:myFields"){
					//console.log('myFields!!',elem.childNodes[i].nodeName);
					this.getNodeXml(elem.childNodes[i],toFindWord,true);	
					break;
				}
					
			}
		
		else if(elem.childNodes && isChildNode && !this.isfound)
			for(var i=0; i<=elem.childNodes.length;i++){
				node = elem.childNodes[i];
				//try to find the node at level 1
				//if(node && node.localName) console.log('Node!!',node.localName);
				if(node && node.localName && node.localName.toLowerCase() == toFindWord.toLowerCase()){
					//console.log('Found!!',node.textContent);
					if(node && node.childNodes.length>0)
						for(k=0;k<node.childNodes.length;k++){
							var child = node.childNodes[k];
							if(child.nodeName.toLowerCase() == "pc:person"){
								this.Revalue += child.childNodes[0].textContent+";";
								
							}
						}
					if(this.Revalue.length<=0) this.Revalue = node.textContent;
					this.isfound=true;
					break;
				}
				
				if(node && !this.isfound)
					this.getNodeXml(node,toFindWord,true);
				
			}
		else if(elem && !this.isfound){
			for(var k=0; k<=elem.length;k++){
				var snode = elem[k];
				if(snode && snode.localName && snode.localName.toLowerCase() == "pc:person"){
					subnode += snode.children[0].innerHTML+";";
					//console.log('Node!!',subnode);
				}
					
					
			}
			return subnode;
		}
			
		if(this.isfound) return this.Revalue;
	
	}

	getXmlFile(ProjectName:any){
			//var item = this.localProject;
			var fields =['LinkToThisRecord','DataClassificationApprover','DataClasiTypeRO','RequesterTeam','BriefDescriptionRationale'];
			var tempDisplayValue = '';
			var jsonData={};
			this._projectService.getXmlFilesbyName(ProjectName,true).then(xmlData => {
					
					console.log('Xml Doc-->', typeof($(xmlData)[0]), window);
						
					for(var x=0; x<fields.length;x++){
						this.Revalue=""; this.isfound=false;
						if(navigator.userAgent.indexOf("MSIE")>=0)	jsonData[fields[x]] = this.getNodeXml($(xmlData)[0],fields[x],true);
						else jsonData[fields[x]] = this.getNodeXml($(xmlData)[0],fields[x],false);
						//console.log('jsonData-->', jsonData[fields[x]]);						
					}
					this.localProject.ReqDescription =  jsonData['BriefDescriptionRationale'];
					this.Revalue=""; this.isfound=false;
					this.localProject.dataClassifApprover = navigator.userAgent.indexOf("MSIE")<0?this.getNodeXml($.parseHTML(jsonData['DataClassificationApprover']),'displayname',false):jsonData['DataClassificationApprover'];
					//console.log('jsonData-->', this.localProject.dataClassifApprover);
					this.Revalue=""; this.isfound=false;
					this.localProject.TeamNames = navigator.userAgent.indexOf("MSIE")<0?this.getNodeXml($.parseHTML(jsonData['RequesterTeam']),'displayname',false):jsonData['RequesterTeam']
					//console.log('jsonData-->', this.localProject.TeamNames);
					
				}, err =>{ console.log('Error on xmlData : ', err); });
		
	} 

	getVotesDetail(){
		this.currentUser = this._projectService.spCurrentUser;
		//call the Vote List
		this.superParent =[];
		this.superChild =[];
		var arrRequester =[];
		var arrParent =[];
		var arrChild =[];
		this._projectService.getListbyName("CARTApprovalVote","?$filter=CARTRequestID eq " + this.Id)
		.subscribe(data =>{
			arrRequester =  this._projectService.transform(data,'CARTRequester');
			//console.log('subscribe-->', arrRequester)
			for(var i=0;i<arrRequester.length;i++){
			
				//for current User!!!!!!!
				if(arrRequester[i].key == this.currentUser.Title){
					this.arrReplayTo = arrRequester[i].value.map(e => {
						//var newDate = new Date(e.Created);
						//console.log('toLocaleTimeString ', newDate.toLocaleTimeString('en-US'))
						//console.log('toLocaleDateString ', newDate.toLocaleDateString('en-US'))
						
						var CARTApprovalName ={"CARTApprovalName":e.CARTFullName, 
						"Id":e.Id};
						return CARTApprovalName;
					});
					
				}
				//continue...for all of them...
				if(arrRequester[i].key && arrRequester[i].key !="null"){
					//Parent
					arrParent = arrRequester[i].value.map(e => {
						var newDate = new Date(e.Created);
						var CARTParent = {"CARTApprovalName":e.CARTApprovalName , 
						"Id":e.Id,
						"CARTApprovalVote":e.CARTApprovalVote,
						"CARTApprovalNote":e.CARTApprovalNote,
						"Created":newDate.toLocaleDateString('en-US') + " " + newDate.toLocaleTimeString('en-US') };
						return CARTParent;
					});
				}else{
					//Child
					var newReply=[];
					arrChild = arrRequester[i].value.map(e => {
						var newDate = new Date(e.Created);
						var CARTChild ={"CARTApprovalName":e.CARTApprovalName, 
						"Id":e.Id, "CARTIsVote":e.CARTIsVote,
						"CARTApprovalVote":e.CARTApprovalVote,
						"CARTApprovalNote":e.CARTApprovalNote,
						"Created":newDate.toLocaleDateString('en-US') + " " + newDate.toLocaleTimeString('en-US'),
						"CARTRequester":e.CARTRequester};
						//if(e.CARTIsVote)
							//console.log('CARTChild..', e.Id,  e.CARTIsVote.toString())
						if(this.arrReplayTo)
							for(var x=0;x<this.arrReplayTo.length;x++){
								
								if(e.CARTIsVote  && (e.CARTIsVote.toString() ==this.arrReplayTo[x].Id.toString()) ){
									//console.log('replied already..',  this.arrReplayTo[x].Id ,this.arrReplayTo[x].CARTApprovalName)
									this.arrReplayTo.splice(x,1)
								}
							}
						
					

						return CARTChild;
					});
					
				}

			}//for

			//build tree..
			this.superParent = arrParent.map(e =>{
					var items=[];
					arrChild.map(c => {
						if(c.CARTIsVote && e.Id.toString() == c.CARTIsVote.toString())
							items.push({"CARTApprovalName":c.CARTApprovalName,"Id":c.Id,
							"CARTApprovalVote":c.CARTApprovalVote,
							"CARTApprovalNote":c.CARTApprovalNote,
							"Created":c.Created})
						
					})
					
					return {"CARTApprovalName":e.CARTApprovalName,"Id":e.Id,
					"Created":e.Created,
					"CARTApprovalVote":e.CARTApprovalVote,
					"CARTApprovalNote":e.CARTApprovalNote,
					"hasChild":true,
					"Children":items} ;
			})
			//...arrChild
			arrChild.map(c => {
				if(c.CARTIsVote == null && c.CARTRequester == null)
					this.superChild.push({"CARTApprovalName":c.CARTApprovalName,"Id":c.Id,
					"CARTApprovalVote":c.CARTApprovalVote,
					"CARTApprovalNote":c.CARTApprovalNote,
					"Created":c.Created,
					"CARTIsVote":c.CARTIsVote,
					"hasChild":false,
					"CARTRequester":c.CARTRequester, "Children":[]})
				
			});
			//console.log(' superParent map...! ' , this.superParent);
			//console.log(' superChild map...! ' , this.superChild);
			
			//super array.....
			if(this.superArray.length<data.length){
				this.superArray =[];
				this.superParent.map(e => {
					this.superArray.push(e)
				})
				this.superChild.map(c => {
					this.superArray.push(c)
				})

				this.superArray.sort(this.GetSortOrder("Id"))
				//console.log(' superArray map...! ' , this.superArray);CARTApprovalNote
			}
		
		})
				

	}

	public ESupplier:boolean=false;
	public NewSupplier:boolean=false;
	public newFileName:string;
	public AppChkYes:boolean=false;
	public AppChkNo:boolean=false;
	public KPMGChkYes:boolean=false
	public KPMGChkNo:boolean=false;
	public SOXChkYes:boolean=false;
	public SOXChkNo:boolean=false;
	public IsRisk:any;
	public HMethod:any;
	public PSiteLoc:any;
	public SSiteLoc:any;
	public AMethod:any;
	public dataRiskList=[];
	public typeOfServices=[];
	public AccessMethodList=[];
	public TypeOfServ:any;
	public isInGroup:boolean=false;
	public metadata:any;
	public Requester_x0020_Team_x0020_IDs:any;
	public Requester_x0020_ID:any;
	elem = {
		key :"Select",
		Title :"Select",
		Value :"Select",
		BusinessUnit:"Select"
	}
	private groups = window["spGroups"];
	ngOnDestroy(){

	}
	ngOnInit() {
				window["isAll"]=false;
				this.isSaved=false;
				if(this.Id && this.Id>0){
					this.isNew = false;
					this.isInGroup = this._projectService.isInGroup;
						//filter by Team Member or Requester
						
						this._projectService.getListbyName("CARTDataCatalogs","?$orderby=DataType")
						.subscribe(data =>{
							for(var i=0; i<data.length;i++){
								if(data[i].DataType =="Service")
								this.typeOfServices.push({
									Title : data[i].Title,
									Value: data[i].Id});
								else if(data[i].DataType =="Risk")
								this.dataRiskList.push({
									Title : data[i].Title,
									Value: data[i].Id});
								else if(data[i].DataType == "AMethod")
									this.AccessMethodList.push({
										Title:data[i].Title,
										Value:data[i].Id
									})

							}//loop
							if(navigator.userAgent.indexOf("MSIE")>=0){
								this.typeOfServices.unshift(this.elem);
								this.dataRiskList.unshift(this.elem);
								this.AccessMethodList.unshift(this.elem);
								
							}	

							
								
							
						});

					this._projectService.getProjectById(this.Id)
						.then(data =>{
							if(data && data.__metadata) this.metadata = data;
							let localData = Project.fromJson(data);
							if(data) this.localProject =  localData;
								this.TypeOfReq = this.localProject.TypeOfRequest;
								this.Dataclassi = this.localProject.DataClassificationType;
								this.ESupplier 	= this.localProject.RegExiSupp;
								this.NewSupplier = this.localProject.RegExiSupp?false:true;
								this.ContractChkYes = this.localProject.ContractChkYes?true:false;
								this.ContractChkNo = !this.ContractChkYes
								this.Product = this.localProject.productName;
								this.sector = this.localProject.sector;
								this.BusinessUnit =  this.localProject.businessUnit;
								this.Dataclassi = this.localProject.dataClasif;
								this.AppChkYes = this.localProject.RegAppChange?true:false;
								this.AppChkNo = !this.AppChkYes;
								this.KPMGChkYes = this.localProject.RegKPMG?true:false;
								this.KPMGChkNo = !this.KPMGChkYes;
								this.SOXChkYes = this.localProject.RegSOXIndicator?true:false;
								this.SOXChkNo = !this.SOXChkYes;
								this.IsRisk = this.localProject.RegRisk;
								this.isReady = true;
								this.HMethod = this.localProject.HostingProvider;
								this.PSiteLoc = this.localProject.RegSiteLoc;
								this.SSiteLoc = this.localProject.RegSecLoc;
								this.AMethod = this.localProject.AccessMethod;
								this.CTC = this.localProject.CTCID;
								this.CSI = this.localProject.CSI;
								this.golivedate = this.localProject.goLiveST;
								this.TypeOfServ = this.localProject.TypeOfService;
								this.ReqDescription = this.localProject.bdrationaled
								this.Supplier = this.localProject.Supplier_Name;
								this.RequesterTeam = this.localProject.TeamNames
								this.Requester = this.localProject.requester;
								this.Requester_x0020_Team_x0020_IDs = this.localProject.Requester_x0020_Team_x0020_IDs;
								this.Requester_x0020_ID = this.localProject.Requester_x0020_ID;
								//this.CartSectChkYes =  this.localProject.RegDesiExtApp;
								//this.CartSectChkNo = !this.CartSectChkYes;
								this.EngaMetMinute = this.localProject.RegEngage;
								/*
								let indexUrl = window["routeURL"].lastIndexOf('x/');
								let urlReturn = window["routeURL"].substring(0,indexUrl+1)
								window["routeURL"] = urlReturn.length>0?urlReturn:window["routeURL"];
								///console.log('User Info and Index ', window["routeURL"] , indexUrl);*/
								this._projectService.getCurrentUser()
									.then(user =>{
										this.currentUser = user;
										this._projectService.spCurrentUser = user;
										this.isUserReq = this.localProject.requester == this._projectService.spCurrentUser.Title?true:false;
										this.isuserReady =  true;
										//User Group;
										this._projectService.getUserGroup()
											.subscribe(group =>{
												
												for (var i = 0; i < group.length; i++) {

													console.log('user Group , ', group[i].Title);
													if(this.groups.indexOf(group[i].Title)>=0){
														this.isInGroup = true;
														this._projectService.isInGroup = this.isInGroup;
														break;	
													}
												}

													
											});
										//end
									})
								
								//Promise to find Xml File
								this.getXmlFile(this.localProject.nameurl);
								
								this.getFiles(this.localProject.name);
						})
						
						//console.log('User Info ', this.isUserReq , this.Id)
						if(!this.isUserReq)
							for(var i=0;i<this.votes.length;i++){
								this.voteList.push({
									key:this.votes[i]
								});
						}
						else
							for(var i=0;i<this.votesReq.length;i++){
								this.voteList.push({
									key:this.votesReq[i]
								});
						}


				}//is valid ID

				//call sector ..CARTBusinessUnit
				this._projectService.getListbyName('CARTBusinessUnit','').subscribe(
						data =>{
							this.sectorList = this._projectService.transform(data,'Sector');
							
						},
						err => { console.log("GET CARTBusinessUnit Error: " + err._body); }
				);
					//CARTDataCatalogs
				this._projectService.getListbyName('CARTDataCatalogs','')
					.subscribe(data =>{
								this.dataCatalogList = this._projectService.transform(data,'DataType');
								for(var x=0; x<this.dataCatalogList.length;x++){
									var catalog = this.dataCatalogList[x];
									if(catalog.key == "Data Classification") this.dataClassiList = catalog.value;
									else if(catalog.key == "Type of Request") this.dataTypeOfReqList = catalog.value;
									else if(catalog.key == "Years") this.dataYearsList = catalog.value;
									
								}
							},
							err => { console.log("GET CARTDataCatalogs Error: " + err._body); }
					);
				//setInterval
				setInterval(() => {
					
					this.newFileName = window["newName"];
					let fileUploaded = window["fileUploaded"];
					let fileUri = window["fileUri"];
					if(fileUploaded ==true){this.getFiles(this.localProject.name); window["fileUploaded"]=false;}


				},1500);

       
	}

	//Comparer Function  
	GetSortOrder(prop) {  
		return function(a, b) {  
			if (a[prop] < b[prop]) {  
				return 1;  
			} else if (a[prop] > b[prop]) {  
				return -1;  
			}  
			return 0;  
		}  
	} 

	tryObjects(xObject:any, message:string){
		var reMsg='';
		if(xObject && xObject.length>0) reMsg = "";
		else reMsg = message;
		window["focusMessage"] = reMsg;
		
		return reMsg;
	}

	public chkContractValue:boolean=false;
	public CartAppReChkValue:boolean=false;
	public replyVote:any;public CartSectChkYes:boolean=false;
	public isSaved:boolean=false;
	public Sector:any;public EngaMetMinute:any;
	public dataClassi:any;
	//go save current project
	goSaveProject(){
			this.isFocus = false
			window["RecordSaved"] = false;
			$('#SavingId').css('display','');
			var reqTeamIDs = "";
			var reqTeamNames = "";
			var email ="";
			this.RequesterTeamIDs = window["ReqTeamIDs"]?JSON.parse(window["ReqTeamIDs"]):"";
			if(this.RequesterTeamIDs && this.RequesterTeamIDs.length>0){
	
				//console.log('Processing RequesterTeamIDs ', this.RequesterTeamIDs);
				for(var i=0;i<this.RequesterTeamIDs.length;i++){
					email = this.RequesterTeamIDs[i].EntityData?this.RequesterTeamIDs[i].EntityData.Email:""
					if(email.length<=0) email = this.RequesterTeamIDs[i].Description;
					reqTeamIDs +=  email?email.substring(0,email.indexOf('@')) + ";":"";
					reqTeamNames += this.RequesterTeamIDs[i].DisplayText +";"
				};
	
			}
	
			var ReqID ="";
			var ReqName="";
			email ="";
			this.Requester_x0020_ID = window["RequesterId"]?JSON.parse(window["RequesterId"]):""; 
			
			if(this.Requester_x0020_ID && this.Requester_x0020_ID.length>0){
				ReqID = this.Requester_x0020_ID[0].Key;
				ReqName = this.Requester_x0020_ID[0].DisplayText;
				
			}
			
	
			var BisoID="";
			var BisoName="";
			email ="";
			this.BISO = window["BISOId"]?JSON.parse(window["BISOId"]):"";
			
			if(this.BISO && this.BISO.length>0){
				//console.log('Processing BISO ', this.BISO)
				email = this.BISO[0].EntityData?this.BISO[0].EntityData.Email:"";
				if(email.length<=0) email = this.BISO[0].Description;
				BisoID = email?email.substring(0,email.indexOf('@'))+"":"";
				BisoName = this.BISO[0].DisplayText;
				
			}
			//let strRequester = ReqName.length>0?ReqName:this.localProject.requester;
		
			let showMsg = "";
		
			if(this.tryObjects(this.TypeOfReq,"Type of Request must be selected").length>0) showMsg = window["focusMessage"];
			else if(this.tryObjects(this.TypeOfServ,"Type of Service must be selected").length>0) showMsg = window["focusMessage"];
			else if(isNaN(this.CSI)){window["focusMessage"]="CSI number must be entered";showMsg = window["focusMessage"];}
			else if(isNaN(this.CTC)){window["focusMessage"]="CTC number must be entered";showMsg = window["focusMessage"];}
			//		
			if(showMsg.length>0){
					window["isError"] = true;
					//this.showError(showMsg);
					this.focusMessage = showMsg;
					this.isSaved = false;
					this.isFocus = true;
					$('#msgID').css('display','');
					$('#modalID').css('display','none');
					$('#idSaved').css('display','none');
					$('#SavingId').css('display','none');
					
			}else
			setInterval(() => {
			
			let fileItems =  window["xmlItemPath"];
			let errorFlag = window["onerrorFlag"];
			showMsg = window["focusMessage"];
			$('#modalID').css('display','');
			this.golivedate = $("[name='golivedate']").val();
			this.CSI =$("[name='CSI']").val();
			this.CTC=$("[name='CTC']").val();
			this.PSiteLoc=$("[name='PSiteLoc']").val();
			this.SSiteLoc=$("[name='SSiteLoc']").val();
			this.AMethod=$("[name='AMethod']").val();
			this.TypeOfReq=$("[name='TypeOfReq']").val();
			this.dataClassi = $("[name='Dataclassi']").val();
			this.ReqDescription = $("[name='ReqDescription']").val();
			this.HMethod = $("[name='HMethod']").val();
			//this.Requester = $("[name='Requester']").val();
			if(showMsg.length<=0 && !this.isSaved && 
				this.golivedate && this.golivedate.length>0){
				//console.log('fileItems sync..!', fileItems);
				window["xmlItemPath"] = "";
				window["focusMessage"] = "";
				window["isError"] = false;
				showMsg = "";
				var jsonDate = new Date(this.golivedate).toJSON();
				this.isFocus = false;
				var regStatus = "Registration In Progress";
				if(this.isInGroup && (this.CartSectChkYes || this.CartSectChkNo)) regStatus = "Filling out the Request Form";
				var ProjectFileItemsData;
				 ProjectFileItemsData = {
					__metadata:{type:'SP.Data.CARTProjectsItem'},
					Sector:this.Sector,Product_x0020_Name:this.Product,Project_x0020_Name:this.localProject.name,
					CTCID:this.CTC,CSI:this.CSI,BISO_x0020_RO:BisoName,Request_x0020_Status:regStatus,
					RegRisk:this.IsRisk,RegSOXIndicator:this.SOXChkYes?true:false,RegKPMG:this.KPMGChkYes?true:false,
					RegAppChange:this.AppChkYes?true:false,RegDesiExtApp:this.CartSectChkYes?true:false,
					RegExiSupp:this.ESupplier?true:false,RegSiteLoc:this.PSiteLoc,RegSecLoc:this.SSiteLoc,
					Hosting_x0020_Provider:this.HMethod,Access_x0020_Method:this.AMethod,
					Business_x0020_Unit:this.BusinessUnit,Supplier_x0020_Name:this.Supplier,
					Type_x0020_Of_x0020_Request:this.TypeOfReq,Type_x0020_Of_x0020_Service:this.TypeOfServ,
					Go_x0020_Live_x0020_Date:jsonDate.substring(0,jsonDate.indexOf('T')),
					RegEngage:this.EngaMetMinute,
					Brief_x0020_Desciption_x0020_Rationale:this.ReqDescription,
					Contract_x0020_Re_x0020_Indicator:this.ContractChkYes?true:false,
					Data_x0020_Classification_x0020_Type:this.dataClassi,
					Requester_x0020_Team_x0020_Names:reqTeamNames.length>0?reqTeamNames:this.RequesterTeam,
					Requester_x0020_Team_x0020_IDs:reqTeamIDs.length>0?reqTeamIDs:this.Requester_x0020_Team_x0020_IDs,
					Requester_x0020_Name:ReqName.length>0?ReqName:this.Requester,
					Requester_x0020_ID:ReqID.length>0?ReqID:this.Requester_x0020_ID
					
					
				}
				
				
				console.log('Data before Update ' , ProjectFileItemsData);
				let data = this.metadata;
				this._projectService.updateProjects(ProjectFileItemsData,"CARTProjects", data)
					.then(e =>{
							//this.localProject.id = data.Id;
							$('#uploadSuccess').css('display','');
							$('#idSaved').css('display','');
							$('#msgID').css('display','none');
							$('#modalID').css('display','none');
							
							$('#SavingId').css('display','none');
							$('#SavedId').css('display','');
							this.isSaved = true;
							
						
							console.log('CARTProjectsItem has been updated ' , window["routeURL"] );
								
							
								
					},err => { console.log("CARTProjectsItem Error: " + err._body); });
				
	
	
				}else if(errorFlag && errorFlag.length>0){
					
					window["isError"] = true;
					this.focusMessage = errorFlag;
					this.isSaved = false;
					this.isFocus = true;
					$('#msgID').css('display','');
					$('#modalID').css('display','none');
					$('#idSaved').css('display','none');
					$('#SavingId').css('display','none');
					window["onerrorFlag"]="";
					
				}
				else if(showMsg.length>0){
					
					window["isError"] = true;
					this.focusMessage = showMsg;
					this.isSaved = false;
					$('#msgID').css('display','');
					$('#modalID').css('display','none');
					$('#idSaved').css('display','none');
					$('#SavingId').css('display','none');
					this.isFocus = true;
					
				}
			
			
			},1500);
	
	
	
		}
		
	
	
	chkContract(key){

		if(key.name =="ContractChkNo"){
			this.chkContractValue = key.checked;
			this.ContractChkYes = !key.checked;
		}else if(key.name =="ContractChkYes"){
			this.chkContractValue = key.checked;
			this.ContractChkNo = !key.checked;

		}else if(key.name =="CartAppReChkYes"){
			this.CartAppReChkValue = key.checked;
			this.CartAppReChkNo = !key.checked;

		}else if(key.name =="CartAppReChkNo"){
			this.CartAppReChkValue = key.checked;
			this.CartAppReChkYes = !key.checked;

		}
		


	}
	
	dropdown(value){
		
		console.log(value);
		var classvalue = value.offsetParent.className;
		if(classvalue.length>0)
			if("dropdown" == classvalue  || "dropdown active" == classvalue)
				this.className = "dropdown open";
			else 
				this.className = "dropdown";
		
	}
	
	public progBarValue:any;

	
	textChange(value){

		//console.log(value);
		
			 switch (value.name) {
				 case "Supplier":
					this.Supplier = value.value; 
					
					this.localProject.name = this.Supplier + "-" + this.Product + "-" + this.sector + "-" + this.BusinessUnit;
					break;
				case "Product":
					this.Product = value.value
					this.localProject.name = this.Supplier + "-" + this.Product + "-" + this.sector + "-" + this.BusinessUnit;
					break;
				 
			 }
		
		
	}
	
	public ContractChk; CartAppReChk;golivedate;Dedicated;VersionN;Requester;RequesterTeam;TypeOfReq;
	public ContractChkYes;CartAppReChkYes;CSI;CTC;
	public ContractChkNo;
	public CartAppReChkNo;
	public CartSectChkNo:boolean=false;
	public isCancel:boolean=false;

	changeValue(key){
		

		switch (key.name) {
			case "dataclassi":
			   this.dataClassiValue = key.value; 
			   			  
			   break;
		   	case "sector":
				this.sectorList.map(v => {
						if(v.key == key.value) this.businessUList = v.value;
					});
					this.localProject.name = this.Supplier + "-" + this.Product + "-" + this.sector + "-" + this.BusinessUnit;
			   break;
			case "BusinessUnit":
				   this.BusinessUnit = key.value;
				   this.localProject.name = this.Supplier + "-" + this.Product + "-" + this.sector + "-" + this.BusinessUnit;
			   break;
			
			case "Dedicated":
				this.Dedicated = key.value;
				break;
			case "TypeOfReq":
				this.TypeOfReq = key.value;
				break;
				case "ContractChkYes":
				this.ContractChkYes = key.value;
				this.ContractChkNo = !key.value;
				break;
			case "ContractChkNo":
				this.ContractChkNo = key.value;
				this.ContractChkYes = !key.value;
				break;
			case "AppChkYes":
				this.AppChkYes = key.value;
				this.AppChkNo = !key.value;
				break;
			case "AppChkNo":
				this.AppChkNo = key.value;
				this.AppChkYes = !key.value;
				break;
			case "SOXChkYes":
				this.SOXChkYes = key.value;
				this.SOXChkNo = !key.value;
				break;
			case "SOXChkNo":
				this.SOXChkNo = key.value;
				this.SOXChkYes = !key.value;
				break;
			case "CartSectChkYes":
				this.CartSectChkYes = key.value;
				this.CartSectChkNo = !key.value
				break;
			case "CartSectChkNo":
				this.CartSectChkNo = key.value;
				this.CartSectChkYes = !key.value;
				break
			case "KPMGChkYes":
				this.KPMGChkYes = key.value;
				this.KPMGChkNo = !key.value;
				break;
			case "KPMGChkNo":
				this.KPMGChkNo = key.value;
				this.KPMGChkYes = !key.value;
				break;
			
			case "ESupplier":
				this.ESupplier = key.value;
				this.NewSupplier =  !key.value;
				break;
			case "NewSupplier":
				this.NewSupplier = key.value;
				this.ESupplier = !key.value;
				break;
			
			
		}
		
	}
	
	changeValueBU(sector){
		this.sector = sector
		
	}
	
	textFocusOut(name){
		
		this.focusMessage = ""
		this.isFocus = false;
		console.log(name.value);
		
	}
	
	textFocus(name){
		
		this.focusMessage = "Is the environment Citi-only or is it shared with non-Citi tenants?"
		this.isFocus = true;
		console.log(name.value);
		
	}
    
	getFiles(xfile){
			
			//call files WS
		if(xfile){
			
			this._projectService.getFilesbyName(xfile).subscribe(
				data =>{
					let arrData=[]
						for(var x=0; x<data.length;x++){

							
							let Title = data[x].Title
							let TimeCreated = new Date(data[x].TimeCreated)
							let fileEditUrl = window["spSite"]+"/_api/Web/GetFileByServerRelativeUrl('"+data[x].ServerRelativeUrl+"')/ListItemAllFields"
							let linkToFile = data[x].ServerRelativeUrl;
							let localFileUri ='';
							let cartCategory;
							/* _api/web/getfolderbyserverrelativeurl
							 * Request URL:window["spSite"]+"/_api/Web/getfolderbyserverrelativeurl("+data[x].ServerRelativeUrl+")/ListItemAllFields
							 */
							this._projectService.getFileMetaData(fileEditUrl,'')
							.then(fData =>{
									cartCategory=undefined;
									fileEditUrl = window["spSite"]+"/CARTDocs/Forms/EditForm.aspx?ID="+fData.Id+"&Source="+window["spSite"]+
									"/SitePages/CARTDash.aspx/"+this.Id
									localFileUri = fData.File.__deferred.uri;
									if(fData.cartCategory) cartCategory = fData.cartCategory;
									//console.log('file ref ', fData)
								

							}).then(() =>{
								console.log('file ref 2nd time ',  localFileUri);
							
								this._projectService.getFileMetaData(localFileUri,'')
								.then(fileData =>{
									console.log('file ref 3er time ',  fileData);
									let fileIndex = fileData.Name.indexOf('.');
									let extFile = fileData.Name.substring(fileIndex+1);
									arrData.push({
										Title:fileData.Name,
										extFile:extFile,
										linkToFile:linkToFile,
										TimeCreated:(TimeCreated.getMonth() + 1) + '/' + TimeCreated.getDate() + '/' + TimeCreated.getFullYear(),
										fileEditUrl:fileEditUrl,
										cartCategory:cartCategory?cartCategory:"Select"
									});

								})
							})
							.catch(err =>{
								console.log('Error file ref ', err , fileEditUrl )
							})
							

							//console.log('Ext File and data ', arrData);

						}
						this.fileList = arrData;
						
					},
					err => { console.log("GET getFilesbyName Error: " + err._body); }
					);
		}
	}

	goProject() {

		console.log('go to ' , window["routeURL"]);
         this._route.navigate([window["routeURL"]]);
       

	}

	showCancel(isSave){
		this.isCancel = isSave;
		this.isFocus = isSave;
		this.focusMessage = isSave==true?"this record will be Cancelled would you like to continue?":""
	}
	goCancelProject(isSave){
		let ProjectCancelItem = {
			__metadata:{type:'SP.Data.CARTProjectsItem'},
			Request_x0020_Status:"Cancelled"
		}
		//updating
		
		console.log('Data before Cancel ' , ProjectCancelItem);
		let data = this.metadata;
		if(isSave)
			this._projectService.updateProjects(ProjectCancelItem,"CARTProjects", data)
				.then(e =>{
						//this.localProject.id = data.Id;
						$('#uploadSuccess').css('display','');
						$('#idSaved').css('display','');
						$('#msgID').css('display','none');
						$('#modalID').css('display','none');
						$('#SavingId').css('display','none');
						$('#SavedId').css('display','');
						this.isSaved = true;
						this.isCancel = false;
						this.isFocus =  false;
											
						
							
				},err => { console.log("goCancelProject Error: " + err._body);  this.isCancel = false;});
		//end updating
	}
	


}
