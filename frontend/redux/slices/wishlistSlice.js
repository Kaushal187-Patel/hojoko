import { createSlice } from '@reduxjs/toolkit';

const storageKey = (userId) => (userId ? `wishlist_${userId}` : 'wishlist_guest');

const readStoredItems = (userId) => {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    return JSON.parse(window.localStorage.getItem(storageKey(userId)) || '[]');
  } catch {
    return [];
  }
};

const writeStoredItems = (userId, items) => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(storageKey(userId), JSON.stringify(items));
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: [],
    userId: null,
    hydrated: false,
  },
  reducers: {
    hydrateWishlist: (state, action) => {
      const userId = action.payload || null;
      state.userId = userId;
      state.items = readStoredItems(userId);
      state.hydrated = true;
    },
    toggleWishlistItem: (state, action) => {
      const product = action.payload;
      const exists = state.items.some((item) => item._id === product._id);

      state.items = exists
        ? state.items.filter((item) => item._id !== product._id)
        : [...state.items, product];

      writeStoredItems(state.userId, state.items);
    },
    clearWishlist: (state) => {
      state.items = [];
      writeStoredItems(state.userId, []);
    },
  },
});

export const { hydrateWishlist, toggleWishlistItem, clearWishlist } = wishlistSlice.actions;

export const selectWishlistItems = (state) => state.wishlist.items;
export const selectIsWishlisted = (productId) => (state) =>
  state.wishlist.items.some((item) => item._id === productId);

export default wishlistSlice.reducer;
