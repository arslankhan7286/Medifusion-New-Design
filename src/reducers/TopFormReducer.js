export default function(state = null, action) {
  switch (action.type) {
    case "TOP_FORM":
      return action.payload;
      break;
  }
  return state;
}
