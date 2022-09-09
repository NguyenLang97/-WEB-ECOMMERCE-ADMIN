import './ProfileProduct.scss'
import Sidebar from '../../components/sidebar/Sidebar'
import Navbar from '../../components/navbar/Navbar'
import List from '../../components/table/Table'
import { useParams } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db, storage } from '../../firebase/firebase'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { array } from 'yup'
import { Grid } from '@mui/material'
import Comment from '../../components/comment/Comment'
import ConvertCategory from '../../components/ConvertCategory/ConvertCategory'

const ProfileUser = () => {
    const [previewImg, setPreviewImg] = useState()
    const navigate = useNavigate()
    interface DataDefault {
        img: any[]
        title: string
        file: string
        specification: string
        description: string
        category: string
        price: string
        total: string
    }

    // let data: Partial<DataDefault> = {};
    let initialData: DataDefault = {
        img: [],
        title: '',
        file: '',
        specification: '',
        description: '',
        category: '',
        price: '',
        total: '',
    }

    const [data, setData] = useState(initialData)
    const { productId } = useParams()
    const docRef = doc(db, 'products', productId as string)
    console.log('data', data.img)

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
        navigate('/products/edit', { state: id })
    }
    // const handleDeleteImage = (id: any) => {
    //     setData(prev => {...prev,(data.img.filter((image, index) => index != id))})
    // }
    console.log('1', data.description)

    return (
        <div className="single">
            <Sidebar />
            <div className="singleContainer">
                <Navbar />
                <div className="top">
                    <h1 className="title">Information</h1>
                    <div className="left p-3">
                        {data.img.length > 0 && (
                            <div className="d-flex ">
                                <div className="wrap-itemImg">
                                    <div className="product__lits-img">
                                        <div className="product__main-img d-flex justify-content-center">
                                            <img src={previewImg || data.img[0].img} alt="" style={{ width: 160, height: 160 }} className=" bor-rad-8" />
                                        </div>
                                        <div className="product__images d-flex flex-row mt-4">
                                            {data.img.map((item: any, index: number) => (
                                                <div key={index} className="catalog-item bor-rad-8 mb-3" onClick={() => setPreviewImg(item.img)}>
                                                    <img style={{ width: 60, height: 60 }} src={item.img} alt="" className="img__item bor-rad-8" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    {/* {data.img.length > 0 ? (
                                    data.img.map((image: any, index: any) => (
                                        <>
                                            <img style={{ width: 150, height: 150 }} key={index} src={image.img} alt="" />
                                        </>
                                    ))
                                ) : (
                                    <img src={'https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg'} alt="" />
                                )} */}
                                </div>
                                <div className="details m-l-8 ">
                                    <h2 className="itemTitle">{data.title}</h2>
                                    <div className="detailItem">
                                        <span className="itemKey t-color-secondary">Category: </span>
                                        <span className="itemValue">{ConvertCategory(data.category)}</span>
                                    </div>
                                    <div className="detailItem">
                                        <span className="itemKey t-color-secondary">Specification: </span>
                                        <pre className="itemValue">{data.specification}</pre>
                                    </div>
                                    <div className="detailItem">
                                        <span className="itemKey t-color-secondary">Description: </span>
                                        <pre className="itemValue white-space-initial">{data.description}</pre>
                                    </div>
                                    <div className="detailItem">
                                        <span className="itemKey t-color-secondary">Price: </span>
                                        <span className="itemValue">{data.price}</span>
                                    </div>
                                    <div className="detailItem">
                                        <span className="itemKey ">Total: </span>
                                        <span className="itemValue">{data.total}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <Comment />
                    <div className="editButton" onClick={() => handleEditUser(productId)}>
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
