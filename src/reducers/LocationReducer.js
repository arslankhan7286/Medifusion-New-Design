export default function (state = null, action) {
    switch (action.type) {
        case "LOCATION_ACTION":
            var preState = {...action.allProps};
            preState.userInfo1.userLocations = action.payload;
            return preState       
             break;
 }
 return state;
}