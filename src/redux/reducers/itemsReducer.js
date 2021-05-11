import { SET_ITEMS, ADD_ITEM, REMOVE_ITEM, UPDATE_ITEM } from '../actions';

const itemsReducer = (state = [], action) => {
    switch (action.type) {
        case SET_ITEMS:
            return action.payload.items;
        case ADD_ITEM:
            return [...state, action.payload.item];
        case REMOVE_ITEM:
            return state.filter((item) => item.id !== action.payload.id);
        case UPDATE_ITEM:
            return state.map((item) => {
                if (item.id === action.payload.item.id) {
                    return action.payload.item;
                } else {
                    return item;
                }
            });
        default:
            return state;
    }
};

export default itemsReducer;