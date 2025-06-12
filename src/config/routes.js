import HomePage from '@/components/pages/HomePage';
import DashboardPage from '@/components/pages/DashboardPage';
import PlantsPage from '@/components/pages/PlantsPage';
import CalendarPage from '@/components/pages/CalendarPage';
import DiagnosePage from '@/components/pages/DiagnosePage';
import JournalPage from '@/components/pages/JournalPage';
import PlantDetailPage from '@/components/pages/PlantDetailPage';
import AddPlantPage from '@/components/pages/AddPlantPage';
import NotFoundPage from '@/components/pages/NotFoundPage';

export const routes = {
  home: {
    id: 'home',
    label: 'Home',
    path: '/',
    icon: 'Home',
component: HomePage,
    hideInNav: true
  },
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'LayoutDashboard',
    component: DashboardPage
  },
  plants: {
    id: 'plants',
    label: 'My Plants',
    path: '/plants',
    icon: 'Leaf',
    component: PlantsPage
  },
  calendar: {
    id: 'calendar',
    label: 'Calendar',
    path: '/calendar',
    icon: 'Calendar',
    component: CalendarPage
  },
  diagnose: {
    id: 'diagnose',
    label: 'Diagnose',
    path: '/diagnose',
    icon: 'Search',
    component: DiagnosePage
  },
  journal: {
    id: 'journal',
    label: 'Journal',
    path: '/journal',
    icon: 'BookOpen',
    component: JournalPage
  },
  plantDetail: {
    id: 'plantDetail',
    label: 'Plant Detail',
    path: '/plants/:id',
    component: PlantDetailPage,
    hideInNav: true
  },
  addPlant: {
    id: 'addPlant',
    label: 'Add Plant',
    path: '/add-plant',
    component: AddPlantPage,
    hideInNav: true
  },
addPlant: {
    id: 'addPlant',
    label: 'Add Plant',
    path: '/add-plant',
    component: AddPlantPage,
    hideInNav: true
  },
  notFound: {
    id: 'notFound',
    label: 'Not Found',
    path: '*',
    component: NotFoundPage,
    hideInNav: true
  }
};

export const routeArray = Object.values(routes);
export const navigationRoutes = routeArray.filter(route => !route.hideInNav);