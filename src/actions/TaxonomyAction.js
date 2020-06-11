
export const taxonomyCodeAction = (props , taxonomyCodes , fieldName="TAXONOMYCODES" , loaded = false) => {
    return {
        type: "TAXONOMYCODES",
        allProps:props,
        payload: taxonomyCodes,
        fieldName : fieldName,
        loaded:loaded
    };

};