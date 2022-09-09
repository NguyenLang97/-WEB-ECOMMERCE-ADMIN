import { useState, useEffect } from 'react'
import { doc, setDoc, addDoc, collection, serverTimestamp, onSnapshot, getDoc, updateDoc } from 'firebase/firestore'
import { Button, Rating } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { styled } from '@mui/material/styles'
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress'

import './comment.scss'
import { db } from '../../firebase/firebase'

interface CommentUserState {
    commentTitle: string
    date: any
    idUser: string
    imgUser: string
    nameUser: string
    userRacting: number
}

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

const Comment = () => {
    const { productId } = useParams()
    console.log({ productId })
    const [reviewMsg, setReviewMsg] = useState('')
    const [data, setData] = useState<any>()
    const [ractingValue, setRactingValue] = useState(0)

    const docRef = doc(db, 'comment', productId as string)
    useEffect(() => {
        const docSnap = async () => {
            await getDoc(docRef).then((docSnap) => {
                if (docSnap.exists()) {
                    setData({ ...docSnap.data() })
                } else {
                    console.log('No such document!')
                }
            })
        }
        docSnap()
    }, [])

    function setDate(unixTime: number) {
        const date = new Date(unixTime * 1000)
        // console.log(date.toLocaleDateString('en-US'))
        return date.toLocaleDateString('en-US')
    }

    // console.log({ ractingValue })

    // //Tong so tat ca binh luan
    const rateTotals = data?.commentUser.length

    // // tim user danh gia sao >0
    const positiveStar = data?.commentUser.filter((star: any) => star.userRacting > 0)
    const numberStart = (number: number) => data?.commentUser.filter((star: CommentUserState) => star.userRacting === number).length
    console.log('1', numberStart(1))
    // const towStar = data?.commentUser.filter((star) => (star.userRacting = 2))

    //từ tù
    const starAvg = positiveStar?.reduce((totalStar: number, star: CommentUserState) => totalStar + star.userRacting, 0) / positiveStar?.length
    // console.log('1', typeof Math.floor(starAvg) == 'number' && Math.floor(starAvg) > 0)

    const rates = [1, 2, 3, 4, 5]
    console.log('data', data)

    const handleDelete = async (index: number) => {
        if (data) {
            data.commentUser.splice(index, 1)
            try {
                console.log('1aaa')

                await updateDoc(doc(db, 'comment', productId as string), {
                    commentUser: data.commentUser,
                })
            } catch (err) {
                console.log(err)

                // onmessage.error('Vui lòng xem lại số lượng trên hệ thống', 2)
            }
        }
        const docRef = doc(db, 'comment', productId as string)
        const docSnap = async () => {
            await getDoc(docRef).then((docSnap) => {
                if (docSnap.exists()) {
                    setData({ ...docSnap.data() })
                } else {
                    console.log('No such document!')
                }
            })
        }
        docSnap()
    }

    return (
        <div className="comment p-12">
            <div className=" d-flex align-items-center gap-5 py-3">
                <h6 className="rev">Review</h6>
            </div>
            {/* đánh giá tổng quan */}
            <div className="p-16">
                <h2 className="font-size-28px">Đánh giá</h2>
                <div className="overview d-flex p-tb-16">
                    {/* tổng kết */}
                    <div className="d-flex flex-column align-items-center bor-right">
                        <h3 className="font-size-32px">{starAvg.toFixed(1) === 'NaN' ? 0 : starAvg.toFixed(1)}</h3>
                        {/* <Rating  disabled defaultValue={Math.floor(starAvg)} */}

                        {typeof Math.floor(starAvg) == 'number' && Math.floor(starAvg) > 0 ? (
                            <Rating disabled style={{ fontSize: 14 }} className="d-flex p-12" value={Math.floor(starAvg)} />
                        ) : (
                            <Rating disabled style={{ fontSize: 14 }} className="d-flex p-12" value={0} />
                        )}

                        <p className="t-color-gray font-weight-500">{typeof rateTotals === 'undefined' ? 0 : rateTotals} nhận xét</p>
                    </div>
                    {/* chi tiết */}
                    <div className=" d-flex  flex-column p-lr-16">
                        {rates.map((item, index) => (
                            <div key={index} className="d-flex justify-content-between">
                                <Rating disabled defaultValue={item} className="d-flex m-l-8" style={{ fontSize: 14, flexBasis: 100 }} />

                                {positiveStar && <BorderLinearProgress variant="determinate" value={(numberStart(item) / positiveStar?.length) * 100} />}

                                <span className="m-l-8">{numberStart(item)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <form className="comment__form-group d-flex flex-wrap flex-row  mt-4">
                <div className="comment__review w-100 p-4">
                    {data?.commentUser !== undefined ? (
                        data?.commentUser.map((item: CommentUserState, index: number) => (
                            <div key={index} className="d-flex flex-column mt-3">
                                <div className="comment__user-wrap d-flex justify-content-between">
                                    <div className="comment__user review d-flex justify-content-between">
                                        <img src={item.imgUser} className="comment__user-img rounded-circle" />
                                        <p className="comment__user-name m-l-8 m-b-4">{item.nameUser}</p>
                                        <p className="comment__feedback-date m-b-4">{setDate(item.date.seconds)}</p>
                                    </div>
                                    <Button variant="outlined" color="error" onClick={() => handleDelete(index)}>
                                        Xóa
                                    </Button>
                                </div>
                                <Rating style={{ fontSize: 14 }} value={item.userRacting} disabled className="d-flex m-l-32 m-b-8" />
                                <p className="comment__feedback-text p-4x">{item.commentTitle}</p>
                            </div>
                        ))
                    ) : (
                        <>Chưa có câu hỏi, nhận xết nào</>
                    )}
                </div>
            </form>
        </div>
    )
}

export default Comment
