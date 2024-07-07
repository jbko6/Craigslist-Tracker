import { LoaderFunction } from "react-router-dom";
import { ConfigData, ItemData, StatusData } from "./schemas";

async function backendFetch<T>(route : String): Promise<T> {
    try {
        const response = await fetch(
            'http://localhost:5001/' + route
        );
        if (!response.ok) {
            throw new Error('HTTP Error: Status ${response.status}');
        }
        const data : T = await response.json();
        return data;
    } catch (error) {
        return Object()
    }
}

export const getItems: LoaderFunction = async (): Promise<ItemData[]> => {
    return backendFetch<ItemData[]>('items/');
};

export const getItem: LoaderFunction = async ({ params }): Promise<ItemData> => {
    return backendFetch<ItemData>('items/' + params.itemId);
};

export const getStatus: LoaderFunction = async (): Promise<StatusData> => {
    return backendFetch<StatusData>('status')  
};

export const getConfig: LoaderFunction = async(): Promise<ConfigData> => {
    return backendFetch<ConfigData>('config')
}