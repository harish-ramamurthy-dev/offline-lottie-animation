import axios from "axios";
import { publicAnimationsQuery, searchPublicAnimationsQuery } from "./graphql/queries";

export interface PageInfoInput {
  after?: string | null;
  before?: string | null;
  first?: number;
  last?: number;
}

export interface QueryInput extends PageInfoInput {
  query: string;
}

const BASE_URL = "https://graphql.lottiefiles.com/2022-08";

export const fetchPublicAnimations = async (pageInfoInput: PageInfoInput) => {
  const response = await axios({
    url: BASE_URL,
    method: "POST",
    data: {
      query: publicAnimationsQuery,
      variables: pageInfoInput,
    },
  });
  return response.data;
};

export const queryPublicAnimations = async (queryInput: QueryInput) => {
  const response = await axios({
    url: BASE_URL,
    method: "POST",
    data: {
      query: searchPublicAnimationsQuery,
      variables: queryInput,
    },
  });
  return response.data;
};

export const fetchAnimationsJson = async (jsonUrls: string[]) => {
  return Promise.all(jsonUrls.map((url) => axios.get(url)));
};
