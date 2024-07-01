import { useForm } from "react-hook-form"
import "./CreateItemPopup.css"
import { useState } from "react"
import { useNavigate, useRevalidator } from "react-router-dom"

function CreateItemPopup() {
    const { register, handleSubmit, formState:{errors}} = useForm()
    const [ response, setResponse ] = useState("")
    const navigate = useNavigate()
    const revalidator = useRevalidator()

    const createItem = async (formData : any) => {
        let request = await fetch(
            'http://localhost:5001/items/',
            {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(formData)
            }
        )

        if (request.status == 200) {
            revalidator.revalidate()
            navigate('/', { replace: true })
            return
        }
        setResponse(await request.text())
    }

    return (
        <>
            <form id='create-item-popup' onSubmit={handleSubmit(createItem)}>
                <h2>Create Tracker</h2>
                <label htmlFor='name'>Name: </label>
                {errors.name && (<span> (Required)</span>)}
                <input {...register('name', { required: true })}></input>
                <label htmlFor='category'>Category: </label>
                {errors.category && (<span> (Required)</span>)}
                <input {...register('category', { required: true })}></input>
                <label htmlFor='query'>Query: </label>
                {errors.query && (<span> (Required)</span>)}
                <input {...register('query', { required: true })}></input>
                <div></div>
                <input type='submit' id="button" value='Submit' formMethod='dialog'></input>
                <p>{response}</p>
            </form>
        </>
    )
}

export default CreateItemPopup