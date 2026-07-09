import { Routes } from '@angular/router';
import { AboutPage } from './pages/about/about-page';
import { ArticlePage } from './pages/article/article-page';
import { ArticlesPage } from './pages/articles/articles-page';
import { HomePage } from './pages/home/home-page';

export const routes: Routes = [
  { path: '', component: HomePage, title: 'Vladimir Huarachi Copa' },
  { path: 'articulos', component: ArticlesPage, title: 'Artículos | Vladimir Huarachi Copa' },
  { path: 'articulos/:slug', component: ArticlePage },
  { path: 'sobre-el-autor', component: AboutPage, title: 'Sobre el autor | Vladimir Huarachi Copa' },
  { path: '**', redirectTo: '' },
];
