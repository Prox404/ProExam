import config from '~/config';

// Layouts
import { BlankLayout } from '~/layouts';

// Pages
import Home from '~/pages/Home';
import Report from '~/pages/Report';
import TakeExam from '~/pages/TakeExam';
import NotFound from '~/pages/NotFound';
import HomeCreateExam from "~/pages/HomeCreateExam/HomeCreateExam";

// Public routes
const publicRoutes = [
    { path: config.routes.takeExam, component: TakeExam, layout: BlankLayout },
    { path: config.routes.report, component: Report, layout: Report },
    { path: '*', component: NotFound, layout: BlankLayout },
    { path: config.routes.homeCreateExam,component:HomeCreateExam},
    { path: config.routes.home, component:Home},
];

const privateRoutes = [];

export { publicRoutes, privateRoutes }