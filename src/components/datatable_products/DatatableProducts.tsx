import './datatableproducts.scss'
import { DataGrid } from '@mui/x-data-grid'
import { productsColumns } from '../../datatablesource'
import { useEffect, useState } from 'react'
import { collection, deleteDoc, doc, onSnapshot } from 'firebase/firestore'
import { db } from '../../firebase/firebase'
import { Link, useNavigate } from 'react-router-dom'
import { Backdrop, Button, CircularProgress } from '@mui/material'
import Category from '../category/Category'

const DatatableProducts = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        // const fetchData = async () => {
        //     let list = [];
        //     try {
        //         const querySnapshot = await getDocs(collection(db, 'users'));
        //         querySnapshot.forEach((doc) => {
        //             list.push({ id: doc.id, ...doc.data() });
        //         });
        //         setData(list);
        //         console.log(list);
        //     } catch (err) {
        //         console.log(err);
        //     }
        // };
        // fetchData();

        // LISTEN (REALTIME)
        setLoading(true)

        const unsub = onSnapshot(
            collection(db, 'products'),
            (snapShot) => {
                const list: any = []
                snapShot.docs.forEach((doc) => {
                    list.push({ id: doc.id, ...doc.data() })
                })
                setData(list)
                setLoading(false)
            },
            (error) => {
                console.log(error)
            }
        )
        return () => {
            unsub()
        }
    }, [])

    const handleDelete = async (id: any) => {
        try {
            await deleteDoc(doc(db, 'products', id))
            setData(data.filter((item: any) => item.id !== id))
        } catch (err) {
            console.log(err)
        }
    }

    const handleEdit = (id: any) => {
        navigate('/products/edit', { state: id })
    }

    const actionColumn = [
        {
            field: 'action',
            headerName: 'Action',
            width: 200,
            renderCell: (params: any) => {
                return (
                    <div className="cellAction">
                        <Link to={`/products/${params.row.id}`} style={{ textDecoration: 'none' }}>
                            <div className="viewButton">View</div>
                        </Link>

                        <div className="viewButton" onClick={() => handleEdit(params.row.id)}>
                            Edit
                        </div>

                        <div className="deleteButton" onClick={() => handleDelete(params.row.id)}>
                            Delete
                        </div>
                    </div>
                )
            },
        },
    ]
    return (
        <div>
            {loading ? (
                <Backdrop
                    sx={{
                        color: '#fff',
                        zIndex: (theme) => theme.zIndex.drawer + 1,
                    }}
                    open={true}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
            ) : (
                <div className="datatable">
                    <div className="datatableTitle">
                        Products
                        <Link to="/products/new">
                            <Button variant="contained">Add New</Button>
                        </Link>
                    </div>
                    {/* <Category /> */}
                    <DataGrid className="datagrid" rows={data} columns={productsColumns.concat(actionColumn)} pageSize={5} rowsPerPageOptions={[5]} checkboxSelection />
                </div>
            )}
        </div>
    )
}

export default DatatableProducts
