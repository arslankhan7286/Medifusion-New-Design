export const POSAction = (props , posCodes , fieldName="SETPOS") => {

    return {
        type: "SETPOS",
        allProps:props,
        payload: posCodes,
        fieldName : fieldName,
    };
};