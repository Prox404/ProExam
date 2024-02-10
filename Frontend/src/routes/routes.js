import config from '~/config';
import { lazy } from 'react';

// Layouts
import { BlankLayout } from '~/layouts';

// Pages
const Home = lazy(() => import('~/pages/Home'));
const TakeExam = lazy(() => import('~/pages/TakeExam'));

// Public routes
const publicRoutes = [
    { path: config.routes.home, component: Home },
    { path: config.routes.takeExam, component: TakeExam, layout: BlankLayout },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes }