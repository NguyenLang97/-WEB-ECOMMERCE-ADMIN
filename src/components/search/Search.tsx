import { FC } from 'react'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'

const Search = () => {
    return (
        <div className="search">
            <input type="text" placeholder="Search..." />
            <SearchOutlinedIcon />
        </div>
    )
}

export default Search
