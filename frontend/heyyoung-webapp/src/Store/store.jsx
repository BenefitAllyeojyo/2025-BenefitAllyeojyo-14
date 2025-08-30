import { configureStore } from '@reduxjs/toolkit'
import benefits from '@/Redux/slices/benefitsSlice'
import ui from '@/Redux/slices/uiSlice'

const store = configureStore({
  reducer: { benefits, ui },
  // middleware: (getDefault) => getDefault().concat(/* 커스텀 미들웨어 */),
  devTools: true
})
export default store
