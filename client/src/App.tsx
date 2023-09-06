import Layout from "./components/layout/Layout"

import useInfiniteScroll from "./hooks/useInfiniteScroll"
import { useLazyGetSpraysQuery } from "./features/spray/sprayApiSlice"
import { useSelector } from "react-redux"
import { selectUser } from "./features/auth/authSlice"

import HomeItemContainer from "./components/spray/HomeItemContainer"


function App() {
    const user = useSelector(selectUser)
    const {
        combinedData: sprays,
        itemRef,
        isFetching,
        isLoading
    } = useInfiniteScroll(useLazyGetSpraysQuery)

    const loading = <div>Loading...</div>

    return (
        <Layout>
            <div className="home">
                {
                sprays.map((spray, i: number) => 
                    <HomeItemContainer 
                        key={i}
                        spray={spray} 
                        userId={user?.id}
                        ref={i === sprays.length - 1 ? itemRef : null}
                    />
                )
                }
                {
                    (isLoading || isFetching) && loading
                }
            </div>
        </Layout>
    )
}

export default App
