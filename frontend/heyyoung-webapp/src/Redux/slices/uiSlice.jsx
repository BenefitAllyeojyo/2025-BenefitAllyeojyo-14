import { createSlice } from '@reduxjs/toolkit'
const ui = createSlice({
  name: 'ui',
  initialState: { bottomSheetOpen: false },
  reducers: {
    openSheet:  (s) => { s.bottomSheetOpen = true },
    closeSheet: (s) => { s.bottomSheetOpen = false },
  }
})
export const { openSheet, closeSheet } = ui.actions
export default ui.reducer
