import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Keys } from '../models/key';

@Injectable({
  providedIn: 'root'
})
export class DashboardService{

  key: Keys = new Keys();
  constructor(private http: HttpClient) { }

  getTotoalProvidersData(configType:string, version:string):Observable<any>{
    const params = new HttpParams()
    .set('configType', configType)
    .set('version', version)
    return this.http.get<any>(this.key.server_url + this.key.api_version_one + this.key.dashboard, {params});
  }

  getConfigDataByLogs(configType:string, version:string,currentPage:number, itemsPerPage:number):Observable<any>{
    const params = new HttpParams()
    .set('configType', configType)
    .set('version', version)
    .set('currentPage', currentPage)
    .set('itemsPerPage', itemsPerPage)
    return this.http.get<any>(this.key.server_url + this.key.api_version_one + this.key.dashboard + '/config-data', {params});
  }
}
