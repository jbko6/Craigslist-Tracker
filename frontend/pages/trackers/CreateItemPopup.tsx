import Popup from "../shared/Popup"

function CreateItemPopup() {
    return (
        <>
            <Popup title='Create Item' postURL='http://localhost:5001/items/'></Popup>
        </>
    )
}

export default CreateItemPopup