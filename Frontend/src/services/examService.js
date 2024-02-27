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
export const createExam = ({
    examName,
    examStartTime,
    examEndTime,
    numberSubmit,
    keyCode,
    userId
}) => {
    try {
        const res = request.post(`/exam/store`,{
            examName,
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