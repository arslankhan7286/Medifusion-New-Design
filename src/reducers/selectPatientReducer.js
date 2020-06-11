export default function (state = null, action) {
    switch (action.type) {
        case "SELECT_PATIENT":
            return action.payload;
            break;
    }
    return state;
}