import Sidebar from '../../components/sidebar/Sidebar'
import Navbar from '../../components/navbar/Navbar'
import './home.scss'
import Widget from '../../components/widget/Widget'
import Featured from '../../components/featured/Featured'
import Table from '../../components/table/Table'
import { useTranslation } from 'react-i18next'

const Home = () => {
    return (
        <div className="home">
            <Sidebar />
            <div className="homeContainer m-t-100">
                <Navbar />
                <div className="widgets ">
                    <Widget type="users" />
                    <Widget type="products" />
                    <Widget type="order" />
                    <Widget type="earning" />
                </div>
                <div className="charts">
                    <Featured />
                    {/* <Chart title="Last 6 Months (Revenue)" aspect={2 / 1} /> */}
                </div>
                <div className="listContainer">
                    <div className="listTitle">Latest Transactions</div>
                    <Table />
                </div>
            </div>
        </div>
    )
}

export default Home
