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

// thang
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
        const res = request.post(`/exam/store`, {
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

export const createQuestionManually = ({
    questions,
    examId
}) => {
    try {
        const res = request.post(`/exam/storeQuestions/${examId}`, questions);
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