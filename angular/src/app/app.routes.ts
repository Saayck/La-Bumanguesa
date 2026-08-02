import { Routes } from '@angular/router';
import { authGuard } from './admin/auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home').then((m) => m.Home),
  },
  {
    path: 'admin/login',
    loadComponent: () => import('./admin/pages/login/login').then((m) => m.Login),
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./admin/pages/layout/admin-layout').then((m) => m.AdminLayout),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./admin/pages/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'menu',
        loadComponent: () =>
          import('./admin/pages/menu/menu-admin').then((m) => m.MenuAdmin),
      },
      {
        path: 'videos',
        loadComponent: () =>
          import('./admin/pages/videos/videos-admin').then((m) => m.VideosAdmin),
      },
      {
        path: 'locations',
        loadComponent: () =>
          import('./admin/pages/locations/locations-admin').then((m) => m.LocationsAdmin),
      },
      {
        path: 'hero',
        loadComponent: () =>
          import('./admin/pages/hero/hero-admin').then((m) => m.HeroAdmin),
      },
      {
        path: 'ai',
        loadComponent: () =>
          import('./admin/pages/ai-knowledge/ai-knowledge-admin').then(
            (m) => m.AiKnowledgeAdmin,
          ),
      },
      {
        path: 'site',
        loadComponent: () =>
          import('./admin/pages/site-config/site-config-admin').then(
            (m) => m.SiteConfigAdmin,
          ),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
