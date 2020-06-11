export default function (state = null, action) {
    switch (action.type) {
        case "SETDATE":
           
               return action.payload       
                break;
    }
    return state;
}