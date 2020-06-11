export const ModifierAction = (props , modifiers , fieldName="MODIFIER_ACTION" ) => {
    return {
        type: "MODIFIER_ACTION",
        allProps:props,
        payload: modifiers,
        fieldName : fieldName,
    };

};