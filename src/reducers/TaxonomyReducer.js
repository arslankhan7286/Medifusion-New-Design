export default function (state = null, action) {

    switch (action.type) {
           case "TAXONOMYCODES":
               var preState = {...action.allProps};
               preState.userInfo1.taxonomy = action.payload;
               return preState       
                break;
    }
    return state;
}