import './list_order.scss'
import Sidebar from '../../components/sidebar/Sidebar'
import Navbar from '../../components/navbar/Navbar'
import DatatableOrder from '../../components/datatable_order/DatatableOrder'

const ListUsers = () => {
    return (
        <div className="list">
            <Sidebar />
            <div className="listContainer">
                <Navbar />
                <DatatableOrder />
            </div>
        </div>
    )
}

export default ListUsers
