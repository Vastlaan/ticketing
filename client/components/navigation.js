import Link from 'next/link'
import {useRouter} from 'next/router'

export default function Navigation({currentUser}) {

    const router = useRouter()

    async function signout(){
        const response = await fetch('/api/users/signout', {
            method: "POST"
        })
        router.push('/auth/signin')

    }
    return (
        <nav className='navbar navbar-expand-lg bg-primary'>
            <div className="container-fluid">
                <Link href="/" >
                    <a className="navbar-brand">GitTic</a>
                </Link>
                <button className="navbar-toggler navbar-dark" 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#navbarNav" 
                    aria-controls="navbarNav" 
                    aria-expanded="false" 
                    aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <Link href="/">
                            <a className="nav-link active text-light" aria-current="page" >Home</a>
                        </Link>
                    </li>
                    {!currentUser ? <>
                        <Link className="nav-item" href="/auth/signup"><li className=" nav-link text-light">Signup</li></Link>
                        <Link className="nav-item" href="/auth/signin"><li className=" nav-link text-light">Login</li></Link>
                        
                    </>:<li className="nav-item">
                            <a className="nav-link text-light" onClick={signout}>Sign out</a>
                        </li>}
                </ul>
                </div>
            </div>
        </nav>
    )
}
