import { BrowserRouter, Routes, Route } from "react-router-dom"

import CreateSpray from './pages/spray/CreateSpray'
import User from "./pages/user/User"
import App from "./App"

const RouteSwitch = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<App />}/>
                <Route path='/create' element={<CreateSpray />}/>
                <Route path='/:id' element={<User />}/>
            </Routes>
        </BrowserRouter>
    )
}

export default RouteSwitch