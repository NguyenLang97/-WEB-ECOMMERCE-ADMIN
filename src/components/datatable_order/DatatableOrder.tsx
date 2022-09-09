import './datatable_order.scss'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { collection, deleteDoc, doc, onSnapshot } from 'firebase/firestore'
import { db } from '../../firebase/firebase'
import { Backdrop, Button, CircularProgress } from '@mui/material'
import '../../style/pagination.scss'

import ReactPaginate from 'react-paginate'
import React, { FunctionComponent } from 'react'
import Paper from '@mui/material/Paper'
import InputBase from '@mui/material/InputBase'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import SearchIcon from '@mui/icons-material/Search'
import ConvertStOrder from '../ConvertStOrder/ConvertStOrder'

const DatatableOrder = () => {
    const [data, setData] = useState([])
    const [pageNumber, setPageNumber] = useState(0)
    const [loading, setLoading] = useState(false)
    const [query, setQuery] = useState('')
    const navigate = useNavigate()
    console.log({ query })
    console.log({ data })

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
            collection(db, 'order'),
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
    const keys = ['name', 'phone', 'cartItems', 'totalQuantity']
    // chu y voi cac key tao ben client se k co gay ra loi

    const search = (data: any) => {
        if (data && data.length) {
            return data.filter((item: any) => keys.some((key) => item[key].toLowerCase().includes(query.toLowerCase())))
        } else return []
    }
    console.log('data', search(data))

    const handleDelete = async (id: any) => {
        try {
            await deleteDoc(doc(db, 'order', id))
            setData(data.filter((item: any) => item.id !== id))
        } catch (err) {
            console.log(err)
        }
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setQuery(event.target.value)
    }

    interface CartItemsState {
        id: string
        title: string
        price: number
        quantity: number
        totalPrice: number
        img: [{ img: string }]
        totalAmountOrder: number
        totalStock: number
    }
    function setDate(unixTime: number) {
        const date = new Date(unixTime * 1000)
        // console.log(date.toLocaleDateString('en-US'))
        return date.toLocaleDateString('en-US')
    }
    // phan trang
    const productPerPage = 8
    const visitedPage = pageNumber * productPerPage
    const displayPage = data.slice(visitedPage, visitedPage + productPerPage)

    const pageCount = Math.ceil(data.length / productPerPage)

    const changePage = ({ selected }: any) => {
        setPageNumber(selected)
    }

    return (
        <>
            {/* {loading ? (
                <Backdrop
                    sx={{
                        color: '#fff',
                        zIndex: (theme) => theme.zIndex.drawer + 1,
                    }}
                    open={true}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
            ) : ( */}
            <div className="datatable">
                <div className="datatableTitle">
                    Order
                    <div className="search">
                        <Paper component="form" sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}>
                            <InputBase sx={{ ml: 1, flex: 1 }} placeholder="Search ..." inputProps={{ 'aria-label': 'search google maps' }} onChange={handleChange} />
                            <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                                <SearchIcon />
                            </IconButton>
                            <Divider orientation="vertical" variant="middle" className="h-28px" />
                        </Paper>
                    </div>
                    <Link to="/users/new">
                        <Button variant="contained">Add New</Button>
                    </Link>
                </div>
                {/* <DataGrid className="datagrid" rows={search(data)} columns={orderColumns.concat(actionColumn)} pageSize={5} rowsPerPageOptions={[5]} checkboxSelection /> */}
                <div className="table-responsive">
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th scope="col">STT</th>
                                <th scope="col">Ngày mua</th>
                                <th scope="col">Sản phẩm</th>
                                <th scope="col">Người mua</th>
                                <th scope="col">Trạng thái đơn hàng</th>
                                <th scope="col">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data &&
                                displayPage.map((item: any, index: number) => (
                                    <tr key={index}>
                                        <th scope="row">{index + 1}</th>
                                        <td>{setDate(item.timeStamp.seconds)}</td>
                                        <td className="">
                                            {item.cartItems.map((item: CartItemsState, index: number) => (
                                                <div key={index} className="d-flex flex-colum ">
                                                    <img src={item.img[0].img} className="order__item-img" />
                                                    <p>{item.title}</p>
                                                </div>
                                            ))}
                                        </td>
                                        {/* <td>
                                            {item.cartItems.map((item: CartItemsState, index: number) => (
                                                <div key={index} className="d-flex flex-colum justify-content-between">
                                                    <p>{item.quantity}</p>
                                                </div>
                                            ))}
                                        </td> */}
                                        <td>
                                            <p>{item.name}</p>
                                        </td>

                                        <td>{ConvertStOrder(item.status)}</td>
                                        <td className="d-flex ">
                                            <Link to={`/order/${item.id}`} style={{ textDecoration: 'none' }}>
                                                <Button variant="contained" color="success">
                                                    View
                                                </Button>
                                            </Link>

                                            <Button variant="outlined" color="error" className="m-l-8" onClick={() => handleDelete(item.id)}>
                                                Delete
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                    <div className="d-flex flex-row">
                        <ReactPaginate pageCount={pageCount} onPageChange={changePage} previousLabel={'Prev'} nextLabel={'Next'} containerClassName=" paginationBttns " />
                    </div>
                </div>
            </div>
            {/* )} */}
        </>
    )
}

export default DatatableOrder
