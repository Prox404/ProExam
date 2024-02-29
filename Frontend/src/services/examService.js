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
export const getExam = ({
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

export const getTime = ({
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