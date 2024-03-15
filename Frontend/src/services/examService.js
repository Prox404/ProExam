import * as request from '~/utils/httpRequest';

export const isValidKeyCode = (keyCode) => {
    try {
        const res = request.get(`/exam/isValidKeyCode?keyCode=${keyCode}`);
        return res;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export const takeExam = (examCode, {
    userName,
    userEmail,
}) => {
    try {
        const res = request.post(`/exam/takeExam/${examCode}`, {
            userName,
            userEmail,
        });
        return res;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export const getExam = (examCode) => {
    try {
        const res = request.get(`/exam/get?keyCode=${examCode}`);
        return res;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export const chooseAnwser = (examResultId, {questionId, answerIds}) => {
    try {
        const res = request.post(`/exam/chooseAnwser/${examResultId}`, {
            questionId : questionId,
            selectedAnswerIds: answerIds
        });
        return res;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export const submitExam = (examResultId) => {
    try {
        const res = request.get(`/exam/submitExam/${examResultId}`);
        return res;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export const cheatingDetection = ({
    cheatingCode,
    examResultId
}) => {
    try {
        const res = request.post(`/cheating/detected`, {
            cheatingCode,
            examResultId
        });
        return res;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export const getExamResult = (examResultId) => {
    try {
        const res = request.get(`/exam/getExamResult/${examResultId}`);
        return res;
    } catch (error) {
        console.log(error);
        return false;
    }
}


export const createExam = ({
    examName,
    duration,
    examStartTime,
    examEndTime,
    numberSubmit,
    keyCode,
    userId
}) => {
    try {
        const res = request.post(`/exam/store`,{
            examName,
            duration,
            examStartTime,
            examEndTime,
            numberSubmit,
            keyCode,
            user: {
                userId
            }
        });
        return res;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export const upLoadQuestion = (id, data) => {
    try {
        const res = request.post(`/exam/uploadQuestions/${id}`, data);
        return res;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export const getExamById = (id) => {
    try {
        const res = request.get(`/exam/get/${id}`);
        return res;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export const createQuestionManually = ({
    questions,
    examId
}) => {
    try {
        const res = request.post(`/exam/storeQuestions/${examId}`,questions);
        return res;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export const getQuestionList = (id) => {
    try {
        const res = request.get(`/exam/getQuestions/${id}`);
        return res;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export const getExamList = (user_id) => {
    try {
        const res = request.get(`/exam/getExamList/${user_id}`);
        return res;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export const getExamDetail = (exam_id) => {
    try {
        const res = request.get(`/exam/getExamDetail/${exam_id}`);
        return res;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export const getAverageScore = (exam_id) => {
    try {
        const res = request.get(`/exam/getAverageScoreByExamId/${exam_id}`);
        return res;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export const getQuestion = ({
    idExam
}) => {
    try {
        const res = request.get(`/exam/getQuestion?examId=${idExam}`);
        return res;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export const getExams = (
    userId
) => {
    try {
        console.log(userId);
        const res = request.get(`/exam/exams/${userId}`);
        return res;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export const getQuestions = (
    examId
) => {
    try {
        const res = request.get(`/exam/questions/${examId}`);
        return res;
    } catch (error) {
        console.log(error);
        return false;
    }
}
export const removeExam = (
    examId
) => {
    try {
        const res = request.del(`/exam/removeExam/${examId}`);
        return res;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export const getExamAndTime = ({
    idExam
}) => {
    try {
        const res = request.get(`/exam/getExamAndTime?examId=${idExam}`);
        return res;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export const update = (data) => {
    try {
        const res = request.post(`/exam/update`, data);
        return res;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export const deleteAnwser = (answerId) => {
    try {
        const res = request.del(`/exam/removeAnswer/${answerId}`);
        return res;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export const setPrivacy = ({examId, isPublic}) => {
    try {
        const res = request.get(`/exam/publicExam?examId=${examId}&isPublic=${isPublic}`);
        return res;
    } catch (error) {
        console.log(error);
        return false;
    }
}