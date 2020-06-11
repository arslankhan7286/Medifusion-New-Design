const initialState = {
  moreItems: false,
};
const MoreAlertReducer = (state = initialState, action) => {
  switch (action.type) {
    case "showMoreItems":
      return {
        moreItems: true,
      };
  }
  return state;
};
export default MoreAlertReducer;
