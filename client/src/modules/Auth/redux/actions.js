const userLoginRequest = (data) => {
    return {
        type: authContants.USER_LOGIN_REQUEST,
        payload: data
    }
}

const userLoginSuccess = (data) => {
    return {
        type: authContants.USER_LOGIN_SUCCESS,
        payload: data
    }
}

const userloginFailure = (error) => {
    return {
        type: authContants.USER_LOGIN_FAILURE,
        error: error
    }
}