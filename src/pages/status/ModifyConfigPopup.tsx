import { useLoaderData} from 'react-router-dom'
import Popup from '../shared/Popup'
import { ConfigData } from '../../schemas'

function ModifyConfigPopup() {
    const data = useLoaderData() as ConfigData

    return (
        <>
            <Popup title='Modify Config' postURL={'http://localhost:5001/config'} completetionRedirection='/status' formEntries={[
                    {name: 'City', key: 'city', required: true, defaultValue: data.city},
                    {name: 'Max Searches', key: 'max_searches', required: true, defaultValue: String(data.max_searches)},
                    {name: 'Query Delay', key: 'query_delay_hours', required: true, defaultValue: String(data.query_delay_hours)},
                    {name: 'Search Delay', key: 'search_delay', required: true, defaultValue: String(data.search_delay)}
            ]}></Popup>
        </>
    )
}

export default ModifyConfigPopup