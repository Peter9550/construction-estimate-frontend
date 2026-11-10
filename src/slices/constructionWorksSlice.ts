import {
  createAsyncThunk,
  createSlice,
  isFulfilled,
  isPending,
  isRejected,
  type PayloadAction,
} from "@reduxjs/toolkit";
import axios from "axios";
import { api } from "../api";
import type {
  BodyCreateConstructionWork,
  ConstructionWorkOut,
  ConstructionWorkPublish,
} from "../api/Api";
import { CONSTRUCTION_WORKS_MOCK } from "../modules/mock";
import type { RootState } from "../store";

interface ConstructionWorksState {
  priceLimit: number | null;
  priceMin: number;
  priceMax: number;
  works: ConstructionWorkOut[];
  feedWork: ConstructionWorkOut | null;
  draft: ConstructionWorkOut | null;
  loading: boolean;
  error: string | null;
}

interface FeedQuery {
  work_id?: number;
  next?: boolean;
}

interface LikeData {
  workId: number;
  like: number;
}

type ThunkConfig = { state: RootState; rejectValue: string };

const mockPrices = CONSTRUCTION_WORKS_MOCK.map((work) => work.historical_price ?? 0);

const initialState: ConstructionWorksState = {
  priceLimit: null,
  priceMin: Math.min(...mockPrices),
  priceMax: Math.max(...mockPrices),
  works: [],
  feedWork: null,
  draft: null,
  loading: false,
  error: null,
};

const isBackendUnavailable = (error: unknown) =>
  axios.isAxiosError(error) && (!error.response || error.response.status >= 500);

const errorMessage = (error: unknown) => {
  if (axios.isAxiosError(error) && typeof error.response?.data?.detail === "string") {
    return error.response.data.detail;
  }
  return "Не удалось выполнить запрос";
};

const filterMockByPrice = (priceLimit: number | null) =>
  CONSTRUCTION_WORKS_MOCK.filter(
    (work) => priceLimit === null || (work.historical_price ?? 0) <= priceLimit
  );

const findMockFeedWork = ({ work_id, next }: FeedQuery) => {
  if (!work_id) {
    return CONSTRUCTION_WORKS_MOCK[0];
  }
  if (next) {
    return CONSTRUCTION_WORKS_MOCK.find((work) => work.id > work_id) ?? CONSTRUCTION_WORKS_MOCK[0];
  }
  return CONSTRUCTION_WORKS_MOCK.find((work) => work.id === work_id);
};

export const getConstructionWorksList = createAsyncThunk<ConstructionWorkOut[], void, ThunkConfig>(
  "constructionWorks/getConstructionWorksList",
  async (_, { getState, rejectWithValue }) => {
    const { constructionWorks, user } = getState();
    const { priceLimit } = constructionWorks;
    try {
      const response = await api.constructionWorks.getConstructionWorks(
        priceLimit === null ? {} : { max_historical_price: priceLimit }
      );
      return response.data;
    } catch (error) {
      if (!user.isAuthenticated && isBackendUnavailable(error)) {
        return filterMockByPrice(priceLimit);
      }
      return rejectWithValue(errorMessage(error));
    }
  }
);

export const getConstructionWorkFeed = createAsyncThunk<ConstructionWorkOut, FeedQuery, ThunkConfig>(
  "constructionWorks/getConstructionWorkFeed",
  async (query, { getState, rejectWithValue }) => {
    try {
      const response = await api.constructionWorks.getConstructionWorkFeed(query);
      return response.data;
    } catch (error) {
      const mockWork = findMockFeedWork(query);
      if (!getState().user.isAuthenticated && isBackendUnavailable(error) && mockWork) {
        return mockWork;
      }
      return rejectWithValue(errorMessage(error));
    }
  }
);

export const getConstructionWorkDraft = createAsyncThunk<ConstructionWorkOut | null, void, ThunkConfig>(
  "constructionWorks/getConstructionWorkDraft",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.constructionWorks.getConstructionWorkDraft();
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      return rejectWithValue(errorMessage(error));
    }
  }
);

