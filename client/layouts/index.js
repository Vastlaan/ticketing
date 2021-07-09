import Navigation from "../components/navigation"

export default function Layout({currentUser, children}) {
    return (
        <div className="container p-4 mx-auto">
           <Navigation currentUser={currentUser} />
           {children} 
        </div>
    )
}
