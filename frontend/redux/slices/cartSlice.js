import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cartService } from '@/services';

export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { rejectWithValue }) => {
  try {
    const { data } = await cartService.get();
    return data.cart;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const addToCart = createAsyncThunk('cart/addToCart', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await cartService.add(payload);
    return data.cart;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const updateCartItem = createAsyncThunk('cart/updateCartItem', async ({ id, quantity }, { rejectWithValue }) => {
  try {
    const { data } = await cartService.update(id, { quantity });
    return data.cart;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const removeFromCart = createAsyncThunk('cart/removeFromCart', async (id, { rejectWithValue }) => {
  try {
    const { data } = await cartService.remove(id);
    return data.cart;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cart: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCartState: (state) => {
      state.cart = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.cart = action.payload;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.cart = action.payload;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.cart = action.payload;
      });
  },
});

export const { clearCartState } = cartSlice.actions;
export default cartSlice.reducer;
