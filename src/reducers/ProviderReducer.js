export default function (state = null, action) {
    switch (action.type) {
        case "PROVIDER_ACTION":
            var preState = {...action.allProps};
            preState.userInfo1.userProviders = action.payload;
            return preState       
             break;
 }
 return state;
}