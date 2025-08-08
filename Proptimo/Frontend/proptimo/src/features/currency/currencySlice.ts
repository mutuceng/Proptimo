
import { createSlice} from "@reduxjs/toolkit";


interface CurrencyState {
    currencies : [];
    loading: boolean;
    error: string | null;
}

const initialState : CurrencyState = {
    currencies: [],
    loading: false,
    error: null,
}

export const currencySlice = createSlice( {
    name: "currency",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
    }
})

export default currencySlice.reducer;
