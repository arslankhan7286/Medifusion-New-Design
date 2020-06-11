export default function (state = null, action) {

    switch (action.type) {
           case "PAYMENT_GRID_DATA":
               return action.payload       
                break;
    }
    return state;
}