import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined'
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { db } from '../../firebase/firebase'
import './widget.scss'

interface WidgetProps {
    type: string
}

const Widget = ({ type }: WidgetProps) => {
    const [amount, setAmount] = useState<number | null>(null)
    const [diff, setDiff] = useState<number | null>(null)

    interface DataDefault {
        title: string
        isMoney?: boolean
        link: string
        query?: string
        icon: JSX.Element
    }

    // let data: Partial<DataDefault> = {};
    let data: DataDefault = { title: '', isMoney: false, link: '', query: '', icon: <></> }

    switch (type) {
        case 'users':
            data = {
                title: 'USERS',
                isMoney: false,
                link: 'See all users',
                query: 'users',
                icon: (
                    <PersonOutlinedIcon
                        className="icon"
                        style={{
                            color: 'crimson',
                            backgroundColor: 'rgba(255, 0, 0, 0.2)',
                        }}
                    />
                ),
            }
            break
        case 'order':
            data = {
                title: 'ORDERS',
                isMoney: false,
                query: 'order',
                link: 'View all orders',
                icon: (
                    <ShoppingCartOutlinedIcon
                        className="icon"
                        style={{
                            backgroundColor: 'rgba(218, 165, 32, 0.2)',
                            color: 'goldenrod',
                        }}
                    />
                ),
            }
            break
        case 'earning':
            data = {
                title: 'EARNINGS',
                isMoney: true,
                link: 'View net earnings',
                icon: <MonetizationOnOutlinedIcon className="icon" style={{ backgroundColor: 'rgba(0, 128, 0, 0.2)', color: 'green' }} />,
            }
            break
        case 'products':
            data = {
                title: 'PRODUCTS',
                query: 'products',
                link: 'See details',
                icon: (
                    <AccountBalanceWalletOutlinedIcon
                        className="icon"
                        style={{
                            backgroundColor: 'rgba(128, 0, 128, 0.2)',
                            color: 'purple',
                        }}
                    />
                ),
            }
            break
        default:
            break
    }

    useEffect(() => {
        const fetchData = async () => {
            const today = new Date()
            const lastMonth = new Date(new Date().setMonth(today.getMonth() - 1))
            const prevMonth = new Date(new Date().setMonth(today.getMonth() - 2))

            const lastMonthQuery = query(collection(db, data.query!), where('timeStamp', '<=', today), where('timeStamp', '>', lastMonth))

            const prevMonthQuery = query(collection(db, data.query!), where('timeStamp', '<=', lastMonth), where('timeStamp', '>', prevMonth))
            const lastMonthData = await getDocs(lastMonthQuery)
            const prevMonthData = await getDocs(prevMonthQuery)

            setAmount(lastMonthData.docs.length)
            setDiff(((lastMonthData.docs.length - prevMonthData.docs.length) / (prevMonthData.docs.length ? prevMonthData.docs.length : 1)) * 100)
        }
        fetchData()
    }, [])

    return (
        <div className="widget">
            <i></i>
            <div className="left">
                <span className="title">{data.title}</span>
                <span className="counter">
                    {data.isMoney && '$'} {amount}
                </span>
                <Link to={`/${data.query}`} className="link">
                    {data.link}
                </Link>
            </div>
            <div className="right">
                <div className={`percentage ${diff! < 0 ? 'negative' : 'positive'}`}>
                    {diff! < 0 ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
                    {diff} %
                </div>
                {data.icon}
            </div>
        </div>
    )
}

export default Widget
