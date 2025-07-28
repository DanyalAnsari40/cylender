import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Thunk to fetch all returned stock
export const fetchReturnedStock = createAsyncThunk(
  'returnedStock/fetchReturnedStock',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://localhost:5000/api/employees/returned-stock');
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Thunk to return stock from employee
export const returnStockFromEmployee = createAsyncThunk(
  'returnedStock/returnStockFromEmployee',
  async (stockData, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:5000/api/employees/return-stock', stockData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const returnedStockSlice = createSlice({
  name: 'returnedStock',
  initialState: {
    data: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReturnedStock.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchReturnedStock.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchReturnedStock.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(returnStockFromEmployee.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(returnStockFromEmployee.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // The returned stock data will be refreshed by calling fetchReturnedStock again
      })
      .addCase(returnStockFromEmployee.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const selectReturnedStock = (state) => state.returnedStock.data;

export default returnedStockSlice.reducer;
