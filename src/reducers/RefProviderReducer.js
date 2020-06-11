export default function (state = null, action) {
    switch (action.type) {
        case "REF_PROVIDER_ACTION":
            var preState = {...action.allProps};
            preState.userInfo1.userRefProviders = action.payload;
            return preState       
             break;
 }
 return state;
}