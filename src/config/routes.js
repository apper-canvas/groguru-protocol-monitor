import Home from '../pages/Home';
import Dashboard from '../pages/Dashboard';
import Plants from '../pages/Plants';
import Calendar from '../pages/Calendar';
import Diagnose from '../pages/Diagnose';
import Journal from '../pages/Journal';
import PlantDetail from '../pages/PlantDetail';
import AddPlant from '../pages/AddPlant';
import NotFound from '../pages/NotFound';

export const routes = {
  home: {
    id: 'home',
    label: 'Home',
    path: '/',
    icon: 'Home',
    component: Home,
    hideInNav: true
  },
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'LayoutDashboard',
    component: Dashboard
  },
  plants: {
    id: 'plants',
    label: 'My Plants',
    path: '/plants',
    icon: 'Leaf',
    component: Plants
  },
  calendar: {
    id: 'calendar',
    label: 'Calendar',
    path: '/calendar',
    icon: 'Calendar',
    component: Calendar
  },
  diagnose: {
    id: 'diagnose',
    label: 'Diagnose',
    path: '/diagnose',
    icon: 'Search',
    component: Diagnose
  },
  journal: {
    id: 'journal',
    label: 'Journal',
    path: '/journal',
    icon: 'BookOpen',
    component: Journal
  },
  plantDetail: {
    id: 'plantDetail',
    label: 'Plant Detail',
    path: '/plants/:id',
    component: PlantDetail,
    hideInNav: true
  },
  addPlant: {
    id: 'addPlant',
    label: 'Add Plant',
    path: '/add-plant',
    component: AddPlant,
    hideInNav: true
  }
};

export const routeArray = Object.values(routes);
export const navigationRoutes = routeArray.filter(route => !route.hideInNav);