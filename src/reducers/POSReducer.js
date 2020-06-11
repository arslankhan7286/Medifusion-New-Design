export default function (state = null, action) {
    switch (action.type) {
        case "SETPOS":
            var preState = {...action.allProps};
            preState.userInfo1.pos = action.payload;
            return preState       
             break;
 }
 return state;
}