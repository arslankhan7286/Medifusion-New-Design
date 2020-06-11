
export const setICDAction = (props , icdCodes , fieldName="SETICD" , loaded = false) => {
    return {
        type: "SETICD",
        allProps:props,
        payload: icdCodes,
        fieldName : fieldName,
        loaded:loaded
    };

};