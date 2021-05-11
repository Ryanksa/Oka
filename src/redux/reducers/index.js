import { combineReducers } from 'redux';
import userReducer from './userReducer';
import itemsReducer from './itemsReducer';
import pathsReducer from './pathsReducer';

const rootReducer = combineReducers({
    user: userReducer,
    items: itemsReducer,
    paths: pathsReducer
});

export default rootReducer;