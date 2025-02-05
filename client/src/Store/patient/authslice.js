import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const VITE_API_URL = import.meta.env.VITE_API_URL;

// 1️⃣ Upload Profile Picture
export const uploadProfilePic = createAsyncThunk(
  "patient/uploadProfilePic",
  async (image, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("image", image);
      const response = await axios.post(`${VITE_API_URL}/uploads`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data.url;
    } catch (error) {
      return rejectWithValue("Failed to upload image");
    }
  }
);

// 2️⃣ Check if Email Exists
export const checkEmailExists = createAsyncThunk(
  "patient/checkEmailExists",
  async (email, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${VITE_API_URL}/auth/check-email`, { email });
      return response.data.exists;
    } catch (error) {
      return rejectWithValue("Failed to check email");
    }
  }
);

// 3️⃣ Submit Patient Signup
export const PatientSignup = createAsyncThunk(
  "patient/submitSignup",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${VITE_API_URL}/auth/patient-signup`, formData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue("Signup failed. Try again.");
    }
  }
);


export const loginUser = createAsyncThunk(
  "patient/login",
  async (values, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${VITE_API_URL}/auth/login`, values, {
        withCredentials: true,
      });
      if (!response.data.success) {
        return rejectWithValue(response.data.message);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "An unexpected error occurred."
      );
    }
  }
);


export const fetchUserData = createAsyncThunk("auth/fetchUserData", async () => {
  try {
    const response = await axios.post(`${VITE_API_URL}/auth/getdata`, {}, { withCredentials: true });
    return response.data.userData;
  } catch (error) {
    console.log("error is  : ", error)
    return rejectWithValue(error.response.data);
  }
});

export const fetchUserList=createAsyncThunk("/auth/fetchUserList",async()=>{
  try {
    const response=await axios.post(`${VITE_API_URL}/auth/fetchuserlist`,{},{withCredentials:true})
    return response.data.userlist
  } catch (error) {
    console.log("error is : ",error)
  }
})

const patientAuthSlice = createSlice({
  name: "patientAuth",
  initialState: {
    loading: false,
    error: null,
    profilePicUrl: null,
    patientData: null,
    signupSuccess: false,
  },
  reducers: {},

  extraReducers: (builder) => {
    builder
      // Upload Profile Picture
      .addCase(uploadProfilePic.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadProfilePic.fulfilled, (state, action) => {
        state.loading = false;
        state.profilePicUrl = action.payload;
      })
      .addCase(uploadProfilePic.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Check Email Exists
      .addCase(checkEmailExists.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkEmailExists.fulfilled, (state, action) => {
        state.loading = false;
        state.emailExists = action.payload;
      })
      .addCase(checkEmailExists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Submit Signup
      .addCase(PatientSignup.pending, (state) => {
        state.loading = true;
      })
      .addCase(PatientSignup.fulfilled, (state, action) => {
        state.loading = false;
        state.signupSuccess = true;
      })
      .addCase(PatientSignup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.patientData=action.payload.user
        state.loginSuccess = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUserData.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.loading = false;
        state.patientData=action.payload
      })
  },
});

export default patientAuthSlice.reducer;
