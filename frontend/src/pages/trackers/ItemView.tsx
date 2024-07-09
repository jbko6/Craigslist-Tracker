import "./ItemView.css"
import Item from "./Item"
import { Link, Outlet, useLoaderData, useLocation } from "react-router-dom"
import { ItemData } from "../../schemas";

function ItemView() {
    const data = useLoaderData() as ItemData[];
    const locationData = useLocation()

    return (
        <>
            <Outlet></Outlet>
            <div id="trackers-tab">
                {data.length > 0 && <div id="item-view-container">
                    {data && 
                        data.map((data) => {
                            return <Item data={data} key={data._id}/>
                        })
                    }
                </div>}
                {data.length == 0 && <h2>No trackers active. Try creating one.</h2>}
                {locationData.pathname != "/create" && (<div id="item-actions">
                    <Link to={'create'}>Create Tracker</Link>
                </div>)}
            </div>
        </>
    )
}

export default ItemView