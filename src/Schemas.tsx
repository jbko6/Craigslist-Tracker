interface ListingSchema {
    d_pid : Number;
    url : String;
    price : Number;
}

interface QueryData {
    datetime : String;
    median_price : ListingSchema;
    lowest_price : ListingSchema;
    highest_price : ListingSchema;
    quantity : Number;
    listings : ListingSchema[];
}

export interface ItemData {
    _id : String;
    name : String;
    query : String;
    category : String;
    filters : any;
    median_price : ListingSchema;
    lowest_price : ListingSchema;
    highest_price : ListingSchema;
    histroy: QueryData[];
}