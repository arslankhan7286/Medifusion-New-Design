export const setDate = (date,otherDates) => {

    return {
        type: 'SETDATE',
        payload: {
            date: date,
            otherDates: otherDates
        }
    }
};