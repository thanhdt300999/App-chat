import { combineReducers } from 'redux'
import authReducer from '../modules/Auth/redux/reducer'
export const rootReducer = combineReducers({
    auth: authReducer
});
