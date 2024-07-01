import "./ItemDetails.css"
import { useLoaderData } from "react-router-dom"
import { ItemData, QueryData } from "../../schemas"

function ItemDetails() {
    const data = useLoaderData() as ItemData

    return (
        <>
            <div id="item-details-container">
                <h1>{data.name}</h1>
                <div>{data.category}</div>
                <div>{data.query}</div>
                {data.history && data.history.map((data : QueryData) => {
                    return (
                        <div key={data.datetime}>
                            <div>{data.datetime}</div>
                            <div>{data.quantity}</div>
                        </div>
                    );
                })}
            </div>
        </>
    )
}

export default ItemDetails