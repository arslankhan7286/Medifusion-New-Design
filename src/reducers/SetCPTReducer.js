export default function (state = null, action) {

    switch (action.type) {
           case "SETCPT":
               var preState = {...action.allProps};
               preState.userInfo1.cpt = action.payload;
               return preState       
                break;
    }
    return state;
}