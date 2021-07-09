import {useState} from 'react'
import {useRouter} from 'next/router'
import { useRequest } from '../../hooks/use_request'
import Layout from '../../layouts'

export default function SignupPage() {


    const router = useRouter()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const {doRequest, errors} = useRequest({
        url: "/api/users/signin",
        method: "POST",
        body: {email, password}, 
        onSuccess
    })

    function onSuccess(user){
        console.log(user)
        router.push('/')
    }

    async function handleSubmit(e){
        e.preventDefault()
        await doRequest()
    }
    function renderErrorMessage(errors, field){
        if(field==='general'){
            const generalError = errors.find(err=>!err.field)
            if(generalError){
                return <div className='mt-2 mb-2 alert alert-danger' role='alert'>{generalError.message}</div>
            }
        }
        const existingError = errors.find(err=>err.field===field)
        if(existingError){
            return <div className='mt-2 mb-2 alert alert-danger' role='alert'>{existingError.message}</div>
        }
    }

    return (
        <Layout>
            <form onSubmit={handleSubmit} className='m-2 p-2'>
                <h1>Login</h1>

                <div className='form-group m-2'>
                    <label htmlFor="email">Email:</label>
                    <input type="email" className='form-control' value={email} onChange={(e)=>setEmail(e.target.value)} />
                    {errors && renderErrorMessage(errors,'email')}
                </div>
                <div className='form-group m-2'>
                    <label htmlFor="password">Password:</label>
                    <input type="password" className='form-control' value={password} onChange={(e)=>setPassword(e.target.value)}/>
                    {errors && renderErrorMessage(errors,'password')}
                </div>
                <div className='form-group m-2'>
                    <button type='submit' className='btn btn-primary'>Sign up!</button>
                    {errors && renderErrorMessage(errors,'general')}
                </div>
            </form>
        </Layout>
    )
}
