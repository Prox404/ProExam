import config from '~/config';

// Layouts
import { BlankLayout } from '~/layouts';

// Pages
import Home from '~/pages/Home';
import TakeExam from '~/pages/TakeExam';
import NotFound from '~/pages/NotFound';
import UpLoadExam from '~/pages/UploadExam';
import CodeExam from '~/pages/CodeExam';


// Public routes
const publicRoutes = [
    { path: config.routes.home, component: Home },
    { path: config.routes.uploadExam, component: UpLoadExam },
    { path: config.routes.codeExam, component: CodeExam },
    { path: config.routes.takeExam, component: TakeExam, layout: BlankLayout },
    { path: '*', component: NotFound, layout: BlankLayout },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes }