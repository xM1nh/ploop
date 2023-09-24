import Layout from "./components/layout/Layout"

import { useState } from "react"
import { useGetSpraysQuery } from "./features/spray/sprayApiSlice"
import { useSelector } from "react-redux"
import { selectUser } from "./features/auth/authSlice"
import { useInView } from "react-cool-inview"

import HomeItemContainer from "./components/spray/HomeItemContainer"
import HomeItemContainerSkeleton from "./components/spray/HomeItemContainerSkeleton"
import { Spray } from "./utils/types"

function App() {
    const user = useSelector(selectUser)
    const [page, setPage] = useState<number>(1)
    const isLoggedIn = JSON.parse(localStorage.getItem('isLoggedIn') as string)

    const {
        data: sprays,
        isFetching,
        isLoading,
    } = useGetSpraysQuery({page, count: 10, userId: user ? user : "0"}, {skip: isLoggedIn && user === '0'})

    const { observe: endItemRef } = useInView({
        threshold: 0.5,
        onEnter: ({unobserve}) => {
            unobserve()
            if (!isFetching) {
                setPage(page => page + 1)
            }
        }
    })

    return (
        <Layout>
            <div className="home" >
                {
                sprays?.map((spray: Spray, i: number) => 
                    <HomeItemContainer 
                        key={i}
                        spray={spray} 
                        userId={user}
                        ref={i === sprays?.length - 1 ? endItemRef : null}
                    />
                )
                }
                {
                    (isLoading || isFetching) && <HomeItemContainerSkeleton />
                }
            </div>
        </Layout>
    )
}

export default App
