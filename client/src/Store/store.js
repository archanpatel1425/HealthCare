import { configureStore } from "@reduxjs/toolkit";
import patientReducer from "./slices/patientSlice";

const store = configureStore({
  reducer: {
    patient: patientReducer,  // Register the patient reducer
  },
});

export default store;
