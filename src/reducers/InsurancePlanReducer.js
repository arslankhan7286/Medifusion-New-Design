export default function (state = null, action) {
    switch (action.type) {
        case "SET_INSURANCE_PLANS":
            // var preState = {...action.allProps};
            // preState.userInfo1.insrancePlans = action.payload;
            // return preState   
            return action.payload    
             break;
 }
 return state;
}