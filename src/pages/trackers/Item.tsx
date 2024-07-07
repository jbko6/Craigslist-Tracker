import "./Item.css"
import { ItemData } from "../../schemas"
import { Link } from "react-router-dom"

function Item({data}: {data : ItemData}) {
    return (
        <>
            <div className="item-container">
                <h1>{data.name}</h1>
                <h3>{data.category}</h3>
                <hr></hr>
                {data.median_price && data.lowest_price && data.highest_price && (<div>
                    <h3>Median : {data.median_price.price.toString()}</h3>
                    <h3>Lowest : {data.lowest_price.price.toString()}</h3>
                    <h3>Highest : {data.highest_price.price.toString()}</h3>
                </div>)}
                <div id="item-buttons">
                    <Link to={'item/'+data._id}>Details</Link>
                    <Link to={'modify/'+data._id}>Modify</Link>
                </div>
            </div>
        </>
    )
}

export default Item