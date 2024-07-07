import './Popup.css'
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate, useRevalidator } from "react-router-dom"

export interface FormEntry {
    name : string,
    key? : string,
    type? : string,
    required : boolean,
    defaultValue? : string
}

interface PopupProps {
    postURL : string, 
    submitFunction? : ((postData: any) => Promise<void>),
    completetionRedirection? : string,
    formEntries? : FormEntry[]
}

function Popup({
    postURL, 
    submitFunction, 
    completetionRedirection = '/',
    formEntries = [
        {name: 'Name', required: true},
        {name: 'Category', required: true},
        {name: 'Query', required: true}
    ]
} : PopupProps) {
    const { register, handleSubmit, formState:{errors} } = useForm()
    const [ response, setResponse ] = useState("")
    const revalidator = useRevalidator()
    const navigate = useNavigate()

    const submitData = async (formData : any) => {
        // lowercase the keys of form data and check for specified keys
        let key : any
        let keys = Object.keys(formData)
        let n = keys.length
        let formattedFormData : any = {}
        while (n--) {
            key = keys[n]

            let formEntry = formEntries.filter((entry) => {return entry.name == key})[0]
            if (formEntry.key) {
                formattedFormData[formEntry.key] = formData[key]
                continue
            }
            formattedFormData[key.toLowerCase()] = formData[key]
        }

        let request = await fetch(
            postURL,
            {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(formattedFormData)
            }
        )
    
        if (request.status == 200) {
            revalidator.revalidate()
            navigate(completetionRedirection, { replace: true })
            return
        }
        setResponse(await request.text())
    }

    return (
        <>
            <form className='popup-form' onSubmit={handleSubmit(submitFunction ? submitFunction : submitData)}>
                <h2>Modify Tracker</h2>
                {formEntries.map((entry) => {
                    return <>
                        <label htmlFor={entry.name}>{entry.name}: </label>
                        {errors[entry.name] && (<span> (Required)</span>)}
                        <input {...register(entry.name, { required: entry.required })} defaultValue={entry.defaultValue ? entry.defaultValue : ''} type={entry.type ? entry.type : 'text'}></input>
                    </>
                })}
                <div></div>
                <input type='submit' id="button" value='Submit' formMethod='dialog'></input>
                <button onClick={() => navigate(completetionRedirection, { replace: true })} id="cancel">Cancel</button>
                <p>{response}</p>
            </form>
        </>
    )
}

export default Popup