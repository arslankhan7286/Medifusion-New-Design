export const topForm = (topForm, fieldName = "ALL") => {
  return {
    type: "TOP_FORM",
    payload: topForm,
    fieldName: fieldName,
  };
};
