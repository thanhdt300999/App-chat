import { call, put, select, takeEvery } from 'redux-saga/effects';
import homeServices from './service';
import actions from './action';



export function* watchLogin (){
    yield takeLatest("USER_LOGIN_REQUESR", handleUserLogin)
}
function* handleUserLogin () {
    yield call (userLoginRequest)
}

