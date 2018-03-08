import { LogService } from './../../core/logging/log.service';
import { Version } from './version';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';
import 'rxjs/add/observable/of';

import { environment } from './../../../environments/environment';
import { Organisation } from './organisation';
import { Workspace } from './workspace';


@Injectable()
export class OrganisationService {
  private urlApiOrganisation: string = environment.apiDataworkBench + '/iati-publishers';
  private urlApiWorkspaces: string = environment.apiBaseUrl + '/workspaces';
  private urlApiVersions: string = environment.apiBaseUrl + '/versions';

  constructor(private http: HttpClient,
              private logger: LogService) { }
              // ttp://dev1.dataworkbench.io/api/iati-publishers/findOne?filter[where][slug]=cordaid
  getOrganisation(name: string): Observable<Organisation> {
    const url: string = this.urlApiOrganisation + '/findOne?filter[where][slug]=' + name;
    this.log(url);
    return this.http.get<Organisation>(url).pipe(
      tap(_ => this.log(`fetched organisation id=${name}`)),
      catchError(this.handleError<Organisation>(`getOrganisation id=${name}`))
    );
  }

getWorkspaces(organisation: string): Observable<Array<Workspace>> {
  const url: string = this.urlApiWorkspaces + '?organisation_id=' + organisation;
  this.log(url);
  return this.http.get<Workspace[]>(url)
  .pipe(
    tap(_ => this.log(`fetched workspaces`)),
    catchError(this.handleError('getWorkspaces', []))
  );
}

getWorkspace(id: string): Observable<Workspace> {
  const url: string = this.urlApiWorkspaces + '/' + id;
  this.log(url);
  return this.http.get<Workspace>(url)
  .pipe(
    tap(_ => this.log(`fetched workspaces`)),
    catchError(this.handleError('getWorkspaces', undefined))
  );
}

getVersions(workspaceid: string): Observable<Array<Version>> {
  const url: string = this.urlApiVersions + '?workspace_id=' + workspaceid;
  this.log(url);
  return this.http.get<Version[]>(url)
  .pipe(
    tap(_ => this.log(`fetched versions`)),
    catchError(this.handleError('getVersions', []))
  );
}

getVersion(versionid: string): Observable<Version> {
  const url: string = this.urlApiVersions + '?slug=' + versionid;
  this.log(url);
  return this.http.get<Version>(url)
  .pipe(
    tap(_ => this.log(`fetched version`)),
    catchError(this.handleError('getVersion', undefined ))
  );
}

getEmptyWorkspace(): Workspace {
  const ws: Workspace = {
    id: '',
    description: '',
    organisation_id: '',
    organisation_name: '',
    slug: '',
    title: ''
  };

  return ws;
}

private log(message: string) {
  if (!environment.production) {
    this.logger.debug(message);
  }
}

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging
      this.logger.error(error);
      // console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      // this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }


}