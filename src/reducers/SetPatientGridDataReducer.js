export default function (state = null, action) {

    switch (action.type) {
           case "PATIENT_GRID_DATA":
               return action.payload       
                break;
    }
    return state;
}