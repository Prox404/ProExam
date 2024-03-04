import config from '~/config';

// Layouts
import { BlankLayout, ExamLayout } from '~/layouts';

// Pages
import Home from '~/pages/Home';
import Report from '~/pages/Report';
import TakeExam from '~/pages/TakeExam';
import NotFound from '~/pages/NotFound';
import HomeCreateExam from "~/pages/HomeCreateExam/HomeCreateExam";
import StartedExam from '~/pages/StartedExam';


// Public routes
const publicRoutes = [
    { path: config.routes.home, component: Home },
    { path: config.routes.takeExam, component: TakeExam, layout: ExamLayout },
    { path: '*', component: NotFound, layout: BlankLayout },
    { path: config.routes.startedExam, component: StartedExam, layout: ExamLayout },
    { path: config.routes.homeCreateExam,component:HomeCreateExam},
    { path: config.routes.report, component: Report, layout: Report },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes }