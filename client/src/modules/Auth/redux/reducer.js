import { authContants } from "./contants";

const initState = [];

const authReducer = (state = initState, action) => {
    switch (action.type) {
        case authContants.USER_LOGIN_REQUEST:
            return {
                ...state,
                isLoading: true
            }
            case authContants.USER_LOGIN_SUCCESS:
            return {
                ...state,
                isLoading: false,
                user: action.payload
            }
            case authContants.USER_LOGIN_FAILURE:
            return {
                ...state,
                isLoading: true
            }
        default:
            break;
    }
}

export default authReducer