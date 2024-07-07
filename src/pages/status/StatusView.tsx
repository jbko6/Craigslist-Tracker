import './StatusView.css'
import { Link, Outlet, useLoaderData } from "react-router-dom"
import { StatusData } from "../../schemas"
import { useEffect, useState } from 'react'

function StatusView() {
    const data = useLoaderData() as StatusData
    const [ uptime, setUptime ] = useState(data.uptime)
    const [ response, setResponse ] = useState('')

    useEffect(() => {
        const interval = setInterval(() => {
            setUptime(uptime + 1)
        }, 1000)
        return () => {
            clearInterval(interval)
        }
    })

    const manuallyQuery = async () => {
        const response = await fetch(
            'http://localhost:5001/query',
            {
                method: 'post'
            }
        )
        if (!response.ok) {
            throw new Error('HTTP Error: Status ${response.status}');
        }
        setResponse(await response.text())
    }

    return (
        <>
            <Outlet></Outlet>
            <div id='status-container'>
                {data.uptime ? (<div>
                    <span>Status: </span><span style={{'color': 'lime'}}>Online</span>
                    <div>Uptime: {uptime.toFixed(0)} seconds {(uptime / 60 / 60) > 2 ? '(' + (uptime / 60 / 60).toFixed(1) + ' hours)' : ''}</div>
                    <div>Config:</div>
                    <div id='configs'>
                        <div>City: {data.config.city}</div>
                        <div>Max Listing Searches: {data.config.max_searches}</div>
                        <div>Query Delay: {data.config.query_delay_hours} (hours)</div>
                        <div>Search Delay: {data.config.search_delay} (seconds)</div>
                    </div>
                    <div id='divider'></div>
                    <div id='status-actions'>
                        <Link to={'/status/modify'} id='modify-config-button'>Modify Config</Link>
                        <button id='manually-query-button' onClick={manuallyQuery}>Manually Query</button>
                    </div>
                    <p id='query-response'>{response}</p>
                </div>) : (
                    <div>
                        <span>Status: </span><span style={{'color': 'red'}}>Offline</span>
                    </div>
                )}
            </div>
        </>
    )
}

export default StatusView