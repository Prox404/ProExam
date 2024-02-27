import * as request from '~/utils/httpRequest';

export const login = ({
    email,
    password
}) => {
    try {
        const res = request.post('/auth/login', {
            userEmail: email,
            userPassword: password
        });
        return res;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export const register = ({
    email,
    password,
    userName 
}) => {
    try {
        const res = request.post('/auth/register', {
            userEmail: email,
            userPassword: password,
            userName: userName
        });
        return res;
    } catch (error) {
        console.log(error);
        return false;
    }
}