import config from '~/config';

// Layouts
import { BlankLayout, ExamLayout, DashboardLayout } from '~/layouts';

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
import Discover from '~/pages/Discover';
import Library from '~/pages/Library';
import DetailedReport from '~/pages/DetailedReport';
import ExamList from '~/pages/ExamList';
import ExamDetail from '~/pages/ExamDetail';

// Public routes
const publicRoutes = [
    { path: config.routes.home, component: Home },
    { path: config.routes.takeExam, component: TakeExam, layout: ExamLayout },
    { path: '*', component: NotFound, layout: BlankLayout },
    { path: config.routes.startedExam, component: StartedExam, layout: ExamLayout },
    { path: config.routes.examResult, component: ViewScoreExam, layout: BlankLayout },
    { path: config.routes.homeCreateExam,component: Discover, layout: DashboardLayout},
    { path: config.routes.report, component: Report, layout: DashboardLayout },
    { path: config.routes.createExam, component: SetTime, layout: DashboardLayout},
    { path: config.routes.uploadQuestion, component: UploadExam },
    { path: config.routes.addQuestion, component: ParseQuestions },
    { path: config.routes.discovery, component: Discover, layout: DashboardLayout },
    { path: config.routes.reportDetail, component: DetailedReport, layout: DashboardLayout },
    { path: config.routes.library, component: ExamList, layout: DashboardLayout },
    { path: config.routes.examDetail, component: ExamDetail, layout: DashboardLayout },

];

const privateRoutes = [];

export { publicRoutes, privateRoutes }