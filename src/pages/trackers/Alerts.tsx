import './Alerts.css'
import { AlertData, ItemData } from "../../schemas";
import Alert from "./Alert";
import { useState } from 'react';

const blank_alert : AlertData = {
    'tracking': 'median_price',
    'critical_point': 0,
    'greater_than': false,
    'email': ''
}

function Alerts({data} : {data : ItemData}) {
    const [ alerts, setAlerts ] = useState(data.alerts ? data.alerts : [])

    return (
        <>
            <div id='alerts-container'>
                <ul>
                    {alerts.length > 0 && alerts.map((alert, index) => {
                        return <li 
                                    key={String(alert) + index} 
                                    className={alert.last_alert ? 'alerted' : ''}
                                >
                                    <Alert 
                                        data={alert} 
                                        onDelete={() => setAlerts(alerts.filter((_, idx) => idx != index))} 
                                        onPush={(alertData) => setAlerts(alerts.map((alert, idx) => idx == index ? alertData : alert))}>
                                    </Alert>
                                </li>
                    })}
                    <div id='create-alert' onClick={() => setAlerts([...alerts, blank_alert])}>+</div>
                    <button onClick={() => console.log(alerts)}>poll</button>
                </ul>
            </div>
        </>
    )
}

export default Alerts