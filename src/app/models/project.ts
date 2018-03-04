export class Project {
id: number;
name: string;
created: Date;
requester: string;
reviewer: string;
status: string;
goLiveST: string;
newdate:  string;
nameurl:  string;
initiated: Date;
goLive: Date;
partCreatedDT:  string;
initDT: string;
sector: string;
businessUnit:string;
bdrationaled:string;
productName:string;
dataClasif:string;
dataClassifApprover:string;
LinkToThisRecord:string;
TeamNames:string;
CSI:string;
CTCID:string;
DataClassificationType:string;
TypeOfRequest:string;
TypeOfService:string;
TPUDate:string;
ESCDate:string;
SectorArchDate:string;
DRCOBDate:string;
DataPrivacyDate:string;
ISROCDate:string;
ReadyForAppDate:string;
CARTAppDate:string;
POCPilotWG:string;
SISOSector:string;
BISOData:string;
ReqDescription:string;
newName:any;
RegExiSupp:any;
RegSecLoc:any;
RegSiteLoc:any;
RegDesiExtApp:any;
RegAppChange:any;
RegKPMG:any;
RegSOXIndicator:any;
RegRisk:any;
ContractChkYes:any;
BISO_x0020_RO:any;
AccessMethod:any;
HostingProvider:any;
Supplier_Name:any
Requester_x0020_Team_x0020_IDs:any
Requester_x0020_ID:any;
RegEngage:any;
isRegForm:boolean=false;
statusReport:boolean=false;
datesReport:boolean=false;
tpuReport:boolean=false;
dataReport:boolean=false;
isrocReport:boolean=false;
pocpilotReport:boolean=false;
whiteISROC:boolean=false;ESCDateReport:boolean=false;
SectorArchReport:boolean=false;DRCOBReport:boolean=false;

    constructor(name: string, status: string, reviewer: string,
        requester: string, initDT:  string, id: number , golive: string,
        reqCreated: string, reqSector: string , reqBU:string , 
        reqBDRationale:string , reqPName:string, 
        reqDataClsif:string , reqTeamNames:string,
        reqCSI:string,reqCTCID:string,
        reqDataclassificationtype:string,reqTPUDate:string, 
        reqESCDate:string,reqSectorArchDate:string,reqDRCobDate:string,
        reqDataPrivacy:string,reqISROCDate:string,reqReadyForAppDate:string,
        reqCARTAppDate:string,reqTypeOfService:string,reqTypeOfRequest:string,
        reqPOCPilotWG:string,reqSISOSector:string, reqBISOData:string,
        reqRegRisk:string,reqRegSOXIndicator:string,reqRegKPMG:string,reqRegAppChange:string,
        reqRegDesiExtApp:string,reqRegExiSupp:string,reqRegSiteLoc:string,reqRegSecLoc:string,
        reqContractChkYes:any, reqBISO_x0020_RO:any , regAccessMethod:any, regHostingProvider:any,
        regSupplier_x0020_Name:any,regRequester_x0020_Team_x0020_IDs:any,regRequester_x0020_ID:any,
        regRegEngage:any) {

        this.RegEngage =  regRegEngage;
        this.Requester_x0020_Team_x0020_IDs = regRequester_x0020_Team_x0020_IDs;
        this.Requester_x0020_ID = regRequester_x0020_ID;
        this.Supplier_Name = regSupplier_x0020_Name;
        this.BISO_x0020_RO = reqBISO_x0020_RO;
        this.HostingProvider = regHostingProvider;
        this.AccessMethod = regAccessMethod;
        this.RegExiSupp = reqRegExiSupp;
        this.RegSecLoc = reqRegSecLoc;
        this.RegSiteLoc = reqRegSiteLoc;
        this.RegDesiExtApp = reqRegDesiExtApp;
        this.RegAppChange = reqRegAppChange;
        this.RegKPMG = reqRegKPMG;
        this.RegSOXIndicator = reqRegSOXIndicator;
        this.RegRisk = reqRegRisk;
        this.ContractChkYes = reqContractChkYes

        let NStarted = "Not Started";

        let xmlUrl = '' + name + '.xml';
        if(id >0) this.id = id;
        this.name = name;
        this.status = status;
        if(status && status.indexOf('Registration')>=0) this.isRegForm = true;else this.isRegForm=false
       
        this.reviewer = reviewer;
        this.nameurl =   '/CARTProjects/' + name + '.xml?openin=browser';
        //this.nameurl =  xmlUrl+'?OpenIn=PreferClient&NoRedirect=true&XmlLocation=' + window["siteServerRelativeUrl"] +'/'+ name + '';
        this.newName = 'new.xml'+'?OpenIn=PreferClient&NoRedirect=true&XmlLocation=' + window["siteServerRelativeUrl"] +'/new';
        this.requester = requester;
        this.initDT = initDT; this.TypeOfRequest = reqTypeOfRequest; this.TypeOfService = reqTypeOfService;
        this.sector = reqSector;
        this.businessUnit = reqBU;        this.bdrationaled = reqBDRationale;
        this.productName = reqPName;        this.dataClasif =  reqDataClsif;
        this.TeamNames = reqTeamNames;        this.CSI = reqCSI;
        this.CTCID = reqCTCID;        this.DataClassificationType = reqDataclassificationtype;
        if(reqTPUDate && reqTPUDate.length>0) this.TPUDate = reqTPUDate;
        else this.TPUDate = NStarted;
        if(reqESCDate && reqESCDate.length>0) this.ESCDate = reqESCDate;
        else this.ESCDate = NStarted;
        if(reqSectorArchDate && reqSectorArchDate.length>0) this.SectorArchDate = reqSectorArchDate;
        else this.SectorArchDate = NStarted;
        if(reqDRCobDate && reqDRCobDate.length>0) this.DRCOBDate = reqDRCobDate;
        else this.DRCOBDate = NStarted;
       
        this.DataPrivacyDate = reqDataPrivacy;
        this.ISROCDate  = reqISROCDate;
        this.ReadyForAppDate = reqReadyForAppDate;
        this.CARTAppDate = reqCARTAppDate;
        this.POCPilotWG = reqPOCPilotWG;
        this.SISOSector = reqSISOSector;
        this.BISOData = reqBISOData;

        let NandAValue = "N/A";
             
        if(this.status && this.status.indexOf("Approved")>=0)  this.statusReport = true;

        this.tpuReport = this.validateDate(this.TPUDate);
       
        this.isrocReport = this.validateDate(this.ISROCDate);
        
        //console.log('ISROC ', this.validateDate(this.ISROCDate) , this.id , this.ISROCDate);

        this.ESCDateReport = this.validateDate(this.ESCDate);

        this.SectorArchReport =  this.validateDate(this.SectorArchDate);
        
        this.DRCOBReport =  this.validateDate(this.DRCOBDate);

           
        if(this.TypeOfRequest && this.TypeOfRequest.indexOf('Prod')>=0) {this.POCPilotWG = NandAValue;this.pocpilotReport=true;}
       
        if(this.TypeOfRequest && this.TypeOfRequest.indexOf('POC')<0) {this.ISROCDate = NandAValue; this.isrocReport=false;}

        if(this.dataClasif && this.dataClasif.indexOf('PII')>=0) {this.DataPrivacyDate = NandAValue; this.dataReport=true}

        let diffDates;
        let one_day = 1000*60*60*24;
       if (id !== undefined) {
           
            if (initDT)  {
                this.initiated = new Date(initDT);
                this.initDT = (this.initiated.getMonth() + 1) + '/' + this.initiated.getDate() + '/' + this.initiated.getFullYear();
            }
            if (golive) {
                    this.goLive = new Date(golive);
                    this.goLiveST = (this.goLive.getMonth() + 1) + '/' + this.goLive.getDate() + '/' + this.goLive.getFullYear();
            }
            //calculate diff...
            if(this.initiated && this.goLive){
                diffDates = this.goLive.getTime() - this.initiated.getTime();
               // console.log('Dates range ', this.goLive, this.initiated , Math.round(diffDates/one_day))
                this.datesReport  = Math.round(diffDates/one_day)<=30?true:false;
            }
            //especial case
            if (initDT) {
                    this.created = new Date(initDT);
                    this.newdate = (this.created.getMonth() + 1) + '/' + this.created.getDate() + '/' + this.created.getFullYear();
                    if ((this.created.getMonth() + 1) <= 9) {
                        this.partCreatedDT = this.created.getFullYear() + '-0' + (this.created.getMonth() + 1);
                    }else {
                        this.partCreatedDT = this.created.getFullYear() + '-' + (this.created.getMonth() + 1);
                    }
            }
       
           


        }
    }

    private  validateDate(field:any){

        if(field == null || field.toString() == "undefined") return false;
        
        if(field && field.length<=0) return false;

        let dateChk = new Date(field);
       
        return dateChk.toString().indexOf("Invalid")<0;

    }

    public static fromJson(json: any) {
        return new Project(json.Project_x0020_Name, 
        json.Request_x0020_Status,
        json.Reviewer_x0020_Name, json.Requester_x0020_Name,
        json.Process_x0020_Initiation_x0020_Date, json.ID,
        json.Go_x0020_Live_x0020_Date, json.Created , 
        json.Sector,json.Business_x0020_Unit,
        json.Brief_x0020_Desciption_x0020_Rationale,
        json.Product_x0020_Name,
        json.Data_x0020_Classification_x0020_Type,
        json.Requester_x0020_Team_x0020_Names,
        json.CSI,json.CTCID,json.Data_x0020_Classification_x0020_Type,
        json.TPUDate,json.ESCDate,json.Sector_x0020_Arch_x0020_Date,
        json.DRCOBDate,json.Data_x0020_Privacy_x0020_Date,
        json.ISROCDate,json.Ready_x0020_For_x0020_App_x0020_Date,
        json.CARTApp_x0020_Date,json.Type_x0020_Of_x0020_Service,
        json.Type_x0020_Of_x0020_Request,json.POCPilot_x0020_WG,
        json.SISOSector,json.BISOData_x0020_Date,
        json.RegRisk,json.RegSOXIndicator,json.RegKPMG,
        json.RegAppChange,json.RegDesiExtApp,json.RegExiSupp,
        json.RegSiteLoc,json.RegSecLoc,
        json.Contract_x0020_Re_x0020_Indicator,json.BISO_x0020_RO,
        json.Access_x0020_Method, json.Hosting_x0020_Provider, 
        json.Supplier_x0020_Name,json.Requester_x0020_Team_x0020_IDs,
        json.Requester_x0020_ID, json.RegEngage);
    }

    public static fromJsonList(json: any) {
        const  list = [];
        for (let i = 0; i < json.length; i++) {
            list.push(Project.fromJson(json[i]));
        }
        return list;
    }
}
