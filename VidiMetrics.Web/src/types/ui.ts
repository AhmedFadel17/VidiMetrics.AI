import { JSX } from "react";

export type AppRoute = {
    path: string;
    label: string;
    element: JSX.Element;
}


export type SidebarRoute = {
    path: string;
    label: string;
    icon: JSX.Element;
    subItems?: {
        path: string;
        label: string;
        icon: JSX.Element;
        pro?: boolean;
        new?: boolean
    }[]
}

export type FilterType = 'select' | 'date' | 'text';

export interface FilterFieldDefinition<TValue = any> {
    id: string;
    label: string;
    type: FilterType;
    options?: { label: string; value: TValue }[];
    placeholder?: string;
}

export interface SortOptionDefinition {
    label: string;
    orderBy: string;
    sortOrder: 'asc' | 'desc';
}

export interface GridQueryState {
    filters: Record<string, any>;
    sort?: {
        orderBy: string;
        sortOrder: 'asc' | 'desc';
    };
}