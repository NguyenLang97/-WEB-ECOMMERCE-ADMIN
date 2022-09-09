import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import HomeSharpIcon from '@mui/icons-material/HomeSharp'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import DescriptionIcon from '@mui/icons-material/Description'

import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { authLogout } from '../../redux/store/action/authAction'
import { handleDark, handleLight } from '../../redux/store/action/darkModeAction'
import './sidebar.scss'

const Sidebar = () => {
    const dispatch = useDispatch()
    const { i18n, t } = useTranslation(['sidebar'])

    //   const darkmode = useSelector<unknown | any>((state) => state.darkModeReducer.darkMode);
    const handleLogout = () => {
        dispatch(authLogout(''))
        console.log('dang xuat')
    }

    return (
        <div className="sidebar">
            <div className="top">
                <Link to="/" style={{ textDecoration: 'none' }}>
                    <span className="logo">{t('sidebar:admin')}</span>
                </Link>
            </div>
            <hr />
            <div className="center">
                <ul>
                    {/* <p className="title">MENU</p> */}
                    <Link to="/" style={{ textDecoration: 'none' }}>
                        <li>
                            <span>{t('sidebar:dashboard')}</span>
                            <HomeSharpIcon className="icon" />
                        </li>
                    </Link>
                    <Link to="/users" style={{ textDecoration: 'none' }}>
                        <li>
                            <span>{t('sidebar:customer')}</span>
                            <PersonOutlineIcon className="icon" />
                        </li>
                    </Link>
                    <Link to="/products" style={{ textDecoration: 'none' }}>
                        <li>
                            <span>{t('sidebar:products')}</span>
                            <CategoryRoundedIcon className="icon" />
                        </li>
                    </Link>
                    <Link to="/category" style={{ textDecoration: 'none' }}>
                        <li>
                            <span>{t('sidebar:category')}</span>
                            <DescriptionIcon className="icon" />
                        </li>
                    </Link>
                    <Link to="/order" style={{ textDecoration: 'none' }}>
                        <li>
                            <span>{t('sidebar:orders')}</span>
                            <CreditCardIcon className="icon" />
                        </li>
                    </Link>

                    <li>
                        <span>{t('sidebar:delivery')}</span>
                        <LocalShippingIcon className="icon" />
                    </li>

                    <li>
                        <span>{t('sidebar:notifications')}</span>
                        <NotificationsNoneIcon className="icon" />
                    </li>

                    {/* <li>
                        <span>{t('sidebar:profile')}</span>
                        <AccountCircleOutlinedIcon className="icon" />
                    </li> */}
                    <li onClick={handleLogout}>
                        <span>{t('sidebar:logout')}</span>
                        <ExitToAppIcon className="icon" />
                    </li>
                </ul>
            </div>
            {/* <div className="bottom">
                <div className="colorOption" onClick={() => dispatch(handleLight('false'))}></div>
                <div className="colorOption" onClick={() => dispatch(handleDark('true'))}></div>
            </div> */}
        </div>
    )
}

export default Sidebar
