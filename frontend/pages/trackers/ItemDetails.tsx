import "./ItemDetails.css"
import { useLoaderData, useNavigate } from "react-router-dom"
import { ItemData, ListingData, QueryData } from "../../schemas"
import { Area, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { useEffect, useState } from "react"
import Alerts from "./Alerts"

function ItemDetails() {
    const data = useLoaderData() as ItemData
    const [ activeQuery, setActiveQuery ] = useState<QueryData | undefined>(undefined)

    const navigate = useNavigate()

    const deleteItem = async () => {
        const response = await fetch(
            'http://localhost:5001/items/' + data._id,
            { method: 'delete' }
        )
        if (!response.ok) {
            throw new Error('HTTP Error: Status ${response.status}');
        }

        navigate('/', { replace: true })
        return
    }

    // click away
    useEffect(() => {
        function clickAway(this: HTMLElement, ev : MouseEvent) {
            if (ev.target == document.body) {
                setActiveQuery(undefined)
            }
        }

        document.body.addEventListener('click', clickAway)

        return () => {
            document.body.removeEventListener('click', clickAway)
        }
    })

    return (
        <>
            <div id="item-details-container">
                <div id="item-details-header">
                    <h1>{data.name}<span style={{'color':'gray'}}> - {data.query}</span></h1>
                    <button id="item-details-delete" onClick={deleteItem}>Delete Item</button>
                </div>
                <hr />
                <div id="item-details-chart">
                    <ResponsiveContainer>
                        <ComposedChart 
                            data={data.history}
                            width={400}
                            height={400}
                        >
                            <CartesianGrid strokeDasharray='3 3' />
                            <XAxis dataKey={(query : QueryData) => {return new Date(query.datetime).toDateString()}} />
                            <YAxis yAxisId="price"/>
                            <YAxis yAxisId="quantity" orientation="right"/>
                            <Tooltip labelStyle={{color:'black', fontWeight:1000}} itemStyle={{'color':'black'}}/> 
                            <Area 
                                dataKey={(entry : QueryData) => {return [entry.lowest_price.price, entry.highest_price.price]}}
                                type="monotone"
                                stroke="none"
                                fill="#cccccc"
                                connectNulls
                                dot={false}
                                activeDot={false}
                                yAxisId="price"
                                animationDuration={1000}
                            />
                            <Line 
                                dataKey={(entry : QueryData) => {return entry.median_price.price}} 
                                type="natural" 
                                stroke="#FFF" 
                                connectNulls 
                                yAxisId="price" 
                                activeDot={{onClick: (_, payload : any) => setActiveQuery(payload['payload'])}}
                                animationDuration={0}
                            />
                            {/* <Bar dataKey="quantity" yAxisId="quantity" fill="white" width={1}/> */}
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
                {activeQuery ? (<div id='query-details-container'>
                    <h1>{activeQuery.datetime.replace(/T/, ' ').replace(/\..+/, '')}</h1>
                    <div id='query-details'>
                        <div id='query-data'>
                            <p>Quantity : {activeQuery.quantity}</p>
                            <p>Lowest Price : <a href={activeQuery.lowest_price.url}>${activeQuery.lowest_price.price}</a></p>
                            <p>Median Price : <a href={activeQuery.median_price.url}>${activeQuery.median_price.price}</a></p>
                            <p>Highest Price : <a href={activeQuery.highest_price.url}>${activeQuery.highest_price.price}</a></p>
                        </div>
                        <ul id='query-listings'>
                            {activeQuery.listings.map((listing : ListingData) => {
                                return <a href={listing.url}><li>${listing.price}</li></a>
                            })}
                        </ul>
                    </div>
                </div>) : (<div id='query-details-container'>
                    <h1>Alerts</h1>
                    <Alerts data={data}></Alerts>
                </div>)}
                
            </div>
        </>
    )
}

export default ItemDetails