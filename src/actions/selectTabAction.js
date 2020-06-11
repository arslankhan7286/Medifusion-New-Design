import { statement, statements } from "@babel/template";

// export const selectTabAction = (selectedTab) => {
//     return {
//         type: 'TAB_SELECTED',
//         payload: selectedTab
//     }
// };


export const selectTabAction = (selectedTab, id = 0) => {
    return {
        type: "TAB_SELECTED",
        payload: {
            selectedTab: selectedTab,
            id: id,
            url: 'hey'
        }
    };
};

export const selectTabPageAction = (selectedTab) => {
    //alert('selectTabpage: ' + selectedTab)
    return {
        type: selectedTab,
        payload: selectedTab
    }
};




