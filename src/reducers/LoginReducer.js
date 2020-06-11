export default function (state = null, action) {
    switch (action.type) {
        case "LOGIN_ACTION":
            return action.payload;
            break;
    }
    return state;
}