import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { CommentRequest } from 'src/app/models/CommentRequest';
import { Constant } from 'src/app/models/Constant';
import { DatabaseHelper } from 'src/app/models/DatabaseHelper';
import { FailedConfigDTO } from 'src/app/models/FailedConfigDTO';
import { ProviderRequestCrawlerLog } from 'src/app/models/ProviderRequestCrawlerLog';
import { Route } from 'src/app/models/Route';
import { ReportService } from 'src/app/services/report.service';

@Component({
  selector: 'app-failed-config-report',
  templateUrl: './failed-config-report.component.html',
  styleUrls: ['./failed-config-report.component.css']
})
export class FailedConfigReportComponent implements OnInit {

  readonly Route = Route;
  readonly Constant = Constant;



  dropdownSettingsVersion!: { singleSelection: boolean; text: string; enableSearchFilter: boolean; autoPosition: boolean, badgeShowLimit: number; };
  versionList: any[] = [{id:'V2', itemName:'V2'}, {id:'V3', itemName:'V3'}];
  selectedVersion: any[] = new Array();

  providerSearch = new Subject<string>();
  constructor(private reportService : ReportService,
    private router : Router,
    private activatedRoute: ActivatedRoute) { 
    
      if (this.activatedRoute.snapshot.queryParamMap.has('version')) {
        this.routeVersion = this.activatedRoute.snapshot.queryParamMap.get('version');
      }

      if(this.activatedRoute.snapshot.queryParamMap.has('d1') && this.activatedRoute.snapshot.queryParamMap.has('d2')) {
        this.startDate = this.activatedRoute.snapshot.queryParamMap.get('d1');
        this.endDate = this.activatedRoute.snapshot.queryParamMap.get('d2')
        this.selected = {startDate:moment(this.startDate), endDate:moment(this.endDate)};
        this.dashboardDateFilterToggle = true;
      } else {
        this.selected = {startDate:moment().subtract(30, 'days'), endDate: moment()};
      }
      
      this.providerSearch.pipe(
      debounceTime(600))
      .subscribe(value => {
        this.databaseHelper.currentPage = 1;
        this.getFailedConfigs(this.configType, 0);
      });
    }

    dashboardDateFilterToggle:boolean = false;
  ngOnInit(): void {
    this.dropdownSettingsVersion = {
      singleSelection: true,
      text: 'Select Version',
      enableSearchFilter: false,
      autoPosition: false,
      badgeShowLimit: 1
    };
  }

  reRunSucessful:number =0;
  reRunFailed:number =0;
  reRunPending:number =0;
  getFailedConfigsCount(){
    this.reportService.getFailedConfigsCount(this.startDate, this.endDate, this.version).subscribe(response=>{
      if(response != null){
        this.reRunSucessful = response.reRunSucessful;
        this.reRunFailed = response.reRunFailed;
        this.reRunPending = response.reRunPending;
      }
    },error=>{

    })
  }

  versionFilterToggle:boolean = false;
  filterByVersion(){
    this.versionFilterToggle = !this.versionFilterToggle;
  }
  routeVersion:any;
  version:string=''
  selectVersion(event:any){
    debugger
    this.version = '';
    if(event != undefined && event.length > 0){
      this.version = event[0].id;
    }
    this.getFailedConfigs(this.configType, 1);
    this.getFailedConfigsCount();
    this.versionFilterToggle = false
  }
  
