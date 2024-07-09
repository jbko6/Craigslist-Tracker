export interface ListingData {
    d_pid : number;
    url : string;
    price : number;
}

export interface QueryData {
    datetime : string;
    median_price : ListingData;
    lowest_price : ListingData;
    highest_price : ListingData;
    quantity : number;
    listings : ListingData[];
}

export interface AlertData {
    tracking : string;
    critical_point : number;
    greater_than : boolean;
    email : string;
    last_alert? : ListingData;
}

export interface ItemData {
    _id : string;
    name : string;
    query : string;
    category : string;
    filters? : any;
    median_price? : ListingData;
    lowest_price? : ListingData;
    highest_price? : ListingData;
    history? : QueryData[];
    alerts : AlertData[];
}

export interface StatusData {
    uptime : number;
    config : ConfigData;
}

export interface ConfigData {
    city : string;
    max_searches : number;
    query_delay_hours : number;
    search_delay : number;
}