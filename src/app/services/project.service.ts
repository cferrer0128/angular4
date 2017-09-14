import {Project} from '../models/project';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import {Http, Response, Headers} from '@angular/http';
import {Injectable} from '@angular/core';


@Injectable()
export class ProjectService {

    private spApiUrl: string;
    private userIdUrl: string;
    public Id: string;

    private _flights: any;
    private sQuery: any;
    private LIST_URL = window["localURL"] + "/_api/web/lists/getByTitle('CARTProjects')/items";
    constructor(private http: Http) {
        console.log('http on services started..');
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
        let digest = '';
        if ( document.getElementById('__REQUESTDIGEST')) {
            digest = document.getElementById('__REQUESTDIGEST').innerHTML;
        }

            headers.set('Accept', 'application/json;odata=verbose');
            headers.set('X-RequestDigest', digest);

            switch (verb) {
            case 'POST':
                headers.set('Content-type', 'application/json;odata=verbose');
                break;
            case 'PUT':
                headers.set('Content-type', 'application/json;odata=verbose');
                headers.set('IF-MATCH', '*');
                headers.set('X-HTTP-Method', 'MERGE');
                break;
            case 'DELETE':
                headers.set('IF-MATCH', '*');
                headers.set('X-HTTP-Method', 'DELETE');
                break;
        }

        return headers;
     }

     getProjects(Id: string , nextUrl: string) {
        let results = [];
         if (Id === undefined) {
            this.sQuery =  this.LIST_URL + '?$top=600&$orderby=ID desc';
            if (nextUrl)  { this.sQuery = nextUrl; }
            this._flights = this.http.get(this.sQuery, { headers: this.setHeaders('') })
                .map((res: Response) => {
                    results = res.json().d.results;
                     console.log('results ' + res.json());
                    if (res.json().d.__next) {
                        results.push({next: res.json().d.__next});
                    }
                    return results;
                });
        }
        return this._flights;
     }

}
