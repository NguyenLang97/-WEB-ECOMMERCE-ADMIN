import './newproducts.scss'
import Sidebar from '../../components/sidebar/Sidebar'
import Navbar from '../../components/navbar/Navbar'
import DriveFolderUploadOutlinedIcon from '@mui/icons-material/DriveFolderUploadOutlined'
import { useEffect, useState, ChangeEvent } from 'react'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db, storage } from '../../firebase/firebase'
// import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, uploadBytesResumable, getDownloadURL, UploadTask } from 'firebase/storage'
import { useNavigate } from 'react-router-dom'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Backdrop, Button, CircularProgress } from '@mui/material'

const NewProducts = () => {
    const [file, setFile] = useState<any[]>([])
    const [img, setImg] = useState<any[]>([])
    const [per, setPerc] = useState<null | number>(null)
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    console.log(file)

    useEffect(() => {
        const uploadFile = () => {
            file.forEach((image) => {
                const name = image && new Date().getTime() + image.name

                const storageRef = image && ref(storage, image.name)
                const uploadTask = (storageRef && image && uploadBytesResumable(storageRef, image)) as UploadTask

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
                                setImg((prev) => [...prev, { img: downloadURL }])
                            })
                        }
                    )
            })
        }
        file && uploadFile()
    }, [file])
    type FormValues = {
        title: string
        file: string
        description: string
        category: string
        price: string
        email: string
        total: string
        specification: string
    }

    const handleAdd: SubmitHandler<FormValues> = async (data) => {
        const dataNew = { ...data, img: [...img] }
        console.log(dataNew)
        console.log(img)
        setLoading(true)

        try {
            await addDoc(collection(db, 'products'), {
                ...dataNew,
                timeStamp: serverTimestamp(),
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
        setFile(file.filter((image, index) => index != id))
    }

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>()

    return (
        <div className="new">
            <Sidebar />
            <div className="newContainer">
                <Navbar />
                <div className="top d-flex flex-row ">
                    <h1>Products</h1>
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
                        <div className="left d-flex flex-row justify-content-center">
                            {file.length > 0 ? (
                                file.map((image, index) => (
                                    <div key={index} className="d-flex flex-column m-l-8">
                                        <img src={URL.createObjectURL(image)} alt="" />
                                        <button className="btn btn-outline-danger" onClick={() => handleDeleteImage(index)}>
                                            X??a
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <img src={'https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg'} alt="" />
                            )}
                        </div>
                        <div className="right">
                            <form onSubmit={handleSubmit(handleAdd)}>
                                <div className="formInput-wrap">
                                    <div className="input-group mb-3 p-3">
                                        <label htmlFor="file" className="input-group-text">
                                            Image: <DriveFolderUploadOutlinedIcon className="icon" />
                                        </label>
                                        <input
                                            multiple
                                            id="file"
                                            type="file"
                                            className="form-control"
                                            onChange={handleChange}
                                            // {...register('file', {
                                            //     required: 'Vui l??ng ch???n ???nh s???n ph???m',
                                            // })}
                                        />
                                        {/* {errors.file && (
                                        <p className="messages">{errors.file.message}</p>
                                    )} */}
                                    </div>
                                    <div className="formInput">
                                        <label>Product name</label>
                                        <input
                                            id="title"
                                            type="text"
                                            placeholder="Apple Macbook Pro"
                                            {...register('title', {
                                                required: 'Vui l??ng nh???p t??n s???n ph???m',
                                            })}
                                        />
                                        {errors.title && <p className="messages">{errors.title.message}</p>}
                                    </div>

                                    <div className="formInput">
                                        <label>Description</label>
                                        <textarea
                                            id="description"
                                            placeholder="Description"
                                            {...register('description', {
                                                required: 'Vui l??ng nh???p th??ng tin chi ti???t s???n ph??m',
                                            })}
                                        ></textarea>
                                        {errors.description && <p className="messages">{errors.description.message}</p>}
                                    </div>
                                    <div className="formInput">
                                        <label>Specification</label>
                                        <textarea
                                            id="specification"
                                            placeholder="Specification"
                                            {...register('specification', {
                                                required: 'Vui l??ng nh???p th??ng s??? k??? thu???t s???n ph??m',
                                            })}
                                        ></textarea>
                                        {errors.specification && <p className="messages">{errors.specification.message}</p>}
                                    </div>

                                    <div className="formInput">
                                        <label>Category</label>
                                        <select
                                            id="category"
                                            {...register('category', {
                                                required: 'Vui l??ng ch???n lo???i',
                                            })}
                                        >
                                            <option value="">None</option>
                                            <option value="camera">Camera</option>
                                            <option value="phone">??i???n tho???i</option>
                                            <option value="laptop">Laptop</option>
                                            <option value="mouse">Chu???t</option>
                                            <option value="displaycard">Cart m??n h??nh</option>
                                            <option value="screen">M??n h??nh</option>
                                            <option value="keyboard">B??n ph??m</option>
                                            <option value="harddrive">??? c???ng</option>
                                        </select>
                                        {errors.category && <p className="messages">{errors.category.message}</p>}
                                    </div>
                                    <div className="formInput">
                                        <label>Price</label>
                                        <input
                                            id="price"
                                            type="text"
                                            placeholder="1000000VND"
                                            {...register('price', {
                                                required: 'Vui l??ng nh???p gi??',
                                                pattern: {
                                                    value: /\d+/,
                                                    message: 'Vui l??ng nh???p gi??',
                                                },
                                            })}
                                        />
                                        {errors.price && <p className="messages">{errors.price.message}</p>}
                                    </div>
                                    <div className="formInput">
                                        <label>Total In Store</label>
                                        <input
                                            id="total"
                                            type="text"
                                            placeholder="180"
                                            {...register('total', {
                                                required: 'Vui l??ng nh???p t???ng s??? l?????ng',
                                                pattern: {
                                                    value: /\d+/,
                                                    message: 'Vui l??ng nh???p t???ng s??? l?????ng',
                                                },
                                            })}
                                        />
                                        {errors.total && <p className="messages">{errors.total.message}</p>}
                                    </div>
                                </div>
                                {error && <p className="messageSubmit">???? c?? s???n ph???m tr??n h??? th???ng</p>}
                                <Button disabled={per !== null && per < 100} type="submit" variant="contained">
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

export default NewProducts
