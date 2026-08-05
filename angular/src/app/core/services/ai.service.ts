import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { API_BASE } from '../config/api.config';

export interface AiTurn {
  role: 'user' | 'assistant';
  content: string;
}

export interface AiChatResponse {
  reply: string;
}

export interface AiSuggestion {
  itemId: number;
  title: string;
  badge: string;
  imageUrl: string;
  reason: string;
}

/** Adicional sugerido para completar el pedido. */
export interface AiExtra {
  id: number;
  name: string;
  priceLabel: string;
  reason: string;
}

/** Sede sugerida. La elige el servidor desde la BD, no el modelo. */
export interface AiVenue {
  name: string;
  address: string;
  mapEmbedUrl: string;
}

export interface AiRecommendResponse {
  intro: string;
  suggestions: AiSuggestion[];
  extras: AiExtra[];
  venue: AiVenue | null;
}

interface AiStatusResponse {
  enabled: boolean;
  model: string;
}

export interface AiPromptSuggestion {
  id: number;
  kind: string;
  promptText: string;
  orderIndex: number;
  active: boolean;
}

/**
 * Cliente de las funciones de IA públicas.
 *
 * El modelo corre en el backend (Ollama self-hosted), así que aquí no hay
 * claves ni llamadas a terceros. {@link enabled} permite ocultar la UI cuando
 * el entorno no tiene motor de IA configurado.
 */
@Injectable({ providedIn: 'root' })
export class AiService {
  private readonly http = inject(HttpClient);

  private readonly _enabled = signal(false);
  readonly enabled = this._enabled.asReadonly();

  constructor() {
    this.http.get<AiStatusResponse>(`${API_BASE}/ai/status`).subscribe({
      next: (status) => this._enabled.set(status.enabled),
      error: () => this._enabled.set(false),
    });
  }

  getPromptSuggestions(kind: string): Observable<AiPromptSuggestion[]> {
    return this.http.get<AiPromptSuggestion[]>(`${API_BASE}/ai/suggestions?kind=${kind}`);
  }

  chat(messages: AiTurn[]): Observable<AiChatResponse> {
    return this.http
      .post<AiChatResponse>(`${API_BASE}/ai/chat`, { messages })
      .pipe(catchError(toFriendlyError));
  }

  recommend(craving: string): Observable<AiRecommendResponse> {
    return this.http
      .post<AiRecommendResponse>(`${API_BASE}/ai/recommend`, { craving })
      .pipe(catchError(toFriendlyError));
  }
}

/** Convierte el error HTTP en un mensaje que se puede mostrar tal cual. */
function toFriendlyError(error: HttpErrorResponse): Observable<never> {
  const fromApi = typeof error.error?.message === 'string' ? error.error.message : null;
  const message =
    fromApi ??
    (error.status === 429
      ? 'Vas muy rápido. Espera un momento y vuelve a intentarlo.'
      : 'El asistente no está disponible ahora mismo. Inténtalo en unos segundos.');
  return throwError(() => new Error(message));
}
