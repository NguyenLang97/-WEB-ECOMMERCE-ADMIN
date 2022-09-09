import './datatableusers.scss'
import { DataGrid } from '@mui/x-data-grid'
import { userColumns } from '../../datatablesource'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { collection, deleteDoc, doc, onSnapshot } from 'firebase/firestore'
import { db } from '../../firebase/firebase'
import { Backdrop, Button, CircularProgress, Divider, IconButton, InputBase, Paper } from '@mui/material'

import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'
import React, { FunctionComponent } from 'react'
import { FormControl, InputAdornment, TextField } from '@mui/material'

const Datatable = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [query, setQuery] = useState('')
    const navigate = useNavigate()
    console.log({ query })
    console.log({ data })

    useEffect(() => {
        // const fetchData = async () => {
        //     let list = [];
        //     try {
        //         const querySnapshot = await getDocs(collection(db, 'users'));
        //         querySnapshot.forEach((doc) => {
        //             list.push({ id: doc.id, ...doc.data() });
        //         });
        //         setData(list);
        //         console.log(list);
        //     } catch (err) {
        //         console.log(err);
        //     }
        // };
        // fetchData();

        // LISTEN (REALTIME)
        setLoading(true)
        const unsub = onSnapshot(
            collection(db, 'users'),
            (snapShot) => {
                const list: any = []
                snapShot.docs.forEach((doc) => {
                    list.push({ id: doc.id, ...doc.data() })
                })
                setData(list)
                setLoading(false)
            },
            (error) => {
                console.log(error)
            }
        )

        return () => {
            unsub()
        }
    }, [])
    const keys = ['fullname', 'username', 'email', 'id']
    // chu y voi cac key tao ben client se k co gay ra loi

    const search = (data: any) => {
        if (data && data.length) {
            return data.filter((item: any) => keys.some((key) => item[key].toLowerCase().includes(query.toLowerCase())))
        } else return []
    }
    console.log('data', search(data))

    const handleDelete = async (id: any) => {
        try {
            await deleteDoc(doc(db, 'users', id))
            setData(data.filter((item: any) => item.id !== id))
        } catch (err) {
            console.log(err)
        }
    }

    const handleEdit = (id: any) => {
        navigate('/users/edit', { state: id })
    }

    const [showClearIcon, setShowClearIcon] = useState('none')

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setShowClearIcon(event.target.value === '' ? 'none' : 'flex')
        setQuery(event.target.value)
    }

    const handleClick = (): void => {
        // TODO: Clear the search input
        console.log('clicked the clear icon...')
        setQuery('')
    }

    const actionColumn = [
        {
            field: 'action',
            headerName: 'Action',
            width: 200,
            renderCell: (params: any) => {
                return (
                    <div className="cellAction">
                        <Link to={`/users/${params.row.id}`} style={{ textDecoration: 'none' }}>
                            <div className="viewButton">View</div>
                        </Link>

                        <div className="viewButton" onClick={() => handleEdit(params.row.id)}>
                            Edit
                        </div>

                        <div className="deleteButton" onClick={() => handleDelete(params.row.id)}>
                            Delete
                        </div>
                    </div>
                )
            },
        },
    ]

    return (
        <>
            {/* {loading ? (
                <Backdrop
                    sx={{
                        color: '#fff',
                        zIndex: (theme) => theme.zIndex.drawer + 1,
                    }}
                    open={true}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
            ) : ( */}
            <div className="datatable">
                <div className="datatableTitle">
                    Customer
                    <div className="search">
                        <FormControl>
                            <TextField
                                size="small"
                                variant="outlined"
                                onChange={handleChange}
                                value={query}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end" style={{ display: showClearIcon }} onClick={handleClick}>
                                            <ClearIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </FormControl>
                        </div>
                    <Link to="/users/new">
                        <Button variant="contained">Add New</Button>
                    </Link>
                </div>
                <DataGrid className="datagrid" rows={search(data)} columns={userColumns.concat(actionColumn)} pageSize={5} rowsPerPageOptions={[5]} checkboxSelection />
            </div>
            {/* )} */}
        </>
    )
}

export default Datatable
