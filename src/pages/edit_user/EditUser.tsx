import './EditUser.scss'
import Sidebar from '../../components/sidebar/Sidebar'
import Navbar from '../../components/navbar/Navbar'
import { CollectionReference, doc, DocumentData, DocumentReference, getDoc, updateDoc } from 'firebase/firestore'
import { db, storage } from '../../firebase/firebase'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import DriveFolderUploadOutlinedIcon from '@mui/icons-material/DriveFolderUploadOutlined'
import { useNavigate } from 'react-router-dom'
import { SubmitHandler, useForm } from 'react-hook-form'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { Button } from '@mui/material'

const EditUser = () => {
    let { state } = useLocation()
    interface DataDefault {
        img: string
        fullname: string
        username: string
        yearofbirth: string
        email: string
        phone: number
        password: string
        address: string
        file: any
    }
    // let data: Partial<DataDefault> = {};
    // let initialData: DataDefault = {
    //     img: '',
    //     fullname: '',
    //     username: '',
    //     yearofbirth: '',
    //     email: '',
    //     password: '',
    //     phone: 1,
    //     address: '',
    // }
    const [file, setFile] = useState<File>()
    const [img, setImg] = useState({})
    const [data, setData] = useState({
        img: '',
        fullname: '',
        username: '',
        yearofbirth: '',
        email: '',
        password: '',
        phone: 1,
        address: '',
        file: '',
    })
    const [error, setError] = useState(false)
    const [per, setPerc] = useState<number>()
    const navigate = useNavigate()

    const docRef = doc(db, 'users', state as string)
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormValues>({})

    useEffect(() => {
        const docSnap = async () => {
            await getDoc(docRef).then((docSnap) => {
                if (docSnap.exists()) {
                    setData({ ...docSnap.data() } as DataDefault)
                } else {
                    console.log('No such document!')
                }
            })
        }
        docSnap()

        const uploadFile = () => {
            const name = file && new Date().getTime() + file.name
            console.log(name)
            const storageRef = file && ref(storage, file.name)
            const uploadTask = storageRef && file && uploadBytesResumable(storageRef, file)

            uploadTask &&
                uploadTask.on(
                    'state_changed',
                    (snapshot) => {
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
                    (error) => {
                        console.log(error)
                    },
                    () => {
                        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                            setImg((prev) => ({
                                ...prev,
                                img: downloadURL,
                            }))
                        })
                    }
                )
        }
        file && uploadFile()
    }, [file])

    useEffect(() => {
        // reset form with user data
        reset(data)
    }, [data])

    type FormValues = {
        file: string
        fullname: string
        username: string
        yearofbirth: string
        email: string
        phone: number
        password: string
        address: string
        img?: string
    }

    const handleAdd: SubmitHandler<FormValues> = async (data) => {
        const newData = { ...data, ...img }
        console.log(newData)
        try {
            await updateDoc(doc(db, 'users', state as string), {
                ...newData,
            })
            navigate(-1)
        } catch (err) {
            console.log(err)
            setError(true)
        }
    }

    console.log(data)

    return (
        <div className="single">
            <Sidebar />
            <div className="singleContainer">
                <Navbar />
                <div className="bottom ">
                    <div className="left d-flex flex-column justify-content-center text-center">
                        {file ? (
                            <div className="d-flex justify-content-center">
                                <img style={{ width: 120, height: 120, borderRadius: 60, margin: 'auto' }} src={URL.createObjectURL(file as Blob | MediaSource)} alt="" />
                            </div>
                        ) : (
                            <div className="d-flex justify-content-center">
                                <img
                                    style={{ width: 120, height: 120, borderRadius: 60 }}
                                    src={data.img ? data.img : 'https://thumbs.dreamstime.com/b/default-avatar-profile-trendy-style-social-media-user-icon-187599373.jpg'}
                                    alt=""
                                />
                            </div>
                        )}
                        <p className="imageMessage">--Chọn ảnh nếu có--</p>

                        {/* <img style={{ width: 100, height: 100 }} src={file ? URL.createObjectURL(file as Blob | MediaSource) : data.img} alt="" /> */}
                    </div>
                    <div className="right">
                        <form onSubmit={handleSubmit(handleAdd)} className="d-flex justify-content-center flex-column">
                            <div className="formInput-wrap d-flex flex-row flex-wrap">
                                <div className="input-group mb-3 p-3">
                                    <label htmlFor="file" className="input-group-text">
                                        Image: <DriveFolderUploadOutlinedIcon className="icon" />
                                    </label>
                                    <input
                                        id="file"
                                        type="file"
                                        className="form-control"
                                        onChange={(e) => {
                                            setFile(e.target.files![0])
                                        }}
                                    />
                                </div>
                                {/* <p className="imageMessage">--Chọn ảnh nếu có--</p> */}

                                <div className="formInput  d-flex flex-column">
                                    <label>Username</label>
                                    <input
                                        id="username"
                                        type="text"
                                        value={data.username}
                                        {...register('username', {
                                            onChange: (e) => setData((prev) => ({ ...prev, username: e.target.value })),
                                            required: 'Vui lòng nhập thông tin',
                                        })}
                                    />
                                    {errors.username && <p className="messages">{errors.username.message}</p>}
                                </div>

                                <div className="formInput d-flex flex-column">
                                    <label>Fullname</label>
                                    <input
                                        id="fullname"
                                        type="text"
                                        value={data.fullname}
                                        {...register('fullname', {
                                            onChange: (e) => setData((prev) => ({ ...prev, fullname: e.target.value })),
                                            required: 'Vui lòng nhập thông tin',
                                        })}
                                    />
                                    {errors.fullname && <p className="messages">{errors.fullname.message}</p>}
                                </div>
                                <div className="formInput d-flex flex-column">
                                    <label>Email</label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        {...register('email', {
                                            required: 'Vui lòng nhập email',
                                            onChange: (e) => setData((prev) => ({ ...prev, email: e.target.value })),
                                            pattern: {
                                                value: /^[a-zA-Z0-9]+@+[a-zA-Z0-9]+.+[A-z]/,
                                                message: 'Vui lòng nhập email',
                                            },
                                        })}
                                    />
                                    {errors.email && <p className="messages">{errors.email.message}</p>}
                                </div>
                                <div className="formInput d-flex flex-column">
                                    <label>Year of Birth</label>
                                    <input
                                        id="yearofbirth"
                                        type="date"
                                        value={data.yearofbirth}
                                        {...register('yearofbirth', {
                                            onChange: (e) => setData((prev) => ({ ...prev, yearofbirth: e.target.value })),
                                            required: 'Vui lòng nhập ngày tháng năm sinh',
                                        })}
                                    />
                                    {errors.yearofbirth && <p className="messages">{errors.yearofbirth.message}</p>}
                                </div>

                                <div className="formInput d-flex flex-column">
                                    <label>Phone</label>
                                    <input
                                        id="phone"
                                        type="text"
                                        value={data.phone}
                                        {...register('phone', {
                                            required: 'Vui lòng nhập số điện thoại',
                                            onChange: (e) => setData((prev) => ({ ...prev, phone: e.target.value })),
                                            pattern: {
                                                value: /\d+/,
                                                message: 'Vui lòng nhập số điện thoại ',
                                            },
                                        })}
                                    />
                                    {errors.phone && <p className="messages">{errors.phone.message}</p>}
                                </div>
                                <div className="formInput d-flex flex-column">
                                    <label>Password</label>
                                    <input
                                        id="password"
                                        type="text"
                                        value={data.password}
                                        {...register('password', {
                                            required: 'Vui lòng nhập mật khẩu',
                                            onChange: (e) => setData((prev) => ({ ...prev, password: e.target.value })),
                                            minLength: {
                                                value: 6,
                                                message: 'Vui lòng nhập 6 ký tự',
                                            },
                                        })}
                                    />
                                    {errors.password && <p className="messages">{errors.password.message}</p>}
                                </div>
                                <div className="formInput d-flex flex-column">
                                    <label>Address</label>
                                    <input
                                        id="address"
                                        type="text"
                                        value={data.address}
                                        {...register('address', {
                                            onChange: (e) => setData((prev) => ({ ...prev, address: e.target.value })),
                                            required: 'Vui lòng nhập địa chỉ',
                                        })}
                                    />
                                    {errors.address && <p className="messages">{errors.address.message}</p>}
                                </div>
                            </div>
                            {error && <p className="messageSubmit">Đã có tài khoản trên hệ thống</p>}
                            <Button disabled={per! < 100} type="submit" variant="contained" className="">
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
