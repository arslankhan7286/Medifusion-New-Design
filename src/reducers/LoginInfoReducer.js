export default function (state = null, action) {
    switch (action.type) {
           case "USER_INFO":
            return action.payload;       
                break;
    }
    return state;
}