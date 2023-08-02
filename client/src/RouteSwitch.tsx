import { BrowserRouter, Routes, Route } from "react-router-dom"

import CreateSpray from './pages/spray/CreateSpray'
import App from "./App"

const RouteSwitch = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<App />}/>
                <Route path='/create' element={<CreateSpray />}/>
            </Routes>
        </BrowserRouter>
    )
}

export default RouteSwitch