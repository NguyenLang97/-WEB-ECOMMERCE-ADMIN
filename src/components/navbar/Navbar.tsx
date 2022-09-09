import './navbar.scss'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined'
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined'
import { useDispatch } from 'react-redux'
import { handleToggle } from '../../redux/store/action/darkModeAction'
// import MenuIcon from '@mui/icons-material/Menu';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'
import { useEffect } from 'react'

const Navbar = () => {
    const dispatch = useDispatch()
    const { i18n, t } = useTranslation(['sidebar'])

    useEffect(() => {
        if (localStorage.getItem('i18nextLng')?.length! > 2) {
            i18next.changeLanguage('en')
        }
    })
    const handleLanguageChange = (e: any) => {
        i18n.changeLanguage(e.target.value)
    }

    return (
        <div className="navbar">
            <div className="wrapper">
                <div className="items">
                    <div className="item">
                        <LanguageOutlinedIcon className="icon" />
                    </div>
                    <select value={localStorage.getItem('i18nextLng')!} onChange={handleLanguageChange}>
                        <option value="en">English</option>
                        <option value="vn">Vietnamese</option>
                        <option value="cn">China</option>
                    </select>
                    <div className="item">
                        <DarkModeOutlinedIcon className="icon" onClick={() => dispatch(handleToggle())} />
                    </div>
                    <div className="item">
                        <NotificationsNoneOutlinedIcon className="icon" />
                        <div className="counter">1</div>
                    </div>
                    <div className="item">
                        <EmailOutlinedIcon className="icon" />
                        <div className="counter">2</div>
                    </div>

                    <div className="item">
                        <img src="https://images.pexels.com/photos/941693/pexels-photo-941693.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500" alt="" className="avatar" />
                    </div>
                    {/* <div className="item">
                        <MenuIcon className="icon" />
                    </div> */}
                    {/* <div className="item">
                        <SettingsIcon className="icon" />

                    </div> */}
                </div>
            </div>
        </div>
    )
}

export default Navbar
