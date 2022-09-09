import Home from './pages/home/Home'
import Login from './pages/login/Login'
import Listuser from './pages/list_users/ListUsers'
import Listproduct from './pages/list_products/ListProducts'
import NewUsers from './pages/new_users/NewUsers'
import NewProducts from './pages/new_products/NewProducts'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './style/dark.scss'
import '../src/commons/utils/atomic.scss'
import { useSelector } from 'react-redux'
import { ReactElement, Suspense } from 'react'
import ProfileUser from './pages/profile_user/ProfileUser'
import EditUser from './pages/edit_user/EditUser'
import ProfileProduct from './pages/profile_product/ProfileProduct'
import EditProduct from './pages/edit_product/EditProduct'
import ListOrder from './pages/list_order/ListOrder'
import ListCategory from './pages/list_category/ListProducts'
import ProfileOrder from './pages/profile_order/ProfileOrder'

interface RootState {
    darkModeReducer: {
        darkMode: boolean
    }
    authReducer: {
        currentUser: boolean
    }
}
function App() {
    const darkmode = useSelector((state: RootState) => state.darkModeReducer.darkMode)
    const currentUser = useSelector((state: RootState) => state.authReducer.currentUser)

    interface ChildrenProps {
        children: ReactElement
    }

    const RequireAuth = ({ children }: ChildrenProps) => {
        return currentUser ? children : <Navigate to="/login" />
    }

    return (
        <div className={darkmode ? 'app dark' : 'app'}>
            <Suspense fallback={null}>
                <Router>
                    <Routes>
                        <Route path="/">
                            <Route path="login" element={<Login />} />
                            <Route
                                index
                                element={
                                    <RequireAuth>
                                        <Home />
                                    </RequireAuth>
                                }
                            />
                            <Route path="users">
                                <Route
                                    index
                                    element={
                                        <RequireAuth>
                                            <Listuser />
                                        </RequireAuth>
                                    }
                                />
                                <Route
                                    path=":userId"
                                    element={
                                        <RequireAuth>
                                            <ProfileUser />
                                        </RequireAuth>
                                    }
                                />
                                <Route
                                    path="new"
                                    element={
                                        <RequireAuth>
                                            <NewUsers />
                                        </RequireAuth>
                                    }
                                />
                                <Route
                                    path="edit"
                                    element={
                                        <RequireAuth>
                                            <EditUser />
                                        </RequireAuth>
                                    }
                                />
                            </Route>
                            <Route path="products">
                                <Route
                                    index
                                    element={
                                        <RequireAuth>
                                            <Listproduct />
                                        </RequireAuth>
                                    }
                                />
                                <Route
                                    path=":productId"
                                    element={
                                        <RequireAuth>
                                            <ProfileProduct />
                                        </RequireAuth>
                                    }
                                />
                                <Route
                                    path="new"
                                    element={
                                        <RequireAuth>
                                            <NewProducts />
                                        </RequireAuth>
                                    }
                                />
                                <Route
                                    path="edit"
                                    element={
                                        <RequireAuth>
                                            <EditProduct />
                                        </RequireAuth>
                                    }
                                />
                            </Route>
                            <Route path="category">
                                <Route
                                    index
                                    element={
                                        <RequireAuth>
                                            <ListCategory />
                                        </RequireAuth>
                                    }
                                />
                                <Route
                                    path=":productId"
                                    element={
                                        <RequireAuth>
                                            <ProfileProduct />
                                        </RequireAuth>
                                    }
                                />
                                <Route
                                    path="new"
                                    element={
                                        <RequireAuth>
                                            <NewProducts />
                                        </RequireAuth>
                                    }
                                />
                                <Route
                                    path="edit"
                                    element={
                                        <RequireAuth>
                                            <EditProduct />
                                        </RequireAuth>
                                    }
                                />
                            </Route>
                            <Route path="order">
                                <Route
                                    index
                                    element={
                                        <RequireAuth>
                                            <ListOrder />
                                        </RequireAuth>
                                    }
                                />
                                <Route
                                    path=":orderId"
                                    element={
                                        <RequireAuth>
                                            <ProfileOrder />
                                        </RequireAuth>
                                    }
                                />
                                <Route
                                    path="new"
                                    element={
                                        <RequireAuth>
                                            <NewProducts />
                                        </RequireAuth>
                                    }
                                />
                                <Route
                                    path="edit"
                                    element={
                                        <RequireAuth>
                                            <EditProduct />
                                        </RequireAuth>
                                    }
                                />
                            </Route>
                        </Route>
                    </Routes>
                </Router>
            </Suspense>
        </div>
    )
}

export default App
