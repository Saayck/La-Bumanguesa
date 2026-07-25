/**
 * Base URL of the backend REST API (relative).
 * - En Docker/producción: nginx hace proxy de `/api` al contenedor de la API.
 * - En desarrollo (`pnpm start`): el dev-server usa `proxy.conf.json` para
 *   redirigir `/api` a http://localhost:8080.
 */
export const API_BASE = '/api';
