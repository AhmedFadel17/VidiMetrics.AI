import { JSX } from "react";

export type AppRoute = {
    path: string;
    label: string;
    element: JSX.Element;
}

export interface FilterOption {
    label: string;
    value: string | number;
    sortOrder?: 'asc' | 'desc';
    orderBy?: string;
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