import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { QueryInput, fetchAnimationsJson } from "../lib/publicAnimationsAPI";
import { removeArrayDuplicatesByProp } from "../common/utils";
import {
  PageInfo,
  PublicAnimation,
  PublicAnimationEdge,
} from "../common/interfaces/PublicAnimation.interface";
import {
  PageInfoInput,
  fetchPublicAnimations,
  queryPublicAnimations,
} from "../lib/publicAnimationsAPI";

export interface AnimationState {
  filteredPublicAnimations: PublicAnimation[];
  publicAnimations: PublicAnimation[];
  pageInfo: PageInfo | null;
  totalCount: number;
  status: "idle" | "loading" | "failed";
}

const initialState: AnimationState = {
  filteredPublicAnimations: [],
  publicAnimations: [],
  pageInfo: null,
  totalCount: 0,
  status: "idle",
};

export const getPublicAnimations = createAsyncThunk(
  "animation/fetchPublicAnimations",
  async (pageInfoInput: PageInfoInput) => {
    const response = await fetchPublicAnimations(pageInfoInput);
    return response.data.featuredPublicAnimations;
  }
);

export const searchPublicAnimations = createAsyncThunk(
  "animation/searchPublicAnimations",
  async (queryInput: QueryInput) => {
    const response = await queryPublicAnimations(queryInput);
    const animations = response.data.searchPublicAnimations;
    const jsonUrls = animations.edges.map((edge: PublicAnimationEdge) => edge.node.jsonUrl);
    fetchAnimationsJson(jsonUrls);
    return animations;
  }
);

export const publicAnimationSlice = createSlice({
  name: "publicAnimations",
  initialState,
  reducers: {
    updatePublicAnimations: (state, action) => {
      const newAnimations = action.payload.edges.map((edge: PublicAnimationEdge) => edge.node);
      const publicAnimations = [
        ...state.publicAnimations,
        ...newAnimations,
      ];
      state.publicAnimations = removeArrayDuplicatesByProp(
        publicAnimations,
        "id"
      );
    },
    updateFilteredPublicAnimations: (state, action) => {
      state.filteredPublicAnimations = action.payload;
      if (!action.payload.length) {
        state.totalCount = state.publicAnimations.length;
      }
    },
    updateTotalCount: (state, action) => {
      state.totalCount = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPublicAnimations.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getPublicAnimations.fulfilled, (state, action) => {
        state.status = "idle";
        const publicAnimations = [
          ...state.publicAnimations,
          ...action.payload.edges.map((edge: PublicAnimationEdge) => edge.node),
        ];
        state.publicAnimations = removeArrayDuplicatesByProp(
          publicAnimations,
          "id"
        );
        state.pageInfo = action.payload.pageInfo;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(getPublicAnimations.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(searchPublicAnimations.pending, (state) => {
        state.status = "loading";
      })
      .addCase(searchPublicAnimations.fulfilled, (state, action) => {
        state.status = "idle";
        const filteredPublicAnimations = action.payload.edges.map(
          (edge: PublicAnimationEdge) => edge.node
        );
        state.filteredPublicAnimations = [...state.filteredPublicAnimations, ...filteredPublicAnimations];
        const publicAnimations = [
          ...state.publicAnimations,
          ...filteredPublicAnimations,
        ];
        state.publicAnimations = removeArrayDuplicatesByProp(
          publicAnimations,
          "id"
        );
        state.pageInfo = action.payload.pageInfo;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(searchPublicAnimations.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const { updatePublicAnimations, updateFilteredPublicAnimations, updateTotalCount } =
  publicAnimationSlice.actions;
export const selectPublicAnimations = (state: RootState) =>
  state.publicAnimations;
export const selectFilteredPublicAnimations = (state: RootState) =>
  state.filteredPublicAnimations;
export const selectTotalCount = (state: RootState) => state.totalCount;
export const selectPageInfo = (state: RootState) => state.pageInfo;

export default publicAnimationSlice.reducer;
