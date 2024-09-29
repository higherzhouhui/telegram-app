import { createSlice } from '@reduxjs/toolkit'


function getUserInfo() {
    let obj = {}
    try {
        const _userInfo = localStorage.getItem('useInfo')
        if (_userInfo) {
            obj = JSON.parse(_userInfo)
        }
    } catch {

    }
    return obj
}


function getHMInfo() {
    let obj = {}
    try {
        const _hmstrInfo = localStorage.getItem('hmstrInfo')
        if (_hmstrInfo) {
            obj = JSON.parse(_hmstrInfo)
        }
    } catch {

    }
    return obj
}

function getSystemCOnfig() {
    let obj = {}
    try {
        const _hmstrInfo = localStorage.getItem('systemInfo')
        if (_hmstrInfo) {
            obj = JSON.parse(_hmstrInfo)
        }
    } catch {

    }
    return obj
}

const userSlice = createSlice({
    name: 'user',
    initialState: {
        info: getUserInfo(),
        hmstr: getHMInfo(),
        system: getSystemCOnfig()
    },
    reducers: {
        setUserInfoAction(state, action) {
            state.info = { ...state.info, ...action.payload }
            localStorage.setItem('userInfo', JSON.stringify(state.info))
        },
        setHMAction(state, action) {
            state.eth = action.payload
            localStorage.setItem('hmstrInfo', JSON.stringify(state.eth))
        },
        setSystemAction(state, action) {
            state.system = action.payload
            localStorage.setItem('systemInfo', JSON.stringify(state.system))

        }
    }
})

export const { setUserInfoAction, setHMAction, setSystemAction } = userSlice.actions

export default userSlice.reducer

