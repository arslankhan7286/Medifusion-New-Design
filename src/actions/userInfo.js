
export const userInfo = (userInfo , fieldName="ALL") => {
    return {
        type: "USER_INFO",
        payload: userInfo,
        fieldName : fieldName
    };

};