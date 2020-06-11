export const ICDAction = (props , icdCodes , fieldName="SETICD"  ) => {

    console.log("ICD COdes Action : " ,icdCodes);
    console.log("ICd All Props Action : " ,props)
    return {
        type: "SETICD",
        allProps:props,
        payload: icdCodes,
        fieldName : fieldName,
    };

};