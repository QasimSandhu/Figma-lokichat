const INIT_STATE = {
    SignUP_User_Data: []
};

export const cartreducer = (state = INIT_STATE, action) => {
    switch (action.type) {
        case 'SIGNUP_USER_ACCOUNT':
            // Set SignUP User data data on store, state.SignUP_User (previous data), action.payload (new data)
            return {
                ...state,
                SignUP_User_data: [...state.SignUP_User_Data, action.payload]
            }
        default:
            return state;
    }
}