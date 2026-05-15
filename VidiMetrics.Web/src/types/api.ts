

export type ApiResponse<T> = {
    data: T;
    message: string;
    status: number;
}

export interface PaginationResponse<T> {
    items: T[];
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    totalCount: number;
    itemsCount: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}

export interface PaginationFilter {
    pageNumber?: number;
    pageSize?: number;
    orderBy?: string;
    sortOrder?: string;
    searchTerm?: string;
    limit?: number;
}

export interface Lookup {
    id: string;
    name: string;
    imageUrl?: string;
}
