import * as _ from "lodash";
import {Pipe, PipeTransform} from "@angular/core";
import { ProjectService } from './services/project.service';

@Pipe({
    name: "dataFilter"
})
export class DataFilterPipe implements PipeTransform {

    

constructor(private service:ProjectService){
    
}

public items =[];


private loopArray(filterArray){

    for(var i=0;i <filterArray.length;i++){
       
        this.items.push(filterArray[i]);
       
    }
}



    transform(array: any[], query: string): any {

        //console.log('array and query ', array , query)
        var arrFilter:any;
        this.items = [];
        let arrDataFilter = ProjectService.filteredData;
        if(arrDataFilter && arrDataFilter.length>0) array = arrDataFilter;
        // this.service.filterRecords = array;
        if (query && (this.service.filterQuery.length<=0 
            || this.service.filterQuery =="All" 
            || this.service.filterQuery == "ProjectName")) {
                this.service.filterRecords = _.filter(array, row=> (row.name && 
                    row.name.toLowerCase().indexOf(query.toLowerCase())) > -1);
            
        }
        else if (query && query.indexOf('My')>0){
            this.service.filterRecords = arrDataFilter;
        }
        else if(query && this.service.filterQuery =="Status"){
                arrFilter = _.filter(array, row=> (row.status && 
                 row.status.toLowerCase().indexOf(query.toLowerCase()))> -1);
                 this.loopArray(arrFilter.filter(f => f.status !=null));
                 this.service.filterRecords =  this.items;
            
        }
        else if(query && this.service.filterQuery =="Requester"){
                arrFilter = _.filter(array, row=> (row.requester && 
                row.requester.toLowerCase().indexOf(query.toLowerCase()))> -1);
                this.loopArray(arrFilter.filter(f => f.requester !=null));
                this.service.filterRecords =  this.items;
            
        }
        else if(query && this.service.filterQuery =="Reviewer"){
                arrFilter = _.filter(array, row=> (row.reviewer &&  
                row.reviewer.toLowerCase().indexOf(query.toLowerCase()))> -1);
                this.loopArray(arrFilter.filter(f => f.reviewer !=null));
                this.service.filterRecords =  this.items;

        }
        else if(query && this.service.filterQuery =="Sector"){
            arrFilter = _.filter(array, row=> (row.sector &&  
            row.sector.toLowerCase().indexOf(query.toLowerCase()))> -1);
            this.loopArray(arrFilter.filter(f => f.sector !=null));
            this.service.filterRecords =  this.items;

        }
        else if(query && this.service.filterQuery =="CSI"){
            arrFilter = _.filter(array, row=> (row.CSI && 
                row.CSI.toLowerCase().indexOf(query.toLowerCase()))> -1);
            this.loopArray(arrFilter.filter(f => f.CSI !=null));
            this.service.filterRecords =  this.items;

        }
        else if(query && this.service.filterQuery =="Data"){
            arrFilter = _.filter(array, row=> (row.dataClasif &&  
            row.dataClasif.toLowerCase().indexOf(query.toLowerCase()))> -1);
            this.loopArray(arrFilter.filter(f => f.dataClasif !=null));
            this.service.filterRecords =  this.items;

        }
        else if(query && this.service.filterQuery =="TypeofReq"){
            arrFilter = _.filter(array, row=> (row.TypeOfRequest &&  
            row.TypeOfRequest.toLowerCase().indexOf(query.toLowerCase()))> -1);
            this.loopArray(arrFilter.filter(f => f.TypeOfRequest !=null));
            this.service.filterRecords =  this.items;

        }
        else if(query && this.service.filterQuery =="TypeofServ"){
            arrFilter = _.filter(array, row=> (row.TypeOfService &&  
            row.TypeOfService.toLowerCase().indexOf(query.toLowerCase()))> -1);
            this.loopArray(arrFilter.filter(f => f.TypeOfService !=null));
            this.service.filterRecords =  this.items;

        }
        else if(query && this.service.filterQuery =="ID"){
            this.service.filterRecords = _.filter(array, row=> (row.id && 
                row.id.toString().toLowerCase().indexOf(query.toLowerCase())) > -1);

            
        }
        else
            this.service.filterRecords = arrDataFilter;
        
         

        return this.service.filterRecords;
    }
}