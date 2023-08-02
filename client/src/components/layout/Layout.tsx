import './_Layout.css'

import { ReactNode } from 'react'
import { useSelector } from 'react-redux'
import { selectIsOpen } from '../../features/signup/modalSlice'

import Header from '../header/Header'
import Navbar from '../navbar/Navbar'
import LoginModal from '../auth/LoginModal'

type LayoutProps = {
    children: ReactNode
}

const Layout = ({children} :LayoutProps) => {
    const isOpen = useSelector(selectIsOpen)

    return (
        <div className='app'>
            <Header />
            <main>
                <Navbar />
                <div className='mainContent'>
                    {children}
                </div>
            </main>
            {isOpen && <LoginModal />}
        </div>
    )
}

export default Layout