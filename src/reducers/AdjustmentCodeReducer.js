export default function (state=[] , action){
    switch(action.type){
        case "SET_ADJUSTMENT_CODE":
            return action.payload
    }
    return state;
}