import { configureStore } from "@reduxjs/toolkit";
import { baseApiSlice } from "../features/api/baseApi";

const store = configureStore( {
    reducer: {
        [baseApiSlice.reducerPath]: baseApiSlice.reducer,
    },
    middleware: (gDM) => gDM().concat(baseApiSlice.middleware),
})

export default store;