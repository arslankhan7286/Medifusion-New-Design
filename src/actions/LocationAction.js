export const locationAction = (props , location , fieldName="LOCATION_ACTION" ) => {
    return {
        type: "LOCATION_ACTION",
        allProps:props,
        payload: location,
        fieldName : fieldName,
    };

};