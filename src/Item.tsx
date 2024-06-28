import { ItemData } from "./Schemas"


function Item({data}: {data : ItemData}) {
    return (
        <>
            <div>
                <h1>{data.name}</h1>
                <h3>{data.category}</h3>
                <span></span>
                <div>
                    <h3>Median : {data.median_price.price.toString()}</h3>
                    <h3>Lowest : {data.lowest_price.price.toString()}</h3>
                    <h3>Highest : {data.highest_price.price.toString()}</h3>
                </div>
                <button>Details</button>
            </div>
        </>
    )
}

export default Item