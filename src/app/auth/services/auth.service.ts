import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { Usuario, AuthResponse } from '../interfaces/interfaces';
import { of, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl:string = environment.baseUrl;
  private _usuario!: Usuario;

  get usuario() {
    return {...this._usuario}
  }

  constructor( private http:HttpClient ) { }

  registro( name:string, email:string, password:string ) {
    const url = `${this.baseUrl}/auth/new`;
    const body = {name, email, password};

    return this.http.post<AuthResponse>(url, body)
      .pipe(
        tap(resp => { // asgina el valor a _usuario antes de hacer el map
          if(resp.ok) {
            localStorage.setItem('token', resp.token!);
            // this._usuario = {
            //   name: resp.name!,
            //   uid: resp.uid!
            // }
          }
        }),
        map( resp => resp.ok ),
        catchError( err => of(err.error.msg) ) // transfoma a observable
      )

  }

  login( email:string, password:string ) {

    const url = `${this.baseUrl}/auth`;
    const body = {email, password};

    return this.http.post<AuthResponse>(url, body)
      .pipe(
        tap(resp => { // asgina el valor a _usuario antes de hacer el map
          if(resp.ok) {
            localStorage.setItem('token', resp.token!);
            // this._usuario = {
            //   name: resp.name!,
            //   uid: resp.uid!
            // }
          }
        }),
        map( resp => resp.ok ),
        catchError( err => of(err.error.msg) ) // transfoma a observable
      )
  }

  validarToken():Observable<boolean> {

    const url = `${this.baseUrl}/auth/renew`;
    const headers = new HttpHeaders()
      .set('x-token', localStorage.getItem('token') || '');

    return this.http.get<AuthResponse>(url, {headers})
      .pipe(
        map( resp => {
          localStorage.setItem('token', resp.token!);
            this._usuario = {
              name: resp.name!,
              uid: resp.uid!,
              email: resp.email!
            }

          return resp.ok
        }),
        catchError( err => of(false) )
      )

  }

  logout() {
    localStorage.clear();
  }


}
