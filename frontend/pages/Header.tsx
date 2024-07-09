import { Link } from "react-router-dom"
import "./Header.css"

function Header() {
    return (
        <>
            <nav>
                <div>
                    <h1>Craiglist Tracker</h1>
                </div>
                <div>
                    <Link to={''}>Trackers</Link>
                    <Link to={'stats'}>Stats</Link>
                    <Link to={'status'}>Status</Link>
                    <Link to={'about'}>About</Link>
                </div>
            </nav>
        </>
    )
}

export default Header