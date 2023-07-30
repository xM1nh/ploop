import './_Layout.css'

import { ReactNode } from 'react'

import Header from '../header/Header'
import Navbar from '../navbar/Navbar'

type LayoutProps = {
    children: ReactNode
}

const Layout = ({children} :LayoutProps) => {
    return (
        <div className='app'>
            <Header />
            <main>
                <Navbar />
                <div className='mainContent'>
                    {children}
                </div>
            </main>
        </div>
    )
}

export default Layout