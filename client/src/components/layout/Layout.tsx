import './_Layout.css'

import { ReactNode } from 'react'
import { useSelector } from 'react-redux'
import { selectIsAuthOpen } from '../../features/modal/modalSlice'

import Header from '../header/Header'
import Navbar from '../navbar/Navbar'
import LoginModal from '../modal/user/LoginModal'

type LayoutProps = {
    children: ReactNode
}

const Layout = ({children} :LayoutProps) => {
    const isAuthOpen = useSelector(selectIsAuthOpen)

    return (
        <div className='app'>
            <Header />
            <main>
                <Navbar />
                <div className='mainContent'>
                    {children}
                </div>
            </main>
            {isAuthOpen && <LoginModal />}
        </div>
    )
}

export default Layout