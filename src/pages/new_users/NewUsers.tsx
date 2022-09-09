import './newusers.scss'
import Sidebar from '../../components/sidebar/Sidebar'
import Navbar from '../../components/navbar/Navbar'
import DriveFolderUploadOutlinedIcon from '@mui/icons-material/DriveFolderUploadOutlined'
import { useEffect, useState } from 'react'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { auth, db, storage } from '../../firebase/firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { useNavigate } from 'react-router-dom'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Backdrop, Button, CircularProgress } from '@mui/material'

const NewUsers = () => {
    const [file, setFile] = useState<File>()
    const [img, setImg] = useState({})
    const [per, setPerc] = useState<number>()
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
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
    type FormValues = {
        file: string
        fullname: string
        username: string
        yearofbirth: string
        email: string
        phone: number
        password: string
        address: string
    }

    const handleAdd: SubmitHandler<FormValues> = async (data) => {
        const dataNew = { ...data, ...img }
        setLoading(true)

        try {
            const res = await createUserWithEmailAndPassword(auth, dataNew.email, dataNew.password)
            await setDoc(doc(db, 'users', res.user.uid), {
                ...dataNew,
                timeStamp: serverTimestamp(),
            })
            navigate(-1)
        } catch (err) {
            console.log(err)
            setError(true)
        }
    }
    // type FormValue = {
    //     username: string,
    //     fullname: string,
    //     yearofbirth: string,
    //     phone: number,
    //     password: string,
    //     address: string,

    // }

    // const { register, handleSubmit, formState: {errors} } = useForm<FormValue>({});
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>({})

    return (
        <div className="new">
            <Sidebar />
            <div className="newContainer">
                <Navbar />
                <div className="top">
                    <h1>User</h1>
                </div>
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
                    <div className="bottom">
                        <div className="left">
                            <img src={file ? URL.createObjectURL(file) : 'https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg'} alt="" />
                        </div>
                        <div className="right">
                            <form onSubmit={handleSubmit(handleAdd)}>
                                <div className="formInput-wrap">
                                    <div className="formInput">
                                        <label htmlFor="file">
                                            Image: <DriveFolderUploadOutlinedIcon className="icon" />
                                        </label>
                                        <input multiple id="file" type="file" onChange={(e) => setFile(e.target.files![0])} style={{ display: 'none' }} />
                                        <p className="imageMessage">--Chọn ảnh nếu có--</p>
                                    </div>
                                    <div className="formInput">
                                        <label>Username</label>
                                        <input
                                            id="username"
                                            type="text"
                                            placeholder="vanlang"
                                            {...register('username', {
                                                required: 'Vui lòng nhập thông tin',
                                            })}
                                        />
                                        {errors.username && <p className="messages">{errors.username.message}</p>}
                                    </div>

                                    <div className="formInput">
                                        <label>Fullname</label>
                                        <input
                                            id="fullname"
                                            type="text"
                                            placeholder="Nguyễn Văn Lăng"
                                            {...register('fullname', {
                                                required: 'Vui lòng nhập thông tin',
                                            })}
                                        />
                                        {errors.fullname && <p className="messages">{errors.fullname.message}</p>}
                                    </div>
                                    <div className="formInput">
                                        <label>Email</label>
                                        <input
                                            id="email"
                                            type="mail"
                                            placeholder="nguyenvanlang1997@gmail.com"
                                            {...register('email', {
                                                required: 'Vui lòng nhập email',
                                                pattern: {
                                                    value: /^[a-zA-Z0-9]+@+[a-zA-Z0-9]+.+[A-z]/,
                                                    message: 'Vui lòng nhập email',
                                                },
                                            })}
                                        />
                                        {errors.email && <p className="messages">{errors.email.message}</p>}
                                    </div>
                                    <div className="formInput">
                                        <label>Year of Birth</label>
                                        <input
                                            id="yearofbirth"
                                            type="date"
                                            placeholder="01/01"
                                            {...register('yearofbirth', {
                                                required: 'Vui lòng nhập ngày tháng năm sinh',
                                            })}
                                        />
                                        {errors.yearofbirth && <p className="messages">{errors.yearofbirth.message}</p>}
                                    </div>

                                    <div className="formInput">
                                        <label>Phone</label>
                                        <input
                                            id="phone"
                                            type="text"
                                            placeholder="0986856852"
                                            {...register('phone', {
                                                required: 'Vui lòng nhập số điện thoại',
                                                pattern: {
                                                    value: /\d+/,
                                                    message: 'Vui lòng nhập số điện thoại ',
                                                },
                                            })}
                                        />
                                        {errors.phone && <p className="messages">{errors.phone.message}</p>}
                                    </div>
                                    <div className="formInput">
                                        <label>Password</label>
                                        <input
                                            id="password"
                                            type="text"
                                            placeholder="vanlang@123"
                                            {...register('password', {
                                                required: 'Vui lòng nhập mật khẩu',
                                                minLength: {
                                                    value: 6,
                                                    message: 'Vui lòng nhập 6 ký tự',
                                                },
                                            })}
                                        />
                                        {errors.password && <p className="messages">{errors.password.message}</p>}
                                    </div>
                                    <div className="formInput">
                                        <label>Address</label>
                                        <input
                                            id="address"
                                            type="text"
                                            placeholder="Cầu Giấy, Hà Nội"
                                            {...register('address', {
                                                required: 'Vui lòng nhập địa chỉ',
                                            })}
                                        />
                                        {errors.address && <p className="messages">{errors.address.message}</p>}
                                    </div>
                                </div>
                                {error && <p className="messageSubmit">Đã có tài khoản trên hệ thống</p>}
                                <Button disabled={per! < 100} type="submit" variant="contained">
                                    Send
                                </Button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default NewUsers
