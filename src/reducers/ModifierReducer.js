export default function (state = null, action) {
    switch (action.type) {
        case "MODIFIER_ACTION":
            var preState = {...action.allProps};
            preState.userInfo1.modifier = action.payload;
            return preState       
             break;
 }
 return state;
}