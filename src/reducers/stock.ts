

import { createSlice } from '@reduxjs/toolkit';

// import { ThunkActionType } from '../store/store';
// import AccountService from '../services/account';

const stockSlice = createSlice({
    name: 'stock',
    initialState: {},
    reducers: {},
});

// export const {} = accountSlice.actions;

export default stockSlice.reducer;

// export const postAuthToken = (): ThunkActionType => async () => {
//     const data = {
//         password: "Miamikki521",
//         username: "aminhp93"
//     }
//     const res = await AccountService.postAuthToken(data)
//     return res
// }

