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
import ViewScoreExam from '~/pages/ViewScoreExam';
import SetTime from '~/pages/SetTime';
import UploadExam from '~/pages/UploadExam';
import ParseQuestions from '~/pages/ParseQuestions';

// Public routes
const publicRoutes = [
    { path: config.routes.home, component: Home },
    { path: config.routes.takeExam, component: TakeExam, layout: ExamLayout },
    { path: '*', component: NotFound, layout: BlankLayout },
    { path: config.routes.startedExam, component: StartedExam, layout: ExamLayout },
    { path: config.routes.examResult, component: ViewScoreExam, layout: BlankLayout },
    { path: config.routes.homeCreateExam,component:HomeCreateExam},
    { path: config.routes.report, component: Report, layout: Report },
    { path: config.routes.createExam, component: SetTime },
    { path: config.routes.uploadQuestion, component: UploadExam },
    { path: config.routes.addQuestion, component: ParseQuestions },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes }