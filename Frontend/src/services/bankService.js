import * as request from '~/utils/httpRequest';

export const getBankList = (bankId) => {
    try {
        const res = request.get(`/bank/get/${bankId}`);
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

export const storeQuestions = (bankId, data) => {
    try {
        const res = request.post(`/bank/storeQuestions/${bankId}`, data);
        return res;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export const deleteQuestions = (questionId) => {
    try {
        const res = request.del(`/bank/removeQuestion/${questionId}`);
        return res;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export const deleteBank = (bankId) => {
    try {
        const res = request.del(`/bank/delete/${bankId}`);
        return res;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export const addNewBank = (data) => {
    try {
        const res = request.post(`/bank/store`, data);
        return res;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export const updateBankName = (bankId, bankName) => {
    try {
        const res = request.post(`/bank/updateBankName/${bankId}`, { bankName });
        return res;
    } catch (error) {
        console.log(error);
        return false;
    }
}