export const createConstructionWorkDraft = createAsyncThunk<
  ConstructionWorkOut,
  BodyCreateConstructionWork,
  ThunkConfig
>("constructionWorks/createConstructionWorkDraft", async (data, { rejectWithValue }) => {
  try {
    const response = await api.constructionWorks.createConstructionWork(data);
    return response.data;
  } catch (error) {
    return rejectWithValue(errorMessage(error));
  }
});

export const publishConstructionWorkDraft = createAsyncThunk<
  ConstructionWorkOut,
  ConstructionWorkPublish,
  ThunkConfig
>("constructionWorks/publishConstructionWorkDraft", async (data, { rejectWithValue }) => {
  try {
    const response = await api.constructionWorks.publishConstructionWork(data);
    return response.data;
  } catch (error) {
    return rejectWithValue(errorMessage(error));
  }
});

export const deleteConstructionWork = createAsyncThunk<number, number, ThunkConfig>(
  "constructionWorks/deleteConstructionWork",
  async (workId, { rejectWithValue }) => {
    try {
      await api.constructionWorks.deleteConstructionWork(workId);
      return workId;
    } catch (error) {
      return rejectWithValue(errorMessage(error));
    }
  }
);

export const likeConstructionWork = createAsyncThunk<ConstructionWorkOut, LikeData, ThunkConfig>(
  "constructionWorks/likeConstructionWork",
  async ({ workId, like }, { rejectWithValue }) => {
    try {
      const response = await api.constructionWorks.likeConstructionWork(workId, { like });
      return response.data;
    } catch (error) {
      return rejectWithValue(errorMessage(error));
    }
  }
);

const constructionWorksThunks = [
  getConstructionWorksList,
  getConstructionWorkFeed,
  getConstructionWorkDraft,
  createConstructionWorkDraft,
  publishConstructionWorkDraft,
  deleteConstructionWork,
  likeConstructionWork,
] as const;

const constructionWorksSlice = createSlice({
  name: "constructionWorks",
  initialState,
  reducers: {
    setPriceLimit(state, action: PayloadAction<number>) {
      state.priceLimit = action.payload;
    },
    resetPriceLimit(state) {
      state.priceLimit = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getConstructionWorksList.fulfilled, (state, action) => {
        const prices = action.payload.map((work) => work.historical_price ?? 0);
        state.works = action.payload;
        state.priceMin = Math.min(state.priceMin, ...prices);
        state.priceMax = Math.max(state.priceMax, ...prices);
      })
      .addCase(getConstructionWorkFeed.fulfilled, (state, action) => {
        state.feedWork = action.payload;
      })
      .addCase(getConstructionWorkFeed.rejected, (state) => {
        state.feedWork = null;
      })
      .addCase(getConstructionWorkDraft.fulfilled, (state, action) => {
        state.draft = action.payload;
      })
      .addCase(createConstructionWorkDraft.fulfilled, (state, action) => {
        state.draft = action.payload;
      })
      .addCase(publishConstructionWorkDraft.fulfilled, (state, action) => {
        state.draft = null;
        state.feedWork = action.payload;
      })
      .addCase(deleteConstructionWork.fulfilled, (state, action) => {
        state.works = state.works.filter((work) => work.id !== action.payload);
      })
      .addCase(likeConstructionWork.fulfilled, (state, action) => {
        state.feedWork = action.payload;
        state.works = state.works.map((work) =>
          work.id === action.payload.id ? action.payload : work
        );
      })
      .addMatcher(isPending(...constructionWorksThunks), (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher(isFulfilled(...constructionWorksThunks), (state) => {
        state.loading = false;
      })
      .addMatcher(isRejected(...constructionWorksThunks), (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Не удалось выполнить запрос";
      });
  },
});

export const { setPriceLimit, resetPriceLimit } = constructionWorksSlice.actions;
export default constructionWorksSlice.reducer;
