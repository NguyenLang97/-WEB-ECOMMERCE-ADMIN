import './profile_order.scss'
import Sidebar from '../../components/sidebar/Sidebar'
import Navbar from '../../components/navbar/Navbar'
import DatatableProducts from '../../components/datatable_products/DatatableProducts'
import { Link, useParams } from 'react-router-dom'
import { Alert, Button } from '@mui/material'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '../../firebase/firebase'
import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining'
import FavoriteIcon from '@mui/icons-material/Favorite'

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 10,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
        backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
    },
    [`& .${linearProgressClasses.bar}`]: {
        borderRadius: 5,
        backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
    },
}))

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

interface DataOrderState {
    id: string
    address: string
    cartItems: any[]
    email: string
    name: string
    phone: string
    status: string
    totalPrice: number
    timeStamp: any
    totalAmountOrder: number
    totalStock: number
    userId: string
}

const ListProducts = () => {
    const { orderId } = useParams()
    const [data, setData] = useState<DataOrderState>()
    const [status, setStatus] = useState('')

    const docRef = doc(db, 'order', orderId as string)

    useEffect(() => {
        const docSnap = async () => {
            await getDoc(docRef).then((docSnap) => {
                if (docSnap.exists()) {
                    console.log('Document data:', docSnap.data())
                    setData({ ...docSnap.data() } as any)
                    setStatus(docSnap.data().status)
                } else {
                    console.log('No such document!')
                }
            })
        }
        docSnap()
    }, [])

    function setDate(ts: number) {
        // console.log(date.toLocaleDateString('en-US'))

        // convert unix timestamp to milliseconds
        const tsMs = ts * 1000

        // initialize new Date object
        const dateOb = new Date(tsMs)

        // year as 4 digits (YYYY)
        const year = dateOb.getFullYear()

        // month as 2 digits (MM)
        const month = ('0' + (dateOb.getMonth() + 1)).slice(-2)

        // date as 2 digits (DD)
        const date = ('0' + dateOb.getDate()).slice(-2)

        // hours as 2 digits (hh)
        const hours = ('0' + dateOb.getHours()).slice(-2)

        // minutes as 2 digits (mm)
        const minutes = ('0' + dateOb.getMinutes()).slice(-2)

        // seconds as 2 digits (ss)
        const seconds = ('0' + dateOb.getSeconds()).slice(-2)

        // date & time as YYYY-MM-DD hh:mm:ss format:
        const timeStamp = 'Ngày ' + date + ' Tháng ' + month + ' Năm ' + year + ', Giờ ' + hours + ':' + minutes + ':' + seconds

        return timeStamp
    }

    const handleChange = async (e: any) => {
        console.log(e.target.value)
        setStatus(e.target.value)
        try {
            await updateDoc(doc(db, 'order', orderId as string), {
                status: e.target.value,
            })
        } catch (err) {
            ;<Alert variant="outlined" severity="error">
                This is an error alert — check it out!
            </Alert>
        }
    }

    const checkStatus: (x: string) => number = (status: string): number => {
        switch (status) {
            case 'Success':
                return 0

            case 'Delivery':
                return 50

            case 'Confirm':
                return 100

            default:
                return 0
        }
    }
    console.log('re-render')

    return (
        <div className="datatable">
            <div className="datatableTitle d-flex">
                Profile Order
                {data && (
                    <select className="form-select w-auto" aria-label="" value={status || data.status} onChange={handleChange}>
                        {}
                        <option value="Success" disabled={status === 'Delivery' || status === 'Confirm'}>
                            Đặt hàng thành công
                        </option>
                        <option value="Delivery" disabled={status === 'Confirm'}>
                            Giao hàng
                        </option>
                        <option value="Confirm">Đã nhận</option>
                    </select>
                )}
            </div>
            <div className="d-flex flex-column justify-content-center m-y-40 p-50">
                <BorderLinearProgress variant="determinate" value={checkStatus(status)} />
                <div className="d-flex justify-content-between">
                    <ShoppingCartIcon style={{ color: 'blue' }} />
                    <DeliveryDiningIcon style={{ color: 'blue' }} />
                    <FavoriteIcon style={{ color: 'red' }} />
                </div>
            </div>
            <div className="list">
                <Sidebar />
                <div className="listContainer">
                    <Navbar />
                    {data && (
                        <div className="table-responsive ">
                            <div className="d-flex flex-row justify-content-between">
                                <div>
                                    <h4>Thông tin người nhận</h4>
                                    <p>
                                        Người mua : <span>{data.name}</span>
                                    </p>
                                    <p>
                                        Số điện thoại : <span>{data.phone}</span>
                                    </p>

                                    <p>
                                        Email : <span>{data.email}</span>
                                    </p>
                                    <p>
                                        Ngày mua hàng : <span>{setDate(data.timeStamp.seconds)}</span>
                                    </p>
                                </div>
                                <div>
                                    <h4>Địa chỉ giao hàng</h4>
                                    <p>
                                        Địa chỉ : <span>{data.address}</span>
                                    </p>
                                </div>
                            </div>

                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th scope="col">STT</th>
                                        <th scope="col">Hình ảnh</th>
                                        <th scope="col">Sản phẩm</th>
                                        <th scope="col">Số lượng</th>
                                        <th scope="col">Đơn giá</th>
                                        <th scope="col">Tổng tiền</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.cartItems.map((item: CartItemsState, index: number) => (
                                        <tr key={index}>
                                            <th scope="row">{index + 1}</th>
                                            <td>
                                                <div key={index} className="d-flex flex-colum ">
                                                    <img src={item.img[0].img} className="order__item-img" />
                                                </div>
                                            </td>
                                            <td>
                                                <p>{item.title}</p>
                                            </td>
                                            <td>
                                                <div key={index} className="d-flex flex-colum justify-content-between">
                                                    <p>{item.quantity}</p>
                                                </div>
                                            </td>
                                            <td>{item.price}</td>
                                            <td>{item.totalPrice}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="d-flex justify-content-end">
                                <div className="">
                                    <p>
                                        Phí vận chuyển : <span>$ 30</span>
                                    </p>
                                    <h5>
                                        Tổng tiền : <span>$ {data.totalAmountOrder}</span>
                                    </h5>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ListProducts
