export interface PublicAnimation {
  id: number;
  bgColor: string;
  jsonUrl: string;
  name: string;
  downloads: number;
  createdBy: {
    avatarUrl: string;
    firstName: string;
    lastName: string;
  };
}

export interface PublicAnimationEdge {
  cursor: string;
  node: PublicAnimation;
}

export interface PageInfo {
  endCursor: string;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string;
}

export interface PublicAnimationConnection {
  edges: PublicAnimationEdge[];
  pageInfo: PageInfo;
  totalCount: number;
}
