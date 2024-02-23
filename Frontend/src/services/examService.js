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