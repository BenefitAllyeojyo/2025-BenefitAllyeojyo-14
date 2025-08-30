// src/Redux/slices/benefitsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getJSON } from '@/lib/api'

export const fetchBenefits = createAsyncThunk(
  'benefits/fetch',
  async (page = 1, { rejectWithValue }) => {
    try {
      const data = await getJSON(`/api/benefits?page=${page}`);
      // 데이터 키 이름이 UI가 기대하는 형태인지 한번 정규화
      const items = (data.items || []).map(x => ({
        id: x.id,
        title: x.title,
        discount: x.discount ?? x.discountText ?? '',
        distance: x.distance ?? x.distanceText ?? '',
        tags: x.tags ?? [],
        thumbnail: x.thumbnail ?? ''
      }));
      return { page, items };
    } catch (e) {
      return rejectWithValue(e?.message || 'Network error');
    }
  }
)

const slice = createSlice({
  name: 'benefits',
  initialState: { items: [], page: 1, loading: false, error: null },
  reducers: { reset: (s) => { s.items = []; s.page = 1; s.error = null } },
  extraReducers: (b) => {
    b.addCase(fetchBenefits.pending,   (s)   => { s.loading = true; s.error = null })
    b.addCase(fetchBenefits.fulfilled, (s,a) => {
      s.loading = false;
      // 같은 페이지 중복 로드 방지(옵션)
      if (a.payload.page === 1) s.items = a.payload.items;
      else s.items.push(...a.payload.items);
      s.page = a.payload.page;
    })
    b.addCase(fetchBenefits.rejected,  (s,a) => {
      s.loading = false;
      s.error = a.payload || a.error?.message || 'error';
      // 즉석 디버깅 로그(필요 없으면 지워도 됨)
      console.warn('[benefits/fetch] failed:', s.error);
    })
  }
})
export const { reset } = slice.actions
export default slice.reducer
