import config from '~/config';

// Layouts
import { BlankLayout } from '~/layouts';
import DefaultLayout from '~/layouts';
// Pages
import Home from '~/pages/Home';
import TakeExam from '~/pages/TakeExam';
import NotFound from '~/pages/NotFound';
import SetTime from '~/pages/SetTime';


// Public routes
const publicRoutes = [
    { path: config.routes.home, component: Home },
    { path: config.routes.takeExam, component: TakeExam, layout: BlankLayout},
    {path: config.routes.setTime, component: SetTime},
    { path: '*', component: NotFound, layout: BlankLayout },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes }