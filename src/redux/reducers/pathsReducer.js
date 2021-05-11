import { SET_PATHS, ADD_PATH, REMOVE_PATH, UPDATE_PATH } from '../actions';

const pathsReducer = (state = [], action) => {
    switch (action.type) {
        case SET_PATHS:
            return action.payload.paths;
        case ADD_PATH:
            return [...state, action.payload.path];
        case REMOVE_PATH:
            return state.filter((path) => path.id !== action.payload.id);
        case UPDATE_PATH:
            return state.map((path) => {
                if (path.id === action.payload.path.id) {
                    return action.payload.path;
                } else {
                    return path;
                }
            });
        default:
            return state;
    }
};

export default pathsReducer;