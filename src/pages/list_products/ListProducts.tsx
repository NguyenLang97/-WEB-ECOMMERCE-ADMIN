import './listproducts.scss'
import Sidebar from '../../components/sidebar/Sidebar'
import Navbar from '../../components/navbar/Navbar'
import DatatableProducts from '../../components/datatable_products/DatatableProducts'

const ListProducts = () => {
    return (
        <div className="list">
            <Sidebar />
            <div className="listContainer">
                <Navbar />
                <DatatableProducts />
            </div>
        </div>
    )
}

export default ListProducts
