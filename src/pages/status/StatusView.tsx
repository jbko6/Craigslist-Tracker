import './StatusView.css'
import { useLoaderData } from "react-router-dom"
import { StatusData } from "../../schemas"
import { useEffect, useState } from 'react'

function StatusView() {
    const data = useLoaderData() as StatusData
    const [ uptime, setUptime ] = useState(data.uptime)

    useEffect(() => {
        const interval = setInterval(() => {
            setUptime(uptime + 1)
        }, 1000)
        return () => {
            clearInterval(interval)
        }
    })

    return (
        <>
            <div id='status-container'>
                {data.uptime ? (<div>
                    <span>Status: </span><span style={{'color': 'lime'}}>Online</span>
                    <div>Uptime: {uptime.toFixed(0)} seconds</div>
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