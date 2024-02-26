import config from '~/config';

// Layouts
import DefaultLayout from '~/layouts';
import { BlankLayout, ExamLayout } from '~/layouts';

// Pages
import Home from '~/pages/Home';
import TakeExam from '~/pages/TakeExam';
import NotFound from '~/pages/NotFound';
import SetTime from '~/pages/SetTime';
import StartedExam from '~/pages/StartedExam';



// Public routes
const publicRoutes = [
    { path: config.routes.home, component: Home },
    {path: config.routes.setTime, component: SetTime},
    { path: config.routes.takeExam, component: TakeExam, layout: ExamLayout },
    { path: '*', component: NotFound, layout: BlankLayout },
    { path: config.routes.startedExam, component: StartedExam, layout: ExamLayout },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes }