// Creating user account
export const SIGNUP_USER_ACCOUNT = (userData) => {
    return {
        type: "SIGNUP_USER_ACCOUNT",
        payload: userData
    }
}

// Remove data using id
// export const DLT = (id) => {
//     return {
//         type: "RMV_CART",
//         payload: id
//     }
// }

// Remove cart userData
// export const REMOVE = (userData) => {
//     return {
//         type: "RMV_ONE",
//         payload: userData
//     }
// }