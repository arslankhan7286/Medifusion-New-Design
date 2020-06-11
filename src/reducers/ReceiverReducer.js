export default function  (state=[] , action ) {
    switch(action.type){
        case "SET_RECEIVER":
        return action.payload
        break
    }
    return state
}