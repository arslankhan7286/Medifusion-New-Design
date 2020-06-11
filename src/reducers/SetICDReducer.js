export default function (state = null, action) {

    switch (action.type) {
           case "SETICD":
               var preState = {...action.allProps};
               preState.userInfo1.icd = action.payload;
               return preState       
                break;
    }
    return state;
}