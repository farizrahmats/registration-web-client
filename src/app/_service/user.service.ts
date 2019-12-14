import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface UserModel {
  id: Number,
  first_name: String,
  last_name: String,
  contact_no: String,
  email: String,
  gender: String,
  date_of_birth: String,
  password: String
}

const API_URL: string = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})

export class UserService {
  
	constructor(private http: HttpClient) { }

  getHTTPHeaders(): HttpHeaders {
		let result = new HttpHeaders();
    result.set('Content-Type', 'application/json');
    result.set('Accept', 'application/json');

    result.set('Access-Control-Allow-Origin', '*');
    result.set('Access-Control-Allow-Credentials', 'true');
		return result;
  } 
  
  create(data: UserModel): Observable<UserModel> {
		const httpHeaders = this.getHTTPHeaders();
		return this.http.post<UserModel>(API_URL + '/register', data, { headers: httpHeaders, withCredentials: true });
	}
}

