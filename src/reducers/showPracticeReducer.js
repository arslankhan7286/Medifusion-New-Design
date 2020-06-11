export default function (state = null, action) {
    switch (action.type) {
        case 'SHOW_PRACTICE':
            return action.payload;
            break;
    }
    return state;
}


