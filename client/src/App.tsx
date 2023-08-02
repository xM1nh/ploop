import Layout from "./components/layout/Layout"

import HomeItemContainer from "./components/spray/HomeItemContainer"

function App() {
    return (
        <Layout>
            <div className="home">
                <HomeItemContainer />
                <HomeItemContainer />
                <HomeItemContainer />
            </div>
        </Layout>
    )
}

export default App
