import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ApiServices {

    apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    getPlaces(limit: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/cities?limit=${limit}`);
    }
}