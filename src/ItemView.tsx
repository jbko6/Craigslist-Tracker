import { useEffect, useState } from "react"
import { ItemData } from "./Schemas"
import Item from "./Item"

function ItemView() {
    const [data, setData] = useState<ItemData[] | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<any>(null)

    useEffect(() => {
        const fetchItemData = async() => {
            try {
                const response = await fetch(
                    'http://localhost:5001/items/'
                )
                if (!response.ok) {
                    throw new Error('HTTP Error: Status ${response.status}')
                }
                let itemData : ItemData[] = await response.json()
                console.log(itemData)
                setData(itemData)
                setError(null)
            } catch (err) {
                setError(err)
                setData(null)
            } finally {
                setLoading(false)
            }
        }

        fetchItemData()
    }, [])

    return (
        <>
            <div>
                {loading && (
                    <div>Loading...</div>
                )}
                {error && (
                    <div>Error: {String(error)}</div>
                )}
                {data && 
                    data.map((data) => {
                        return <><Item data={data}/></>
                    })
                }
            </div>
        </>
    )
}

export default ItemView