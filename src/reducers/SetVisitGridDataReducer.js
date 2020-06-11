export default function (state = null, action) {

    switch (action.type) {
           case "VISIT_GRID_DATA":
               return action.payload       
                break;
    }
    return state;
}