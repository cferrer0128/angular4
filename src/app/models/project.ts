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

    
    constructor(name: string, status: string, reviewer: string,
        requester: string, initDT:  string, id: number , golive: string,
        reqCreated: string ) {

        this.id = id;
        this.name = name;
        this.status = status;
        this.reviewer = reviewer;
        this.nameurl =  window["localURL"] + '/CARTProjects/' + name + '.xml?openin=browser';
        this.requester = requester;
        this.initDT = initDT;

    if (id !== undefined) {

            if (initDT)  {

                this.initiated = new Date(initDT);

                this.initDT = (this.initiated.getMonth() + 1) + '/' + this.initiated.getDate() + '/' + this.initiated.getFullYear();

            }
            if (golive) {
                    this.goLive = new Date(golive);

                    this.goLiveST = (this.goLive.getMonth() + 1) + '/' + this.goLive.getDate() + '/' + this.goLive.getFullYear();
            }
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


    public static fromJson(json: any) {
        return new Project(json.Project_x0020_Name, json.Request_x0020_Status,
        json.Reviewer_x0020_Name, json.Requester_x0020_Name,
        json.Process_x0020_Initiation_x0020_Date, json.ID,
        json.Go_x0020_Live_x0020_Date, json.Created);
    }

    public static fromJsonList(json: any) {
        const  list = [];
        for (let i = 0; i < json.length; i++) {
            list.push(Project.fromJson(json[i]));
        }
        return list;
    }
}
