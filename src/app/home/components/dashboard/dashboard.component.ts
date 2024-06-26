import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import * as moment from 'moment';
import { Constant } from 'src/app/models/Constant';
import { DashboardV2ConfigDataList } from 'src/app/models/DashboardV2ConfigDataList';
import { DashboardV3ConfigDataList } from 'src/app/models/DashboardV3ConfigDataList';
import { DatabaseHelper } from 'src/app/models/DatabaseHelper';
import { Route } from 'src/app/models/Route';
import { DashboardService } from 'src/app/services/dashboard-service';
import { DataService } from 'src/app/services/data.service';
import { HeaderSubscriptionService } from 'src/app/services/header-subscription.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private _router: Router,
    private dashboardService: DashboardService,
    private dataService: DataService,
    private router: Router,
    private headerSubscriptionService: HeaderSubscriptionService) {

    if(!this.Constant.EMPTY_STRINGS.includes(localStorage.getItem(this.Constant.USER_NAME))){
      this.userName = String(localStorage.getItem(this.Constant.USER_NAME));
    }

    this.subscribeHeader = this.headerSubscriptionService.headerVisibilityChange.subscribe(async (value) => {
      debugger
      if(router.url == Route.HOME_DASHBOARD_ROUTE){
        this.getTotoalProvidersCountV2('License Lookup', 'V2');
        this.getTotoalProvidersCountV3('License Lookup', 'V3');
        this.getConfigDataV2('License Lookup');
        this.getConfigDataV3('License Lookup');
      }
    });

   }

  subscribeHeader:any;
  readonly Constant = Constant;
  userName:string='Logged In';

  ngOnInit(): void {
    this.getTotoalProvidersCountV2('License Lookup', 'V2');
    this.getTotoalProvidersCountV3('License Lookup', 'V3');
    this.getConfigDataV2('License Lookup');
    this.getConfigDataV3('License Lookup');
  }

  logOut() {
    localStorage.clear();
    this._router.navigate(['/auth/login']);
  }

  dashboardTotalCountsV2 : DashboardV2ConfigDataList = new DashboardV2ConfigDataList();
  dashboardTotalCountsV3 : DashboardV3ConfigDataList = new DashboardV3ConfigDataList();

  v2TotalCountsLoadingToggle:boolean = false;
  v3TotalCountsLoadingToggle:boolean = false;
  getTotoalProvidersCountV2(type:string, version:string){
    this.v2TotalCountsLoadingToggle = true;
    this.dashboardService.getTotoalProvidersCount(type, version, this.dataService.startDate, this.dataService.endDate).subscribe(response=>{
      if(response != null){
        this.dashboardTotalCountsV2 = response;
      }
      this.v2TotalCountsLoadingToggle = false;
    },error=>{
      this.v2TotalCountsLoadingToggle = false;
    })
  }

  getTotoalProvidersCountV3(type:string, version:string){
    this.v3TotalCountsLoadingToggle = true;
    this.dashboardService.getTotoalProvidersCount(type, version, this.dataService.startDate, this.dataService.endDate).subscribe(response=>{
      if(response != null){
        this.dashboardTotalCountsV3 = response;
      }
      this.v3TotalCountsLoadingToggle = false;
    },error=>{
      this.v3TotalCountsLoadingToggle = false;
    })
  }


  dashboardV2ConfigDataList : DashboardV2ConfigDataList[] = new Array();
  dashboardV3ConfigDataList : DashboardV3ConfigDataList[] = new Array();
  dashboardCountDataV2 : number =0;
  dashboardCountDataV3 : number =0;
  v2ConfigLoadingToggle:boolean = false;
  v3ConfigLoadingToggle:boolean = false;
  databaseHelper:DatabaseHelper = new DatabaseHelper();
  v2configType:string='';
  v3configType:string='';
  getConfigDataV2(type:string){
    debugger
    this.v2ConfigLoadingToggle = true;
    this.v2configType = type;
    this.dashboardService.getConfigDataByLogs(type, 'V2', this.V2DatabaseHelper.currentPage, this.V2DatabaseHelper.itemsPerPage, this.dataService.startDate, this.dataService.endDate).subscribe(response=>{
      if(response.status){
        this.dashboardV2ConfigDataList = response.object;
        this.dashboardCountDataV2 = response.totalItems;
      }
      this.v2ConfigLoadingToggle = false;
    },error=>{
      this.v2ConfigLoadingToggle = false;
    })
  }

  getConfigDataV3(type:string){
    debugger
    this.v3ConfigLoadingToggle = true;
    this.v3configType = type;
    this.dashboardService.getConfigDataByLogs(type, 'V3', this.v3DatabaseHelper.currentPage, this.v3DatabaseHelper.itemsPerPage, this.dataService.startDate, this.dataService.endDate).subscribe(response=>{
      if(response.status){
        this.dashboardV3ConfigDataList = response.object;
        this.dashboardCountDataV3 = response.totalItems;
      }
      this.v3ConfigLoadingToggle = false;
    },error=>{
      this.v3ConfigLoadingToggle = false;
    })
  }

  V2DatabaseHelper:DatabaseHelper = new DatabaseHelper();
  pageChanged(event:any){
    debugger
    if(event != undefined){
      this.V2DatabaseHelper.currentPage = event;
      this.getConfigDataV2(this.v2configType);
    }
  }

  v3DatabaseHelper:DatabaseHelper = new DatabaseHelper();
  pageChangedforV3(event:any){
    debugger
    if(event != undefined){
      this.v3DatabaseHelper.currentPage = event;
      this.getConfigDataV3(this.v3configType);
    }
  }

  routeToReport(version:string, reportType:string){
    let navigationExtras : NavigationExtras = {
      queryParams : { 'version' : version},
    }
    if(reportType == 'failedReport'){
      this._router.navigate([Route.FAILED_CONFIG_REPORT], navigationExtras);
    } else if(reportType == 'noConfigReport'){
      this._router.navigate([Route.NO_CONFIG_FOUND_REPORT], navigationExtras);
    }
  }


}
