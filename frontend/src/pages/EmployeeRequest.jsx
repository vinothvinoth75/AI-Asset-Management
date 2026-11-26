
import React, { useState } from "react";
import { submitAssetRequest } from "../services/api";
import "./EmployeeRequest.css";

function EmployeeRequest() {

    const [formData, setFormData] = useState({
        employee_name: "",
        employee_id: "",
        employee_email: "",
        asset_type: "",
        asset_name: "",
        issue_description: ""
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
const [aiResult, setAiResult] = useState(null);
    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        setLoading(true);
        setMessage("");

        try {

            // const response = await submitAssetRequest(formData);

            const response = await submitAssetRequest(formData);

setAiResult(response);

setMessage(response.message);

            setMessage(
                response.message || "Asset request submitted successfully!"
            );

            setFormData({
                employee_name: "",
                employee_id: "",
                employee_email: "",
                asset_type: "",
                asset_name: "",
                issue_description: ""
            });

        } catch (error) {

            setMessage(
                error.response?.data?.detail ||
                "Something went wrong. Please try again."
            );

        } finally {

            setLoading(false);
        }
    };

    return (

        <div className="request-container">

            <div className="request-card">

                <h2>Employee Asset Request</h2>

                <p>Submit your asset requirement</p>

                {message && (
                    <div className="message">
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    <div className="form-group">

                        <label>Employee Name</label>

                        <input
                            type="text"
                            name="employee_name"
                            value={formData.employee_name}
                            onChange={handleChange}
                            placeholder="Enter employee name"
                            required
                        />

                    </div>

                    <div className="form-group">

                        <label>Employee ID</label>

                        <input
                            type="text"
                            name="employee_id"
                            value={formData.employee_id}
                            onChange={handleChange}
                            placeholder="Enter employee ID"
                            required
                        />

                    </div>

                    <div className="form-group">

                        <label>Employee Email</label>

                        <input
                            type="email"
                            name="employee_email"
                            value={formData.employee_email}
                            onChange={handleChange}
                            placeholder="Enter employee email"
                            required
                        />

                    </div>

                    <div className="form-group">

                        <label>Asset Type</label>

                        <select
                            name="asset_type"
                            value={formData.asset_type}
                            onChange={handleChange}
                            required
                        >

                            <option value="">Select Asset Type</option>
                            <option value="Laptop">Laptop</option>
                            <option value="Desktop">Desktop</option>
                            <option value="Monitor">Monitor</option>
                            <option value="Keyboard">Keyboard</option>
                            <option value="Mouse">Mouse</option>
                            <option value="Printer">Printer</option>
                            <option value="Other">Other</option>

                        </select>

                    </div>

                    <div className="form-group">

                        <label>Asset Name</label>

                        <input
                            type="text"
                            name="asset_name"
                            value={formData.asset_name}
                            onChange={handleChange}
                            placeholder="Enter asset name"
                            required
                        />

                    </div>

                    <div className="form-group">

                        <label>Issue Description</label>

                        <textarea
                            name="issue_description"
                            value={formData.issue_description}
                            onChange={handleChange}
                            placeholder="Explain your asset issue..."
                            rows="5"
                            required
                        />

                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                    >

                        {loading
                            ? "Submitting..."
                            : "Submit Asset Request"
                        }

                    </button>

                </form>

                {aiResult && (

    <div className="ai-result">

        <h3>AI Analysis Result</h3>

        <p>
            Priority: <strong>{aiResult.priority}</strong>
        </p>

        <p>
            Reason: {aiResult.ai_analysis.reason}
        </p>

        <p>
            Business Impact:
            {aiResult.ai_analysis.business_impact}
        </p>

        <p>
            Recommended Action:
            {aiResult.ai_analysis.recommended_action}
        </p>

        <p>
            Email Status: {aiResult.email_status}
        </p>

        <p>
            Excel Status: {aiResult.excel_status}
        </p>

    </div>

)}

            </div>

        </div>

    );
}

export default EmployeeRequest;
