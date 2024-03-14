import * as request from '~/utils/httpRequest';

export const numberCorrect = (examId) => {
    try {
        const res = request.get(`/history/numbercorrect/${examId}`);
        return res;
    } catch (error) {
        console.log(error);
        return false;
    }
}