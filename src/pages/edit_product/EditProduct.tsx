import './EditProduct.scss'
import Sidebar from '../../components/sidebar/Sidebar'
import Navbar from '../../components/navbar/Navbar'
import { CollectionReference, doc, DocumentData, DocumentReference, getDoc, updateDoc } from 'firebase/firestore'
import { db, storage } from '../../firebase/firebase'
import { ChangeEvent, SetStateAction, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import DriveFolderUploadOutlinedIcon from '@mui/icons-material/DriveFolderUploadOutlined'
import { useNavigate } from 'react-router-dom'
import { SubmitHandler, useForm } from 'react-hook-form'
import { ref, uploadBytesResumable, getDownloadURL, UploadTask } from 'firebase/storage'
import { Button } from '@mui/material'
import ConvertCategory from '../../components/ConvertCategory/ConvertCategory'

const EditUser = () => {
    let { state } = useLocation()
    interface ImgItem {
        img: string
    }
    interface DataDefault {
        img: ImgItem[]
        title: string
        description: string
        category: string
        price: string
        total: string
        file: any
    }
    // let data: Partial<DataDefault> = {};
    // let initialData: DataDefault = {
    //     img: '',
    //     fullname: '',
    //     username: '',
    //     price: '',
    //     category: '',
    //     password: '',
    //     total: 1,
    //     address: '',
    // }
    const [file, setFile] = useState<any[]>([])
    const [img, setImg] = useState<any[]>([])
    const [data, setData] = useState({
        img: [],
        title: '',
        file: '',
        description: '',
        category: '',
        price: '',
        total: '',
    } as DataDefault)

    const [error, setError] = useState(false)
    const [per, setPerc] = useState<number>()
    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormValues>({})
    const docRef = doc(db, 'products', state as string)

    useEffect(() => {
        const docSnap = async () => {
            await getDoc(docRef).then((docSnap) => {
                if (docSnap.exists()) {
                    setData({ ...docSnap.data() } as DataDefault)
                    setImg(({ ...docSnap.data() } as DataDefault).img)
                } else {
                    console.log('No such document!')
                }
            })
        }
        docSnap()
    }, [])

    useEffect(() => {
        const uploadFile = () => {
            file &&
                file.forEach((image) => {
                    const name = image && new Date().getTime() + image.name

                    const storageRef = image && ref(storage, image.name)
                    const uploadTask = (storageRef && image && uploadBytesResumable(storageRef, image)) as UploadTask

                    uploadTask &&
                        uploadTask.on(
                            'state_changed',
                            (snapshot: any) => {
                                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                                console.log('Upload is ' + progress + '% done')
                                setPerc(progress)
                                switch (snapshot.state) {
                                    case 'paused':
                                        console.log('Upload is paused')
                                        break
                                    case 'running':
                                        console.log('Upload is running')
                                        break
                                    default:
                                        break
                                }
                            },
                            (error: any) => {
                                console.log(error)
                            },
                            () => {
                                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                                    setImg((prev) => [...prev, { img: downloadURL }])
                                    setData((prev) => ({ ...prev, img: [...prev.img, { img: downloadURL }] }))
                                })
                            }
                        )
                })
        }
        file && uploadFile()
    }, [file])
    console.log('img', img)

    useEffect(() => {
        // reset form with user data
        reset({ ...data } as FormValues)
    }, [data])

    type FormValues = {
        file: string
        title: string
        description: string
        specification: string
        category: string
        price: string
        total: string
        img?: []
    }

    const handleAdd: SubmitHandler<FormValues> = async (data) => {
        const newData = { ...data, img: [...img] }
        console.log('newData', newData)
        try {
            await updateDoc(doc(db, 'products', state as string), {
                ...newData,
            })
            navigate(-1)
        } catch (err) {
            console.log(err)
            setError(true)
        }
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        for (let i = 0; i < e.target.files!.length; i++) {
            const newImage = e.target.files![i]
            setFile((prev) => [...prev, newImage])
        }
    }

    const handleDeleteImage = (id: any) => {
        setImg(img.filter((image, index) => index != id))
        // setFile(file.filter((image, index) => index != id ))
        setData({ ...data, img: [...img.filter((image, index) => index != id)] })
    }
    console.log(file)

    return (
        <div className="single">
            <Sidebar />
            <div className="singleContainer">
                <Navbar />
                <div className="bottom">
                    <div className="left d-flex flex-row justify-content-center">
                        {
                            data.img.length &&
                                data.img.map((image: any, index: any) => (
                                    <div key={index} className="d-flex flex-column m-l-8">
                                        <img style={{ width: 100, height: 100 }} src={image.img} alt="" />
                                        <button className="btn btn-outline-danger" onClick={() => handleDeleteImage(index)}>
                                            Xóa
                                        </button>
                                    </div>
                                ))
                            // <img src={file ? URL.createObjectURL(file as Blob | MediaSource) : data.img[0].img} alt="" />
                        }
                    </div>
                    <div className="right">
                        <form onSubmit={handleSubmit(handleAdd)}>
                            <div className="formInput-wrap d-flex flex-row flex-wrap">
                                <div className="input-group mb-3 p-3">
                                    <label htmlFor="file" className="input-group-text">
                                        Image: <DriveFolderUploadOutlinedIcon className="icon" />
                                    </label>
                                    <input multiple id="file" type="file" onChange={handleChange} className="form-control" />
                                </div>
                                <div className="formInput d-flex flex-column ">
                                    <label>Title</label>
                                    <input
                                        id="title"
                                        type="text"
                                        value={data.title}
                                        {...register('title', {
                                            onChange: (e) => setData((prev) => ({ ...prev, title: e.target.value })),
                                            required: 'Vui lòng nhập thông tin',
                                        })}
                                    />
                                    {errors.title && <p className="messages">{errors.title.message}</p>}
                                </div>

                                <div className="formInput d-flex flex-column">
                                    <label>Description</label>
                                    <textarea
                                        className=" min-height-100px"
                                        id="description"
                                        value={data.description}
                                        {...register('description', {
                                            onChange: (e) => setData((prev) => ({ ...prev, description: e.target.value })),
                                            required: 'Vui lòng nhập thông tin',
                                        })}
                                    ></textarea>
                                    {errors.description && <p className="messages">{errors.description.message}</p>}
                                </div>
                                <div className="formInput d-flex flex-column ">
                                    <label>Specification</label>
                                    <textarea
                                        className=" min-height-100px"
                                        id="specification"
                                        value={data.description}
                                        {...register('specification', {
                                            onChange: (e) => setData((prev) => ({ ...prev, specification: e.target.value })),
                                            required: 'Vui lòng nhập thông tin',
                                        })}
                                    ></textarea>
                                    {errors.specification && <p className="messages">{errors.specification.message}</p>}
                                </div>
                                <div className="formInput d-flex flex-column">
                                    <label>Category</label>
                                    <select
                                        id="category"
                                        value={ConvertCategory(data.category)}
                                        {...register('category', {
                                            required: 'Vui lòng nhập category',
                                            onChange: (e) => setData((prev) => ({ ...prev, category: e.target.value })),
                                        })}
                                    >
                                        <option value="">None</option>
                                        <option value="camera">Camera</option>
                                        <option value="phone">Điện thoại</option>
                                        <option value="laptop">Laptop</option>
                                        <option value="mouse">Chuột</option>
                                        <option value="displaycard">Cart màn hình</option>
                                        <option value="screen">Màn hình</option>
                                        <option value="keyboard">Bàn phím</option>
                                        <option value="harddrive">Ổ cứng</option>
                                    </select>
                                    {errors.category && <p className="messages">{errors.category.message}</p>}
                                </div>
                                <div className="formInput d-flex flex-column">
                                    <label>Price</label>
                                    <input
                                        id="price"
                                        type="text"
                                        value={data.price}
                                        {...register('price', {
                                            onChange: (e) => setData((prev) => ({ ...prev, price: e.target.value })),
                                            required: 'Vui lòng nhập ngày tháng năm sinh',
                                        })}
                                    />
                                    {errors.price && <p className="messages">{errors.price.message}</p>}
                                </div>

                                <div className="formInput d-flex flex-column">
                                    <label>Total</label>
                                    <input
                                        id="total"
                                        type="text"
                                        value={data.total}
                                        {...register('total', {
                                            required: 'Vui lòng nhập số điện thoại',
                                            onChange: (e) => setData((prev) => ({ ...prev, total: e.target.value })),
                                            pattern: {
                                                value: /\d+/,
                                                message: 'Vui lòng nhập số điện thoại ',
                                            },
                                        })}
                                    />
                                    {errors.total && <p className="messages">{errors.total.message}</p>}
                                </div>
                            </div>
                            {error && <p className="messageSubmit">Đã có tài khoản trên hệ thống</p>}
                            <Button disabled={per! < 100} type="submit" variant="contained">
                                Send
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditUser
