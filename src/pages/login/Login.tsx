import { useState, useEffect } from 'react'
import './login.scss'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../firebase/firebase'
import { useNavigate } from 'react-router-dom'
import { authLogin } from '../../redux/store/action/authAction'
import { useSelector, useDispatch } from 'react-redux/es/exports'
import { SubmitHandler, useForm } from 'react-hook-form'

const Login = () => {
    const [error, setError] = useState(false)
    // const [email, setEmail] = useState('');
    // const [password, setPassword] = useState('');
    const navigate = useNavigate()
    const dispatch = useDispatch()
    interface RootState {
        authReducer: boolean
    }
    type FormValues = {
        email: string
        password: string
    }

    interface Info {
        id: string
        name?: string | number
        address: string
    }

    const state: any = useSelector<RootState>((state) => state.authReducer)

    const handleLogin: SubmitHandler<FormValues> = async (data) => {
        console.log(data)
        // e.preventDefault();
        await signInWithEmailAndPassword(auth, data.email, data.password)
            .then((userCredential) => {
                const user = userCredential.user
                console.log(user)
                dispatch(authLogin(user))
                navigate('/')
            })
            .catch((error) => {
                console.log(error)
                setError(true)
            })
    }
    useEffect(() => {
        localStorage.setItem('user', JSON.stringify(state.currentUser))
    }, [state.currentUser])

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>()

    return (
        <div className="login">
            <form onSubmit={handleSubmit(handleLogin)}>
                <h1>ADMIN LOGIN</h1>
                <input
                    id="email"
                    type="email"
                    placeholder="Email"
                    // onChange={(e) => setEmail(e.target.value)}
                    {...register('email', {
                        required: 'Vui lòng nhập email',
                    })}
                />
                {errors.email && <p className="messages">{errors.email.message}</p>}

                <input
                    type="password"
                    placeholder="Password"
                    // onChange={(e) => setPassword(e.target.value)}
                    {...register('password', {
                        required: 'Vui lòng nhập mật khẩu',
                    })}
                />
                {errors.password && <p className="messages">{errors.password.message}</p>}
                {error && <span>Tài khoản mật khẩu không đúng</span>}
                <button type="submit">Login</button>
            </form>
        </div>
    )
}

export default Login
