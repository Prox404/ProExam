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