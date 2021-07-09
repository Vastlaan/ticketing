import {useState} from 'react'

export function useRequest({url, method, body, onSuccess}){

    const [errors, setErrors] = useState(null)

    async function doRequest(){
        setErrors(null)
        try{
            const response = await fetch(url, {
                method,
                headers:{
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            })
            const data = await response.json()

            if(data.errors){
                setErrors(data.errors)
            }
            if(data.user){
                onSuccess(data.user)
            }
        }catch(e){
            console.log(e)
            setErrors([{message: e}])
        }
    }

    return {doRequest, errors}

}