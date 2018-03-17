import { Component, OnInit , OnDestroy} from '@angular/core';

import { ProjectService } from '../services/project.service';

import { Router, ActivatedRoute } from '@angular/router';

import {Project} from '../models/project';


declare var jquery: any;
declare var $: any;
declare var SP:any;
declare var Function:any;

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.css']
})

export class NewComponent implements OnInit, OnDestroy {

	public Id:any;
	public localProject: Project;
	public isReady: boolean = false;
	public isuserReady:boolean=false
	public isNew:boolean = true;
	public dataYearsList:any;
	public sectorList:any;
	public businessUList=[];
	public dataCatalogList:any;
	public dataClassiList:any;
	public dataTypeOfReqList:any;
	public fullName:string="";
	public Sector:string="";
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
	public dataRiskList=[];
	public typeOfServices=[];
	public AccessMethodList=[];
	public TypeOfServ;
	public isSaved:boolean=false;
	public isInGroup:boolean=false;
	constructor(private _route: Router , 
    private _activeroute: ActivatedRoute,
    private _projectService: ProjectService) { 
		 this.localProject = new Project('','','','','',0,'','','','','','','','','','',''
		 ,'','','','','','','','','','','','','',
		 '','','','','','','','','','','','','','','','');
        this._activeroute.params.subscribe( params => {
			  console.log('new request  ', params["id"]);
			 
			
        });
      
        
  }


	getNodeXml(elem:any,toFindWord:string){


		var node:any;

		if(elem.childElementCount>0)
			for(var i=0; elem.children.length;i++){
				node = elem.children[i];
				//try to find the node at level 1
				//if(node) console.log('Looping!!',node.localName);
				
				if(node && node.localName.toLowerCase() == toFindWord.toLowerCase()){
					
					this.Revalue = node.innerHTML;
					this.isfound=true;
					return this.Revalue;
				}

				if(node && !this.isfound)
					this.getNodeXml(node,toFindWord);
				else return this.Revalue;
				
			}
		//tryto find recursively
		//if(!isfound) this.getNodeXml(node,toFindWord);
		return this.Revalue;
	}

	getXmlFile(ProjectName:any){
		//var item = this.localProject;
		var fields =['LinkToThisRecord','DataClassificationApprover','DataClasiTypeRO','RequesterTeam','BriefDescriptionRationale'];
		var tempDisplayValue = '';
		var jsonData={};
		this._projectService.getXmlFilesbyName(ProjectName, false).then(xmlData => {
				
				//console.log('New Xml Doc-->', xmlData);
				window["xmlFile"] = xmlData;	
				
			}, err =>{ console.log('Error on xmlData : ', err); });

	} 

	elem = {
		key :"Select",
		Title :"Select",
		Value :"Select",
		BusinessUnit:"Select"
	}

