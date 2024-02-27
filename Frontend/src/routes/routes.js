import config from "~/config";

// Layouts

import DefaultLayout from "~/layouts";
import { BlankLayout, ExamLayout } from "~/layouts";

// Pages
import Home from "~/pages/Home";
import TakeExam from "~/pages/TakeExam";
import NotFound from "~/pages/NotFound";
import UpLoadExam from "~/pages/UploadExam";
import CodeExam from "~/pages/CodeExam";
import SetTime from "~/pages/SetTime";
import StartedExam from "~/pages/StartedExam";
import ParseQuestions from "~/pages/ParseQuestions";

// Public routes
const publicRoutes = [
  { path: config.routes.home, component: Home },
  { path: config.routes.uploadExam, component: UpLoadExam },
  { path: config.routes.codeExam, component: CodeExam },
  { path: config.routes.takeExam, component: TakeExam, layout: BlankLayout },
  { path: config.routes.setTime, component: SetTime },
  { path: config.routes.takeExam, component: TakeExam, layout: ExamLayout },
  { path: "*", component: NotFound, layout: BlankLayout },
  {
    path: config.routes.startedExam,
    component: StartedExam,
    layout: ExamLayout,
  },
  {
    path: config.routes.parseQuestions,
    component: ParseQuestions,
  },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
