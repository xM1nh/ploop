import { BrowserRouter, Routes, Route } from "react-router-dom"

import CreateSpray from './pages/spray/CreateSpray'
import User from "./pages/user/User"
import App from "./App"
import PersistLogin from "./components/wrapper/PersistLogin"

const RouteSwitch = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<PersistLogin />}>
                    <Route path='/' element={<App />}/>
                    <Route path='/create' element={<CreateSpray />}/>
                    <Route path='/:id' element={<User />}/>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default RouteSwitch