import { useLoaderData} from 'react-router-dom'
import { ItemData } from '../../schemas'
import Popup from '../shared/Popup'

function ModifyItemPopup() {
    const data = useLoaderData() as ItemData

    return (
        <>
            <Popup postURL={'http://localhost:5001/items/' + data._id} formEntries={[
                    {name: 'Name', required: true, defaultValue: data.name},
                    {name: 'Category', required: true, defaultValue: data.category},
                    {name: 'Query', required: true, defaultValue: data.query}
            ]}></Popup>
        </>
    )
}

export default ModifyItemPopup