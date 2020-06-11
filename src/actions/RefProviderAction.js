export const RefProviderAction = (props , refProviders , fieldName="REF_PROVIDER_ACTION" ) => {
    return {
        type: "REF_PROVIDER_ACTION",
        allProps:props,
        payload: refProviders,
        fieldName : fieldName,
    };

};