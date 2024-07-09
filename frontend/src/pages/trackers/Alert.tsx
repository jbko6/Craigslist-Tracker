import './Alert.css'
import { AlertData } from "../../schemas"
import { useState } from 'react'

function Alert({data, onDelete, onPush} : {data : AlertData, onDelete : () => void, onPush : (data : AlertData) => void}) {
    const [ email, setEmail ] = useState(data.email)
    const [ tracking, setTracking ] = useState(data.tracking)
    const [ greaterThan, setGreaterThan ] = useState(data.greater_than)
    const [ criticalPoint, setCriticalPoint ] = useState(data.critical_point)

    const gatherData = () => {
        return  {
            'tracking': tracking,
            'email': email,
            'greater_than': greaterThan,
            'critical_point': criticalPoint
        } as AlertData
    }

    return (
        <>
            <div id='alert-container'>
                <span id='alert'>
                    Send an alert to 
                        <input value={email} onChange={(event) => setEmail(event?.target.value)} onBlur={() => onPush(gatherData())}/>
                    when item's 
                        <select id='tracking' value={tracking.replace('_', ' ')} onChange={(event) => setTracking(event.target.value.replace(' ', '_'))} onBlur={() => onPush(gatherData())}>
                            <option>median price</option>
                            <option>lowest price</option>
                            <option>highest price</option>
                        </select>
                    is 
                        <select id='greater-than' value={greaterThan ? '>' : '<'} onChange={(event) => setGreaterThan(event.target.value == ">")} onBlur={() => onPush(gatherData())}>
                            <option>&gt;</option>
                            <option>&lt;</option>
                        </select>
                    $
                        <input type="number" id='critical-point' value={criticalPoint} onChange={(event) => setCriticalPoint(Number(event?.target.value))} onBlur={() => onPush(gatherData())}/>
                    .
                </span> 
                <div id='alert-actions'>
                    {data.last_alert && <div id='refresh-alert' onClick={() => console.log('refresh')}>r</div>}
                    <div id='delete-alert' onClick={onDelete}>x</div>
                </div>
            </div>
        </>
    )
}

export default Alert