
export const setCPTAction = (props , cptCodes , fieldName="SETCPT" ) => {
    return {
        type: "SETCPT",
        allProps:props,
        payload: cptCodes,
        fieldName : fieldName,
    };

};