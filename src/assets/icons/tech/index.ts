import angular from './angular.svg'
import angularJs from './angularjs.svg'
import antDesign from './ant-design.svg'
import azureDevops from './azure-azure-devops.svg'
import css3 from './css3.svg'
import docker from './docker.svg'
import effector from './effector.svg'
import featureSlicedDesign from './feature-sliced-design.svg'
import gitlab from './gitlab.svg'
import graphql from './graphql.svg'
import html5 from './html5.svg'
import javascript from './javascript.svg'
import moduleFederation from './module-federation.svg'
import ngrx from './ngrx.svg'
import pinia from './pinia.svg'
import react from './react.svg'
import rxjs from './rxjs.svg'
import sass from './sass.svg'
import storybook from './storybook.svg'
import tailwindcss from './tailwindcss.svg'
import tanstack from './tanstack.svg'
import typescript from './typescript.svg'
import vitejs from './vitejs.svg'
import vitest from './vitest.svg'
import vue from './vue.svg'
import webpack from './webpack.svg'
import msSharePoint from './microsoft-sharepoint.svg'
import webSocket from './websocket.svg'
import piniaColada from './pinia-colada.svg'
import primeVue from './primevue.svg'
import shadcn from './shadcn-ui.svg'
import zod from './zod.svg'
import msw from './MSW.svg'
import rest from './rest.svg'
import flutter from './flutter.svg'
import dart from './dart.svg'

export type TechIcon = string | readonly string[]

export const techTagIcons: Record<string, TechIcon> = {
  Vue: vue,
  'Vue 3': vue,
  'Vue 3.5': vue,
  'Vue Router': vue,
  React: react,
  Angular: angular,
  AngularJS: angularJs,
  'Angular 11': angular,
  'Ant Design': antDesign,
  TypeScript: typescript,
  JavaScript: javascript,
  Pinia: pinia,
  'Pinia Colada': piniaColada,
  NgRx: ngrx,
  RxJS: rxjs,
  TanStack: tanstack,
  'TanStack Query': tanstack,
  'TanStack Router': tanstack,
  'TanStack Vue Form': tanstack,
  HTML: html5,
  CSS: css3,
  SCSS: sass,
  Tailwind: tailwindcss,
  'Tailwind CSS': tailwindcss,
  'Tailwind 4': tailwindcss,
  REST: rest,
  GraphQL: graphql,
  Vite: vitejs,
  Webpack: webpack,
  Vitest: vitest,
  Storybook: storybook,
  Docker: docker,
  Effector: effector,
  FSD: featureSlicedDesign,
  'Feature-Sliced Design': featureSlicedDesign,
  'Module Federation': moduleFederation,
  'Module Federation 2.0': moduleFederation,
  'GitLab CI': gitlab,
  'GitLab CI/CD': gitlab,
  'Azure DevOps': azureDevops,
  SharePoint: msSharePoint,
  WebSocket: webSocket,
  PrimeVue: primeVue,
  'shadcn-vue': shadcn,
  Zod: zod,
  MSW: msw,
  Flutter: flutter,
  Dart: dart,
}