  // selected : { startDate: moment.Moment, endDate: moment.Moment } = {startDate:moment().subtract(30, 'days'), endDate: moment()};
  selected : any;
  startDate: any = null;
  endDate: any = null;
  selectDateFilter(event: any) {
    debugger
    if (this.selected != undefined && this.selected != null && this.selected.startDate != undefined && this.selected.endDate != undefined && this.selected != null) {
      this.startDate = new Date(this.selected.startDate.toDate()).toDateString();
      this.endDate = new Date(this.selected.endDate.toDate()).toDateString(); 
    } else {
      this.selected = {startDate:moment().subtract(30, 'days'), endDate: moment()};
      return;
    }

    if(this.routeVersion != null){
      this.versionFilterToggle = true;
      this.version = this.routeVersion;
      var temp : {id:any, itemName: any} = {id: this.routeVersion, itemName : this.routeVersion};
      this.selectedVersion.push(temp);
      
    }
    this.getFailedConfigs(this.configType, 0);
    this.getFailedConfigsCount();
  }
  configType:string ='';
  configLoadingToggle:boolean = false;
  databaseHelper: DatabaseHelper = new DatabaseHelper();
  failedConfigList : FailedConfigDTO[] = new Array();
  totalConfigsCount:number=0;
  getFailedConfigs(configType:string, isPageChanged:number){
    this.configLoadingToggle = true;
    if(this.configType == configType && isPageChanged != 1){
      this.configType = '';
    } else {
      this.configType = configType;
    }
    this.reportService.getFailedConfigs(this.startDate, this.endDate, this.databaseHelper, this.configType, this.version).subscribe(response=>{
      if(response != null){
        this.failedConfigList = response.list;
        this.totalConfigsCount = response.totalItems;
      }
      this.configLoadingToggle = false;
    },error=>{
      this.configLoadingToggle = false;
    })
  }

  pageChanged(event:any){
    this.databaseHelper.currentPage = event;
    this.getFailedConfigs(this.configType, 1);
  }

  routeToConfiguration(lookupName: string, lookupLink:string){
    this.reportService.getConfigId(lookupName, lookupLink).subscribe(response=>{
      if(response != null){
        let navigateExtra : NavigationExtras = {
          queryParams : {"id" : response},
        };
        this.router.navigate([this.Route.HOME_CONFIGURATION_ROUTE], navigateExtra)
      }
    },error=>{

    })
  }


  @ViewChild('closeSnapshotModalButton') closeSnapshotModalButton !: ElementRef;
  closeSnapshotModal(){
    this.closeSnapshotModalButton.nativeElement.click();
  }

  @ViewChild('openSnapshotModalButton') openSnapshotModalButton !: ElementRef;
  imageUrl:string='';
  imageLoadingToggle:boolean = false;
  viewSnapshot(url:string){
    debugger
    this.imageLoadingToggle = true;
    this.imageUrl = url;
    this.openSnapshotModalButton.nativeElement.click();
    setTimeout(()=>{
      this.imageLoadingToggle = false;
    },1000)
  }

  @ViewChild('completeModalButton') completeModalButton !: ElementRef;
  comment:string='';
  openCommentModal(obj:FailedConfigDTO){
    this.comment = '';
    this.commentRequest.configLink = obj.configLink;
    this.commentRequest.configName = obj.configName;
    this.commentRequest.logId = obj.id;
    this.completeModalButton.nativeElement.click();
  }
  
  @ViewChild('closeCommentModalButton') closeCommentModalButton !: ElementRef;
  closeCommentModal(){
    this.closeCommentModalButton.nativeElement.click();
  }

  commentRequest:CommentRequest = new CommentRequest();
  commentSavingToggle:boolean = false;
  currentTime: any = moment().format('Do MMM YYYY, h:mm a');
  createConfigComment(){
    debugger
    this.commentSavingToggle = true;
    this.commentRequest.comment = this.comment;
    this.reportService.createConfigComment(this.commentRequest).subscribe(response=>{
      if(response){
        this.closeCommentModal();
      }
      this.commentSavingToggle = false;
    },error=>{
      this.commentSavingToggle = false;
    })
  }


  logRerunToggle:boolean = false;
  reRunProviderLog(logId:number, index:number){
    this.logRerunToggle = true;
    this.failedConfigList[index].reTestingToggle = true;
    this.reportService.reRunProviderLog(logId).subscribe(response=>{
      if(response){
        this.getFailedConfigs(this.configType, 0); 
      }
      this.logRerunToggle = false;
      this.failedConfigList[index].reTestingToggle = false;
    },error=>{
      this.failedConfigList[index].reTestingToggle = false;
      this.logRerunToggle = false;
    })
  }

}
