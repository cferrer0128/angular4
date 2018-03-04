import {Project} from '../models/project';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import {Http, Response, Headers} from '@angular/http';
import {Injectable} from '@angular/core';
import { retry } from 'rxjs/operator/retry';


declare var jquery: any;
declare var $: any;
declare var _spPageContextInfo:any;

@Injectable()
export class ProjectService {

    private spApiUrl: string;
    private userIdUrl: string;
    public Id: string;
    private _flights: any;
    private sQuery: any;
    private LIST_URL = window["spSite"] + "/_api/web/lists/getByTitle('CARTProjects')/items";
    public filterQuery:string=""
    public filterRecords:any;
    public static filteredData:any;
    public spContext = _spPageContextInfo;
    public isRequester:boolean=false;
    public spCurrentUser:any;
    public isInGroup:boolean=false;
    public newRecordId:number=0;

    

    constructor(private http: Http) {
        console.log('http on services started..' , _spPageContextInfo.webAbsoluteUrl);
     }


     transform(value: Array<any>, field: string): Array<any> {
        const groupedObj = value.reduce((prev, cur)=> {
        if(!prev[cur[field]]) {
            prev[cur[field]] = [cur];
        } else {
            prev[cur[field]].push(cur);
        }
        return prev;
        }, {});
        return Object.keys(groupedObj).map(key => ({ key, value: groupedObj[key] }));
    }

