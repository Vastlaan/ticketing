import { useRouter } from "next/router";
import Layout from "../layouts";

export default function landing({currentUser}) {

    const router = useRouter()

    if(!currentUser){
        return <Layout currentUser={null}>
            <div className="card p-4">
                <div className="card-body">
                    <h6 className="primary card-title">You must be logged in!</h6>
                    <button onClick={()=>router.push('/auth/signin')} className="btn btn-primary">Log in</button>
                </div>
            </div>
        </Layout>
    }
    return <Layout currentUser={currentUser}>
        <div className="card p-4">
            <div className="card-body">
                <h6 className="card-title">Welcome {currentUser && currentUser.email}!</h6>
                <p className="card-text">You are succesfully logged in as {currentUser && currentUser.email}.</p>
            </div>
        </div>
    </Layout>;
}

export async function getServerSideProps({req}){
    try{
        // const response = await fetch('http://auth-srv:3000/api/users/currentuser')   // this way we reach service directly
        // but we reach ingress-nginx-controller (our niginx service) instead
        // ingress-nginx-controller is on other namespace (ingress-nginx), so the path is : [service].[namespace].svc.cluster.local
        // http://ingress-nginx-controller.ingress-nginx.srv.cluster.local

        const response = await fetch('http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser',{
            headers:{
                Host: 'ticketing.dev',   // host necessary because of nginx is listening for that specific host
                cookie: req.headers.cookie
            },
        })
        const {currentUser} = await response.json()
        console.log('Server: ',currentUser)
        return {
            props:{
                currentUser
            }
        }
    }catch(e){
        console.error(e)
        return {
            props:{},
            redirect:'/auth/signin'
        }
    }

}
