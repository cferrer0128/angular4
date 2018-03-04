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


    transform(array: any[], query: string): any {

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
                for(var i=0;i <arrFilter.length;i++){
                    var item = arrFilter[i];
                    if(item.status != null){
                         this.items.push(item);
                    }
 
                }
                this.service.filterRecords =  this.items;
            
        }
        else if(query && this.service.filterQuery =="Requester"){
                arrFilter = _.filter(array, row=> (row.requester && 
                row.requester.toLowerCase().indexOf(query.toLowerCase()))> -1);

                for(var i=0;i <arrFilter.length;i++){
                    var item = arrFilter[i];
                    if(item.requester != null){
                        this.items.push(item);
                    }
 
                }
                this.service.filterRecords =  this.items;
            
        }
            else if(query && this.service.filterQuery =="Reviewer"){
                arrFilter = _.filter(array, row=> (row.reviewer &&  
                row.reviewer.toLowerCase().indexOf(query.toLowerCase()))> -1);

               for(var i=0;i <arrFilter.length;i++){
                   var item = arrFilter[i];
                   if(item.reviewer != null){
                        this.items.push(item);
                   }

               }//end for
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