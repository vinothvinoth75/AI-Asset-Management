
import React, { useEffect, useState } from "react";
import API from "../services/api";
import "./AdminDashboard.css";

function AdminDashboard() {

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("ALL");
    const [selectedRequest, setSelectedRequest] = useState(null);

    const fetchRequests = async () => {

        try {

            setLoading(true);

            const response = await API.get("/asset-requests/");

            setRequests(response.data.data || []);

        } catch (error) {

            console.error("Fetch error:", error);

        } finally {

            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const countPriority = (priority) => {

        return requests.filter(
            item => item.priority === priority
        ).length;

    };

    const filteredRequests = filter === "ALL"
        ? requests
        : requests.filter(
            item => item.priority === filter
        );

    const getPriorityClass = (priority) => {

        return priority?.toLowerCase() || "low";

    };

    return (

        <div className="admin-container">

            <div className="admin-header">

                <div>
                    <h2>Asset Management Dashboard</h2>
                    <p>AI-powered employee asset request monitoring</p>
                </div>

                <button onClick={fetchRequests}>
                    Refresh
                </button>

            </div>

            <div className="stats-container">

                <div className="stat-card">
                    <h4>Total Requests</h4>
                    <h2>{requests.length}</h2>
                </div>

                <div className="stat-card critical">
                    <h4>Critical</h4>
                    <h2>{countPriority("CRITICAL")}</h2>
                </div>

                <div className="stat-card high">
                    <h4>High</h4>
                    <h2>{countPriority("HIGH")}</h2>
                </div>

                <div className="stat-card medium">
                    <h4>Medium</h4>
                    <h2>{countPriority("MEDIUM")}</h2>
                </div>

                <div className="stat-card low">
                    <h4>Low</h4>
                    <h2>{countPriority("LOW")}</h2>
                </div>

            </div>

            <div className="requests-section">

                <div className="table-header">

                    <h3>Employee Asset Requests</h3>

                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="ALL">All Priorities</option>
                        <option value="CRITICAL">Critical</option>
                        <option value="HIGH">High</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="LOW">Low</option>
                    </select>

                </div>

                {loading ? (

                    <p>Loading requests...</p>

                ) : (

                    <div className="table-responsive">

                        <table>

                            <thead>
                                <tr>
                                    <th>Employee</th>
                                    <th>Employee ID</th>
                                    <th>Asset</th>
                                    <th>Priority</th>
                                    <th>Email Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>

                                {filteredRequests.map((item, index) => (

                                    <tr key={index}>

                                        <td>{item.employee_name}</td>

                                        <td>{item.employee_id}</td>

                                        <td>{item.asset_name}</td>

                                        <td>
                                            <span className={`priority ${getPriorityClass(item.priority)}`}>
                                                {item.priority}
                                            </span>
                                        </td>

                                        <td>{item.email_status}</td>

                                        <td>
                                            <button
                                                className="view-btn"
                                                onClick={() => setSelectedRequest(item)}
                                            >
                                                View
                                            </button>
                                        </td>

                                    </tr>

                                ))}

                                {filteredRequests.length === 0 && (
                                    <tr>
                                        <td colSpan="6">
                                            No requests found
                                        </td>
                                    </tr>
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

            {selectedRequest && (

                <div className="modal-overlay">

                    <div className="request-modal">

                        <button
                            className="close-btn"
                            onClick={() => setSelectedRequest(null)}
                        >
                            ×
                        </button>

                        <h3>Request Details</h3>

                        <p>
                            <strong>Employee:</strong>
                            {selectedRequest.employee_name}
                        </p>

                        <p>
                            <strong>Employee ID:</strong>
                            {selectedRequest.employee_id}
                        </p>

                        <p>
                            <strong>Asset:</strong>
                            {selectedRequest.asset_name}
                        </p>

                        <p>
                            <strong>Issue:</strong>
                            {selectedRequest.issue_description}
                        </p>

                        <hr />

                        <h4>AI Analysis</h4>

                        <p>
                            <strong>Priority:</strong>
                            {selectedRequest.priority}
                        </p>

                        <p>
                            <strong>Reason:</strong>
                            {selectedRequest.ai_reason}
                        </p>

                        <p>
                            <strong>Business Impact:</strong>
                            {selectedRequest.business_impact}
                        </p>

                        <p>
                            <strong>Recommended Action:</strong>
                            {selectedRequest.recommended_action}
                        </p>

                        <p>
                            <strong>Email Status:</strong>
                            {selectedRequest.email_status}
                        </p>

                    </div>

                </div>

            )}

        </div>

    );

}

export default AdminDashboard;
