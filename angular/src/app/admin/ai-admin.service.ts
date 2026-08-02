import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { API_BASE } from '../core/config/api.config';

export type AiContentKind = 'MENU_DESCRIPTION' | 'MARQUEE' | 'PROMO';

export interface AiContentResponse {
  text: string;
}

export interface AiInsightsResponse {
  analyzedComments: number;
  summary: string;
  strengths: string[];
  improvements: string[];
}

/** Un dato que el negocio le enseña al asistente. */
export interface KnowledgeDto {
  id: number;
  topic: string;
  answer: string;
  orderIndex: number;
  active: boolean;
}

export type KnowledgePayload = Omit<KnowledgeDto, 'id'>;

/**
 * Asistentes de IA del panel: redacción de copys y lectura de opiniones.
 * Las rutas cuelgan de `/api/admin`, así que el interceptor adjunta el JWT.
 */
@Injectable({ providedIn: 'root' })
export class AiAdminService {
  private readonly http = inject(HttpClient);
  private readonly base = `${API_BASE}/admin/ai`;

  generateContent(kind: AiContentKind, brief: string): Observable<AiContentResponse> {
    return this.http
      .post<AiContentResponse>(`${this.base}/content`, { kind, brief })
      .pipe(catchError(toFriendlyError));
  }

  insights(): Observable<AiInsightsResponse> {
    return this.http.get<AiInsightsResponse>(`${this.base}/insights`).pipe(catchError(toFriendlyError));
  }

  // ---- Base de conocimiento ------------------------------------------
  knowledgeList(): Observable<KnowledgeDto[]> {
    return this.http.get<KnowledgeDto[]>(`${this.base}/knowledge`);
  }
  knowledgeCreate(payload: KnowledgePayload): Observable<KnowledgeDto> {
    return this.http.post<KnowledgeDto>(`${this.base}/knowledge`, payload);
  }
  knowledgeUpdate(id: number, payload: KnowledgePayload): Observable<KnowledgeDto> {
    return this.http.put<KnowledgeDto>(`${this.base}/knowledge/${id}`, payload);
  }
  knowledgeDelete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/knowledge/${id}`);
  }
}

function toFriendlyError(error: HttpErrorResponse): Observable<never> {
  const fromApi = typeof error.error?.message === 'string' ? error.error.message : null;
  return throwError(
    () => new Error(fromApi ?? 'La IA no está disponible. Revisa que el motor esté encendido.'),
  );
}
