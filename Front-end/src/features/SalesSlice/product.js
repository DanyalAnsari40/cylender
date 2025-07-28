import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: [
    { name: 'Cooking Gas Cylinder', sellingPrice: 57.75, category: 'cylinder' },
    { name: 'Industrial Gas Tank', sellingPrice: 75.00, category: 'cylinder' },
    { name: 'Natural Gas', sellingPrice: 45.00, category: 'gas' },
    { name: 'LPG Gas', sellingPrice: 52.50, category: 'gas' }
  ]
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {}
});

export default productsSlice.reducer;
