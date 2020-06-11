export default function (state = null, action) {
    switch (action.type) {
        case "RE_SCHEDULE_APPT_ID":
            return action.payload;
            break;
    }
    return state;
}