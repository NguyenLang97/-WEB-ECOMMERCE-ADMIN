import './ProfileUser.scss'
import Sidebar from '../../components/sidebar/Sidebar'
import Navbar from '../../components/navbar/Navbar'
import List from '../../components/table/Table'
import { useParams } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db, storage } from '../../firebase/firebase'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const ProfileUser = () => {
    const navigate = useNavigate()
    interface DataDefault {
        img: string
        fullname: string
        username: string
        yearofbirth: string
        email: string
        phone: number
        password: string
        address: string
    }

    // let data: Partial<DataDefault> = {};
    let initialData: DataDefault = {
        img: '',
        fullname: '',
        username: '',
        yearofbirth: '',
        email: '',
        password: '',
        phone: 123456789,
        address: '',
    }

    const [data, setData] = useState(initialData)
    const { userId } = useParams()
    const docRef = doc(db, 'users', userId as string)
    useEffect(() => {
        const docSnap = async () => {
            await getDoc(docRef).then((docSnap) => {
                if (docSnap.exists()) {
                    console.log('Document data:', docSnap.data())
                    setData({ ...docSnap.data() } as DataDefault)
                } else {
                    console.log('No such document!')
                }
            })
        }
        docSnap()
    }, [])

    const handleEditUser = (id: any) => {
        console.log(id)
        navigate('/users/edit', { state: id })
    }

    return (
        <div className="single">
            <Sidebar />
            <div className="singleContainer">
                <Navbar />
                <div className="top ">
                    <div className="left p-2">
                        <h1 className="title">Information</h1>
                        <div className="item">
                            <div className="wrap-itemImg">
                                <img
                                    src={data.img ? data.img : 'https://thumbs.dreamstime.com/b/default-avatar-profile-trendy-style-social-media-user-icon-187599373.jpg'}
                                    alt=""
                                    className="itemImg"
                                    style={{ width: 100, height: 100 }}
                                />
                            </div>
                            <div className="details">
                                <h1 className="itemTitle">{data.fullname}</h1>
                                <div className="detailItem">
                                    <span className="itemKey">Email:</span>
                                    <span className="itemValue">{data.email}</span>
                                </div>
                                <div className="detailItem">
                                    <span className="itemKey">Password:</span>
                                    <span className="itemValue">{data.password}</span>
                                </div>
                                <div className="detailItem">
                                    <span className="itemKey">Phone:</span>
                                    <span className="itemValue">{data.phone}</span>
                                </div>
                                <div className="detailItem">
                                    <span className="itemKey">Year of Birth:</span>
                                    <span className="itemValue">{data.yearofbirth}</span>
                                </div>
                                <div className="detailItem">
                                    <span className="itemKey">Address:</span>
                                    <span className="itemValue">{data.address}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="editButton" onClick={() => handleEditUser(userId)}>
                        Edit
                    </div>
                    {/* <div className="right">
                        <Chart aspect={3 / 1} title="User Spending ( Last 6 Months)" />
                    </div> */}
                </div>
                <div className="bottom">
                    <h1 className="title">Last Transactions</h1>
                    <List />
                </div>
            </div>
        </div>
    )
}

export default ProfileUser
