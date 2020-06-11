import { statement, statements } from "@babel/template";

export const loginAction = (token, login = false) => {
    return {
        type: "LOGIN_ACTION",
        payload: {
            token: token,
            isLogin: login,
            url: 'hey'
        }
    };
};






