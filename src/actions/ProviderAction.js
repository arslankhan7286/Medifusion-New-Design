export const ProviderAction = (props , providers , fieldName="PROVIDER_ACTION" ) => {
    return {
        type: "PROVIDER_ACTION",
        allProps:props,
        payload: providers,
        fieldName : fieldName,
    };

};