	ngOnDestroy() {
		// ...
		
		/*this.BISO = "";
		this.Requester = "";
		this.RequesterTeam ="";
		this.RequesterTeamIDs ="";
		this.CSI ="";this.CTC="";
		this.golivedate="";this.PSiteLoc="";
		this.SSiteLoc="";this.AMethod="";
		this.Product="";this.Supplier="";
		this.isSaved=false;this.localProject.name="";*/
	  }
	ngOnInit() {
	
			window["isAll"]=false;
			this.isNew = true; 
			this.isReady = true; 
			this.localProject.name = "New Project";
			this.BISO = "";
			this.Requester = "";
			this.RequesterTeam ="";
			this.RequesterTeamIDs ="";
			this.CSI ="";this.CTC="";
			this.golivedate="";this.PSiteLoc="";
			this.SSiteLoc="";this.AMethod="";
			this.Product="";this.Supplier="";
			this.isSaved=false;
			//filter by Team Member or Requester
			// eq 'Service'
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
						Value:data[i].Id});

				}//loop
				if(navigator.userAgent.indexOf("MSIE")>=0){
					this.typeOfServices.unshift(this.elem);
					this.dataRiskList.unshift(this.elem);
					this.AccessMethodList.unshift(this.elem);
				}	
					
				
			});
			//Promise to find Xml File
			this.getXmlFile(this.localProject.newName);

				//calling current User...
				this._projectService.getCurrentUser().then(
						data =>{
							this.isuserReady =  true;
							this.currentUser = data;
							
							this.isInGroup = this._projectService.isInGroup;

							console.log('User Returned ' , this.currentUser.Id , this._projectService.isInGroup);
						},err => { console.log("GET Current User Error: " + err._body); }
					);
			
					//call sector ..CARTBusinessUnit
				this._projectService.getListbyName('CARTBusinessUnit','').subscribe(
						data =>{
							let arrSector = []
							this.sectorList = this._projectService.transform(data,'Sector');
							this.sectorList.map(e => {
								//console.log( 'sectors ' , e)
								if(e.key =="CTI" || e.key =="CTO" || 
								e.key =="GCG" || e.key =="ICG" ) arrSector.push(e) ;
							});
							if(navigator.userAgent.indexOf("MSIE")>=0){
								
								arrSector.unshift(this.elem);
							}
							this.sectorList = arrSector;
							
						},err => { console.log("GET CARTBusinessUnit Error: " + err._body); }
					);
					//CARTDataCatalogs
					this._projectService.getListbyName('CARTDataCatalogs','').subscribe(
						data =>{
								this.dataCatalogList = this._projectService.transform(data,'DataType');
								for(var x=0; x<this.dataCatalogList.length;x++){
									var catalog = this.dataCatalogList[x];
									//console.log('catalog Value ',catalog.value)
									if(catalog.key == "Data Classification"){
										if(navigator.userAgent.indexOf("MSIE")>=0)	catalog.value.unshift(this.elem);
										this.dataClassiList = catalog.value;
									} 
									else if(catalog.key == "Type of Request") {
										if(navigator.userAgent.indexOf("MSIE")>=0)	catalog.value.unshift(this.elem);
										this.dataTypeOfReqList = catalog.value;
									}
									
									else if(catalog.key == "Years") this.dataYearsList = catalog.value;
									
								}
							},
							err => { console.log("GET CARTDataCatalogs Error: " + err._body); }
							);
				setInterval(() => {
					window["ProjectName"] =  this.Sector + "-" + this.Supplier + "-" + this.Product;
					
					
					
				},1500);

       
	}

	public chkContractValue:boolean=false;
	public CartAppReChkValue:boolean=false;
	public IsRisk:string;public PSiteLoc:string;public SSiteLoc:string;
	public AMethod:string;public HMethod:string;
	public SOXChkYes:boolean=false;
	public SOXChkNo:boolean=false;
	public KPMGChkYes:boolean=false;public KPMGChkNo:boolean=false;
	public AppChkYes:boolean=false;public AppChkNo:boolean=false;
	public CartSectChkYes:boolean=false;public CartSectChkNo:boolean=false;
	public ESupplier:boolean=false;public NewSupplier:boolean=false;
	private oListItem:any;
	public EngaMetMinute:string;
	public ID:any;
	//public ESupplier:boolean=false;


	//
	changeDateValue(mydate){
		//console.log('mydate sync..!', mydate)
		this.golivedate = mydate;

	  }
	  
	  updateCSOM(id , myGoLiveDate, ISROCDATE){


		let clientContext = new SP.ClientContext(window["spSite"]);  


		let oList = clientContext.get_web().get_lists().getByTitle("CARTProjects");

		this.oListItem = oList.getItemById(id);
		this.oListItem["Go_x0020_Live_x0020_Date"] = myGoLiveDate
		this.oListItem["Going_x0020_For_x0020_ISROCDate"] = ISROCDATE;
		/*this.oListItem['RegSOXIndicator'] = this.SOXChkYes?true:false;
		this.oListItem['RegRisk'] = this.IsRisk;   
		this.oListItem['RegKPMG'] = this.KPMGChkYes?true:false;   
		this.oListItem['RegAppChange'] = this.AppChkYes?true:false;   
		this.oListItem['RegDesiExtApp'] = this.CartSectChkYes?true:false;   
		this.oListItem['RegExiSupp'] = this.ESupplier?true:false;   */
	
		this.oListItem.update();

		clientContext.executeQueryAsync(Function.createDelegate(this, this.onSuccess), Function.createDelegate(this, this.onFail));



}

	onSuccess(sender, args) {

		console.log('saved executed!!!' );

	}



	onFail(sender, args) {

		console.log('failed to get list. Error:' + args.get_message());

	}
	//showError
	showError(msg){

		this.focusMessage = msg;
		this.isSaved = false;
		$('#msgID').css('display','');
		$('#modalID').css('display','');
		$('#idSaved').css('display','none');
	}

	tryObjects(xObject:any, message:string){
		var reMsg='';
		if(xObject && xObject.length>0) reMsg = "";
		else reMsg = message;
		window["focusMessage"] = reMsg;
		
		return reMsg;
	}

	ProjectSaved(){
		//$('#msgID').css('display','none');
		if(this.isSaved){
			$('#modalID').css('display','none');
			this._route.navigate([window["routeURL"]]);
			window["RecordSaved"] = true;
		}
	}
	//go save current project
	goSaveProject(){
		this.isFocus = false
		window["RecordSaved"] = false;
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
		this.Requester = window["RequesterId"]?JSON.parse(window["RequesterId"]):""; 
		
		if(this.Requester && this.Requester.length>0){
			ReqID = this.Requester[0].Key;
			ReqName = this.Requester[0].DisplayText;
			
			
		}
		//make sure is a Requester!!!
		if(ReqID =="" || ReqID =="Requester")
		{
			email = this.currentUser?this.currentUser.Email:"";
			ReqID =   email.substring(0,email.indexOf('@'))+"";
			
			if(ReqID && ReqID.indexOf('\\')>0)
				ReqID = ReqID?ReqID.substring(0,ReqID.indexOf('\\'))+"":"";
			
			ReqName = this.currentUser.Title;

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
			if(BisoID.length<=0)
				BisoID = email?email.substring(0,email.indexOf('\\'))+"":"";
			
			BisoName = this.BISO[0].DisplayText;
			
		}
		let strRequester = ReqName.length>0?ReqName:this.localProject.requester;

		var jsonProjectData = {
			__metadata:{type:'SP.Data.CARTProjectsItem'},
			Sector:this.Sector,Product_x0020_Name:this.Product,Project_x0020_Name:this.localProject.name,
			Business_x0020_Unit:this.BusinessUnit,Dedicated_x0020_Or_x0020_Shared:this.Dedicated,
			Data_x0020_Classification_x0020_Type:this.dataClassiValue,Brief_x0020_Desciption_x0020_Rationale:this.ReqDescription,
			Supplier_x0020_Name:this.Supplier,Requester_x0020_Name:ReqName,Requester_x0020_ID:ReqID,
			Go_x0020_Live_x0020_Date:this.golivedate,
			Requester_x0020_Team_x0020_Names:reqTeamNames,Requester_x0020_Team_x0020_IDs:reqTeamIDs,
			CTCID:this.CTC,CSI:this.CSI,BISO_x0020_RO:BisoName,Type_x0020_Of_x0020_Request:this.TypeOfReq,Version_x0020_Number:this.VersionN,
			Contract_x0020_Re_x0020_Indicator:this.ContractChkYes?true:false,
			Reviewer_x0020_Name:"",Reviewer_x0020_ID:""
		}
		
		this.golivedate = $("[name='golivedate']").val();
		this.AMethod=$("[name='AMethod']").val()
		let showMsg = "";
		if(this.tryObjects(this.Sector,"Sector must be selected").length>0) showMsg = window["focusMessage"];
		else if(this.tryObjects(this.BusinessUnit,"Business Unit must be selected").length>0) showMsg = window["focusMessage"];
		else if(this.tryObjects(this.TypeOfReq,"Type of Request   must be selected").length>0) showMsg = window["focusMessage"];
		else if(this.tryObjects(this.TypeOfServ,"Type of Service must be selected").length>0) showMsg = window["focusMessage"];
		else if(this.tryObjects(this.dataClassiValue,"Information Classification must be selected").length>0) showMsg = window["focusMessage"];
		else if(this.tryObjects(this.golivedate,"Go Live Date must be selected").length>0) showMsg = window["focusMessage"];
		else if(this.tryObjects(this.AMethod," Access Method must be selected ").length>0) showMsg = window["focusMessage"];
		else if(this.tryObjects(BisoName,"Name of the Business Information Security Officer [BISO] must be selected").length>0) showMsg = window["focusMessage"];
		else if(isNaN(this.CSI)){window["focusMessage"]="a number must be entered on CSI";showMsg = window["focusMessage"];}
		else if(isNaN(this.CTC)){window["focusMessage"]="a number must be entered on CTC";showMsg = window["focusMessage"];}
		else if(this.AMethod == "Select"){window["focusMessage"]=" Access Method must be selected ";showMsg = window["focusMessage"];}
		
		var ProjectFileItemsData=null;
		//		
		if(showMsg.length>0){
				window["isError"] = true;
				//this.showError(showMsg);
				this.focusMessage = showMsg;
				this.isSaved = false;
				this.isFocus = true;

				setTimeout(() => {
					$('#msgID').css('display','');$('#warningId').css('display','');
					$('#modalID').css('display','none');
					$('#idSaved').css('display','none');
					$('.saving').css('display','none');
				},1000)
				
				
				
		}else
		setInterval(() => {
			let fileItems =  window["xmlItemPath"];
			let errorFlag = window["onerrorFlag"];
			showMsg = window["focusMessage"];
			$('#modalID').css('display','');
			this.golivedate = $("[name='golivedate']").val();
			this.Sector = $("[name='Sector']").val();
			this.CSI =$("[name='CSI']").val();this.CTC=$("[name='CTC']").val();
			this.PSiteLoc=$("[name='PSiteLoc']").val();
			this.SSiteLoc=$("[name='SSiteLoc']").val();this.AMethod=$("[name='AMethod']").val();
			this.Product=$("[name='Product']").val();this.Supplier=$("[name='Supplier']").val();
			this.ReqDescription = $("[name='ReqDescription']").val();
			this.HMethod = $("[name='HMethod']").val();
			this.localProject.name = this.Sector+"-"+this.Supplier+"-"+this.Product;
			this.localProject.id = window["RecordId"];
		//console.log('golivedate ' , $("[name='golivedate']").val())
		if(fileItems.length>0 && showMsg.length<=0 && 
			!this.isSaved && this.golivedate && this.golivedate.length>0){
			//console.log('fileItems sync..!', fileItems);
			window["xmlItemPath"] = "";
			window["focusMessage"] = "";
			window["isError"] = false;
			showMsg = "";
			var jsonDate = new Date(this.golivedate).toJSON();
			this.isFocus = false;
			this._projectService.getFileMetaData(fileItems,'')
			.then(data => {
				console.log('Data ID   ' , data.Id);
				this.ID = data.Id;
				//$("[name='RecordId']").val("Project Id: "+data.Id);
				this._projectService.newRecordId = data.Id;
				ProjectFileItemsData = {
					__metadata:{type:'SP.Data.CARTProjectsItem'},
					Sector:this.Sector,Product_x0020_Name:this.Product,Project_x0020_Name:this.localProject.name,
					Requester_x0020_Team_x0020_Names:reqTeamNames,Requester_x0020_Team_x0020_IDs:reqTeamIDs,
					CTCID:this.CTC,CSI:this.CSI,BISO_x0020_RO:BisoName,Request_x0020_Status:'Registration In Progress',
					RegRisk:this.IsRisk,RegSOXIndicator:this.SOXChkYes?true:false,RegKPMG:this.KPMGChkYes?true:false,
					RegAppChange:this.AppChkYes?true:false,RegDesiExtApp:this.CartSectChkYes?true:false,
					RegExiSupp:this.ESupplier?true:false,RegSiteLoc:this.PSiteLoc,RegSecLoc:this.SSiteLoc,
					Hosting_x0020_Provider:this.HMethod,Access_x0020_Method:this.AMethod,
					Requester_x0020_Name:ReqName,Requester_x0020_ID:ReqID,
					Business_x0020_Unit:this.BusinessUnit,Supplier_x0020_Name:this.Supplier,
					Type_x0020_Of_x0020_Request:this.TypeOfReq,Type_x0020_Of_x0020_Service:this.TypeOfServ,
					Go_x0020_Live_x0020_Date:jsonDate.substring(0,jsonDate.indexOf('T')),
					RegEngage:this.EngaMetMinute,
					Brief_x0020_Desciption_x0020_Rationale:this.ReqDescription,
					Contract_x0020_Re_x0020_Indicator:this.ContractChkYes?true:false,
					Data_x0020_Classification_x0020_Type:this.dataClassiValue
					
					
					
				}
				console.log('Data before save ' , ProjectFileItemsData);
					
			
				this._projectService.updateProjects(ProjectFileItemsData,"CARTProjects", data)
						.then(e =>{

									console.log('Data ID   ' , data.Id);
									this.localProject.id = data.Id;
									$('#uploadSuccess').css('display','');
									$('#idSaved').css('display','');
									$('#msgID').css('display','none');
									$('#modalID').css('display','none');
									$('#SavingId').css('display','none');
									$('#SavedId').css('display','');
									this.isSaved = true;
									let indexUrl = window["routeURL"].indexOf('/new');
									if(indexUrl>=0){
										let urlReturn = window["routeURL"].substring(0,indexUrl)
										window["routeURL"] = urlReturn;
									}
									window["RecordId"] = data.Id;
								
									console.log('CARTProjectsItem has been created ' , window["routeURL"] );
									
								
									
						},err => { 
							
							console.log("CARTProjectsItem Error: " + err._body); 
						
							let varLog = {
								Id: this.ID,
								errLog:err._body,
								data:ProjectFileItemsData
							}
							let cartlog ={ __metadata:{type:'SP.Data.CARTSPLogListItem'},cartlog:varLog}
							try{
								//AddCARTSPLog
								this._projectService.postProjects(cartlog,'CARTSPLog')
								.then(logResponse =>{
									console.log('Log already added ' , logResponse)
								})
								
							}catch(e){
								console.log('Error Log  varLog ' , varLog , e)
							}
							
						}
						);
						

			}, err => { 
				console.log("getFileMetaData Error: " + err._body);
			
			})
			


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
	
	//chk

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
	
	textChange(value){

		//console.log(value);
		
			 switch (value.name) {
				 case "Supplier":
					this.Supplier = value.value; 
					
					break;
				case "Product":
					this.Product = value.value
				
					break;
				 
			 }

			 this.localProject.name = this.Sector + "-" + this.Supplier + "-" + this.Product;
		
		
	}
	
	public ContractChk; CartAppReChk;Dedicated;VersionN;Requester;RequesterTeam;TypeOfReq;
	public ContractChkYes;ContractChkNo;CartAppReChkYes;CartAppReChkNo;CSI;CTC;
	public golivedate:any;

	changeValue(key){
		

		switch (key.name) {
			case "Dataclassi":
			   this.dataClassiValue = key.value; 
			   break;
		   	case "Sector":
				this.sectorList.map(v => {
						if(v.key == key.value ) console.log(' array ', v.value);
					});
				this.businessUList =[];
				for(var i=0; i<this.sectorList.length;i++){
					var list = this.sectorList[i];
					if(this.sectorList[i].key == key.value){
						for(var x=0;x<this.sectorList[i].value.length;x++){
							var BeU = this.sectorList[i].value[x];
							if(BeU.BusinessUnit && BeU.BusinessUnit.length>0)	this.businessUList.push(BeU)
							
						}
						if(navigator.userAgent.indexOf("MSIE")>=0)	this.businessUList.unshift(this.elem);
						break;
					}
						
					
				}


			   break;
			case "BusinessUnit":
				this.BusinessUnit = key.value;
				
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
			case "CartSectChkYes":
				this.CartSectChkYes = key.value;
				this.CartSectChkNo = !key.value;
				break;
			case "CartSectChkNo":
				this.CartSectChkNo = key.value;
				this.CartSectChkYes = !key.value;
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

		this.localProject.name = this.Sector + "-" + this.Supplier + "-" + this.Product;
		
	}
	
	changeValueBU(sector){
		this.Sector = sector
		
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
						this.fileList = data;
						
					},
					err => { console.log("GET getFilesbyName Error: " + err._body); }
					);
		}
	}

	goProject() {

         this._route.navigate([window["routeURL"]]);
       

	}
	


}
