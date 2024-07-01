interface ListingSchema {
    d_pid : number;
    url : string;
    price : number;
}

export interface QueryData {
    datetime : string;
    median_price : ListingSchema;
    lowest_price : ListingSchema;
    highest_price : ListingSchema;
    quantity : number;
    listings : ListingSchema[];
}

export interface ItemData {
    _id : string;
    name : string;
    query : string;
    category : string;
    filters? : any;
    median_price? : ListingSchema;
    lowest_price? : ListingSchema;
    highest_price? : ListingSchema;
    history?: QueryData[];
}

export interface StatusData {
    uptime: number;
}