import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Player} from '../models/player/player.module';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  private apiUrl = 'http://127.0.0.1:8000/players';

  constructor(private http: HttpClient) {}


  getPlayers(): Observable<Player[]> {
    return this.http.get<Player[]>(this.apiUrl);
  }


  getPlayerById(id: number): Observable<Player> {
    return this.http.get<Player>(`${this.apiUrl}/${id}`);
  }


  addPlayer(player: Player): Observable<Player> {
    return this.http.post<Player>(this.apiUrl, player, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }


  updatePlayer(id: number, player: Player): Observable<Player> {
    return this.http.put<Player>(`${this.apiUrl}/${id}`, player);
  }



  deletePlayer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }


  importPlayers(file: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/import`, file);
  }
}