     setHeaders(verb: string) {
        let headers =  new Headers();
        let digest = window["digest"];
       // console.log('Disgest..!!! ', digest);
        //if ( document.getElementById('__REQUESTDIGEST')) {digest = document.getElementById('__REQUESTDIGEST').innerHTML;}

            if(verb == "GET")
                headers.set('Accept', 'application/xml;odata=verbose');
            else headers.set('Accept', 'application/json;odata=verbose');

            headers.set('X-RequestDigest', digest);

            switch (verb) {
            case 'POST':
                headers.set('Content-type', 'application/json;odata=verbose');
                headers.set('Accept', 'application/json;odata=verbose');
                break;
            case 'PUT':
                headers.set('Content-type', 'application/json;odata=verbose');
                headers.set('IF-MATCH', this.meta.__metadata.etag); 
                headers.set('X-HTTP-Method', 'MERGE');
                break;
            case 'DELETE':
                headers.set('IF-MATCH', '*');
                headers.set('X-HTTP-Method', 'DELETE');
                break;
        }

        return headers;
     }
     //casttheVode
     postCARTProject(jsonObject:any , listName:any){
        var sListUrl = window["spSite"] + "/_api/web/lists/getByTitle('"+listName+"')/fields";
      	return this.http.post(sListUrl,JSON.stringify(jsonObject), { headers: this.setHeaders('POST') })
                .map((res: Response) => res.json().d.results)
                .toPromise();
                

     }
      //casttheVode
      castVote(jsonObject:any){
        var sListUrl = window["spSite"] + "/_api/web/lists/getByTitle('CARTApprovalVote')/items";
      	return this.http.post(sListUrl,JSON.stringify(jsonObject), { headers: this.setHeaders('POST') })
                .map((res: Response) => res.json().d.results);

     }
     //updateProjects
     public meta:any;
     updateProjects(jsonObject:any, listName:any , meta:any){
        this.meta =  meta;
        //var sListUrl = window["spSite"] + "/_api/web/lists/getByTitle('"+listName+"')/items("+ ID +")";

        var sListUrl = meta.__metadata.uri;
        console.log('URL Before POST ', sListUrl )
      	return this.http.post(sListUrl,JSON.stringify(jsonObject), { headers: this.setHeaders('PUT') })
                .map((res: Response) => res.json())
                .toPromise();

     }
     //postProjects
     postProjects(jsonObject:any, listName:any){
        var sListUrl = window["spSite"] + "/_api/web/lists/getByTitle('"+listName+"')/items";
      	return this.http.post(sListUrl,JSON.stringify(jsonObject), { headers: this.setHeaders('POST') })
                .map((res: Response) => res.json().d.results)
                .toPromise();

     }
      //getProjects
      getProjectById(Id: string ) {
        let results = [];
         if (Id) {
            var sListUrl = window["spSite"] + "/_api/web/lists/getByTitle('CARTProjects')/items("+Id+")";
            
            return this.http.get(sListUrl, { headers: this.setHeaders('') })
                .map((res: Response) => res.json().d)
                .toPromise();
        }
       
     }
     //getProjects
     getProjects(Id: string , nextUrl: string) {
        let results = [];
         if (Id === undefined) {
            this.sQuery =  this.LIST_URL + '?&$orderby=ID desc';
            if (nextUrl)  { this.sQuery = nextUrl; }
            this._flights = this.http.get(this.sQuery, { headers: this.setHeaders('') })
                .map((res: Response) => {
                    results = res.json().d.results;
                    
                    if (res.json().d.__next) {
                        results.push({next: res.json().d.__next});
                    }
                    return results;
                });
        }else {
            console.log('running with cache..!');

        }
        return this._flights;
     }
     //getCurrentUser
     getCurrentUser(){
		var sListUrl = window["spSite"] + "/_api/web/getuserbyid(" + window["userId"] +")";
		return this.http.get(sListUrl, { headers: this.setHeaders('') })
                .map((res: Response) =>{
                    this.spCurrentUser = res.json().d;
                    return res.json().d;
                })
                .toPromise();
    }
    //Xml File
  	getXmlFilesbyName(projectName, isXML){
        var sListUrl = window["spSite"]  + "/CARTProjects/" + projectName +".xml";
        console.log('looking for ', sListUrl)
        var xml:any;
        var xmltext:any;
        var arry=[];
       	return this.http.get(sListUrl, { headers: this.setHeaders("GET") })
                .map((res: any) => {
                   
                    //console.log('res ' , res)
                    if(isXML) xml = $.parseXML(res._body);
                    else  xml = res._body;
                                       
                    return xml;
                }).toPromise();
    }        
    //get  List any list
	getFilesbyName(projectName){
        var sListUrl = window["spSite"]  + "/_api/web/getfolderbyserverrelativeurl('CARTDocs/" + projectName +"')/files";
        console.log('URL Before get files ' , sListUrl) , projectName
		return this.http.get(sListUrl, { headers: this.setHeaders('') })
                .map((res: Response) => res.json().d.results);
    }
    //get curretn User group List
    getUserGroup(uId){
          var sListUrl = window["spSite"] + "/_api/web/GetUserById('" + uId +"')/groups";
        
		return this.http.get(sListUrl, { headers: this.setHeaders('') })
                .map((res: Response) => res.json().d.results);
                
    }
    //get  List any list
	getListbyName(listName, Query){
        //?&orderby=Sector
        var sListUrl = window["spSite"] + "/_api/web/lists/getByTitle('" + listName +"')/items" + Query;
        
		return this.http.get(sListUrl, { headers: this.setHeaders('') })
                .map((res: Response) => res.json().d.results);
	} 
    //get file metadata..
    getFileMetaData(filePath, Query){
        //?&orderby=Sector
        //   Request URL: https://yome.sharepoint.com/sites/dev/_api/Web/GetFileByServerRelativePath(decodedurl='/sites/dev/CARTProjects/new1515097758.xml')/ListItemAllFields
        var sListUrl = filePath;
        
		return this.http.get(sListUrl, { headers: this.setHeaders('') })
                .map((res: Response) => res.json().d)
                .toPromise();
	} 
     //get  List any list
	getFieldListbyName(listName){
        //?&orderby=Sector
        var sListUrl = window["spSite"] + "/_api/web/lists/getByTitle('" + listName +"')/fields";
        
		return this.http.get(sListUrl, { headers: this.setHeaders('') })
                .map((res: Response) => res.json().d.results)
                .toPromise();
	} 

}
