
import React from "react";
import {
    BrowserRouter,
    Routes,
    Route,
    Link
} from "react-router-dom";

import EmployeeRequest from "./pages/EmployeeRequest";
import AdminDashboard from "./pages/AdminDashboard";

function App() {

    return (

        <BrowserRouter>

            <nav style={{
                padding: "15px 30px",
                background: "#243047",
                display: "flex",
                gap: "25px"
            }}>

                <Link
                    to="/"
                    style={{color: "white"}}
                >
                    Employee Request
                </Link>

                <Link
                    to="/admin"
                    style={{color: "white"}}
                >
                    Admin Dashboard
                </Link>

            </nav>

            <Routes>

                <Route
                    path="/"
                    element={<EmployeeRequest />}
                />

                <Route
                    path="/admin"
                    element={<AdminDashboard />}
                />

            </Routes>

        </BrowserRouter>

    );
}

export default App;
