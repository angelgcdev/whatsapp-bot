import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  BotResponse,
  CreateBotResponseDto,
  UpdateBotResponseDto,
} from '../models/bot-response.model';

@Injectable({
  providedIn: 'root',
})
export class BotResponsesService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/bot-responses';

  getAll(): Observable<BotResponse[]> {
    return this.http.get<BotResponse[]>(this.apiUrl);
  }

  getById(id: number): Observable<BotResponse> {
    return this.http.get<BotResponse>(`${this.apiUrl}/${id}`);
  }

  create(dto: CreateBotResponseDto): Observable<BotResponse> {
    return this.http.post<BotResponse>(this.apiUrl, dto);
  }

  update(id: number, dto: UpdateBotResponseDto): Observable<BotResponse> {
    return this.http.patch<BotResponse>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: number): Observable<BotResponse> {
    return this.http.delete<BotResponse>(`${this.apiUrl}/${id}`);
  }
}
