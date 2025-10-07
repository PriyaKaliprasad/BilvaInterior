import React, { useState, useEffect, useRef } from "react";
import { Form, Field, FormElement } from "@progress/kendo-react-form";
import { Button } from "@progress/kendo-react-buttons";
import { Switch } from "@progress/kendo-react-inputs";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import { Notification } from "@progress/kendo-react-notification"; // ✅ added
import { Fade } from "@progress/kendo-react-animation"; // ✅ added

import Avatar from "../../components/Avatar/CustomAvatar";
import FormInput from "../../components/Form/FormInput";
import FormUpload from "../../components/Form/FormUpload";
import CustomFormFieldSet from "../../components/Form/CustomFormFieldSet";

import {
    nameValidator,
    emailValidator,
    phoneValidator,
    imageValidator,
} from "../../utils/validators";
import { responsiveBreakpoints } from "../../components/Form/formConstants";
import "./EmployeeNew.css";

const wideScreenValue = 1100;

const genders = [
    { text: "Male", value: "Male" },
    { text: "Female", value: "Female" },
    { text: "Other", value: "Other" },
];

const EmployeesNew = () => {
    const [avatarSrc, setAvatarSrc] = useState(null);
    const [isWide, setIsWide] = useState(() => window.innerWidth >= wideScreenValue);
    const [showDialog, setShowDialog] = useState(false);
    const [dialogMessage, setDialogMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [roles, setRoles] = useState([]);
    const [showNotification, setShowNotification] = useState(false); // ✅ new state

    const resetFnRef = useRef(null);

    const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/api/Role`;
    const fetchRoles = async () => {
        try {
            const res = await fetch(API_BASE, { cache: "no-cache" });

            if (!res.ok) throw new Error(`Failed to fetch roles (${res.status})`);
            const data = await res.json();
            console.log("Fetched roles:", data);

            const formattedRoles = (data || []).map((role) => ({
                text: role.name || role.roleName || role,
                value: role.id,
            }));

            console.log("Formatted roles:", formattedRoles);

            setRoles(formattedRoles);
        } catch (err) {
            console.error("Error fetching roles:", err);
            setRoles([]);
        }
    };

    useEffect(() => {
        fetchRoles();
    }, []);

    useEffect(() => {
        const onResize = () => setIsWide(window.innerWidth >= wideScreenValue);
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    const handleImageUpload = (src) => {
        setAvatarSrc(src);
    };

    const handleSubmit = async (dataItem, formRenderProps) => {
        setIsSaving(true);

        const payload = {
            FirstName: dataItem.firstName,
            LastName: dataItem.lastName,
            Email: dataItem.email,
            Password: "DefaultPassword@123",
            Mobile: dataItem.mobile,
            Address: dataItem.address,
            Gender: dataItem.gender?.value || dataItem.gender,
            RoleId: dataItem.role?.value,
            Status: !!dataItem.status,
            ProfilePicPath: avatarSrc,
        };
        console.log("Submitting payload to backend:", payload);
        try {
            // --- THIS IS THE FIX ---
            // The URL has been changed from "/api/auth/new" to the correct "/api/auth/register"
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });
            console.log("Backend response:", response.ok);
            if (response.ok) {
                setIsSuccess(true);
                setDialogMessage("Employee created successfully!");
                if (resetFnRef.current) {
                    resetFnRef.current();
                }
                setAvatarSrc(null);

                // ✅ show success notification
                setShowNotification(true);
                setTimeout(() => setShowNotification(false), 3000);
            } else {
                const errorData = await response.json();
                setIsSuccess(false);
                let errorMessage = "Failed to create employee.";

                if (errorData.errors) {
                    errorMessage = Object.values(errorData.errors).flat().join(" ");
                } else if (errorData.error) {
                    errorMessage = errorData.error;
                } else if (errorData.title) {
                    errorMessage = errorData.title;
                }

                setDialogMessage(errorMessage);

                // ✅ show error notification
                setShowNotification(true);
                setTimeout(() => setShowNotification(false), 3000);
            }
        } catch (error) {
            console.error("Error during submission:", error);
            setIsSuccess(false);
            setDialogMessage("An error occurred. Please check the server connection.");

            // ✅ show error notification
            setShowNotification(true);
            setTimeout(() => setShowNotification(false), 3000);
        } finally {
            setShowDialog(true);
            setIsSaving(false);
        }
    };

    const toggleDialog = () => {
        setShowDialog(!showDialog);
    };

    // Bootstrap-based layout for form fields
    const leftColumn = (
        <div className="left-column">
            <div className="row">
                <div className="col-12 col-md-6">
                    <Field
                        name="firstName"
                        component={FormInput}
                        label="First Name"
                        validator={nameValidator}
                    />
                </div>
                <div className="col-12 col-md-6">
                    <Field
                        name="lastName"
                        component={FormInput}
                        label="Last Name"
                        validator={nameValidator}
                    />
                </div>
            </div>
            <div className="row">
                <div className="col-12 col-md-6">
                    <Field
                        name="email"
                        component={FormInput}
                        label="Email"
                        validator={emailValidator}
                    />
                </div>
                <div className="col-12 col-md-6">
                    <Field
                        name="mobile"
                        component={FormInput}
                        label="Mobile"
                        validator={phoneValidator}
                    />
                </div>
            </div>
            <div className="row">
                <div className="col-12">
                    <Field
                        name="address"
                        component={FormInput}
                        label="Address"
                        validator={nameValidator}
                    />
                </div>
            </div>
            <div className="row">
                <div className="col-12 col-md-6">
                    <Field
                        name="role"
                        label="Role"
                        validator={(value) => (value ? "" : "Role is required.")}
                        component={(fieldProps) => (
                            <DropDownList
                                data={roles}
                                textField="text"
                                dataItemKey="value"
                                value={roles.find((r) => r.value === fieldProps.value) || null}
                                onChange={(e) =>
                                    fieldProps.onChange({ value: e.value ? e.value.value : null })
                                }
                                {...fieldProps}
                            />
                        )}
                    />
                </div>
                <div className="col-12 col-md-6">
                    <Field
                        name="gender"
                        label="Gender"
                        validator={(value) => (value ? "" : "Gender is required.")}
                        component={(fieldProps) => (
                            <DropDownList
                                data={genders}
                                textField="text"
                                dataItemKey="value"
                                value={genders.find((g) => g.value === fieldProps.value) || null}
                                onChange={(e) => fieldProps.onChange(e.value?.value || "")}
                                {...fieldProps}
                            />
                        )}
                    />
                </div>
            </div>
            <div className="row mt-3 mb-2">
                <div className="col-12">
                    <Field
                        name="status"
                        label="Status"
                        component={(fieldProps) => (
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                <label>Status:</label>
                                <Switch
                                    checked={!!fieldProps.value}
                                    onChange={(e) => fieldProps.onChange({ value: e.value })}
                                />
                                <span>{fieldProps.value ? "Active" : "Inactive"}</span>
                            </div>
                        )}
                    />
                </div>
            </div>
        </div>
    );

    const rightColumn = (
        <div className="right-column">
            <div className="row">
                <div className="col-12">
                    <div className="img-container">
                        <Avatar src={avatarSrc} height={200} />
                    </div>
                </div>
                <div className="col-12">
                    <Field
                        name="profilePic"
                        component={FormUpload}
                        label="Profile Picture"
                        accept=".jpg,.jpeg,.png"
                        allowedFormatsArray={[".jpg", ".jpeg", ".png"]}
                        validator={imageValidator}
                        onImageUpload={handleImageUpload}
                    />
                </div>
            </div>
        </div>
    );

    return (
        <>
            <Form
                initialValues={{ status: true }}
                onSubmit={handleSubmit}
                render={(formRenderProps) => {
                    resetFnRef.current = formRenderProps.onFormReset;

                    return (
                        <FormElement className="form-container">
                            <div className="row column-container flex-lg-nowrap">
                                {/* On wide screens, left and right columns side by side; on small, stack */}
                                <div className="col-12 col-lg-8 order-2 order-lg-1">{leftColumn}</div>
                                <div className="col-12 col-lg-4 order-1 order-lg-2 mb-3 mb-lg-0">{rightColumn}</div>
                            </div>
                            {/* Toast-like success/error message (moved to bottom above buttons) */}
                            {dialogMessage && (
                                <div style={{
                                    marginBottom: "1rem",
                                    padding: "8px",
                                    borderRadius: "6px",
                                    textAlign: "center",
                                    fontWeight: "bold",
                                    color: isSuccess ? "#065f46" : "#b91c1c",
                                    backgroundColor: isSuccess ? "#d1fae5" : "#fee2e2"
                                }}>
                                    {dialogMessage}
                                </div>
                            )}
                            <div className="k-form-buttons" style={{ marginTop: 24 }}>
                                <Button
                                    themeColor="primary"
                                    type="submit"
                                    disabled={!formRenderProps.allowSubmit || isSaving}
                                >
                                    {isSaving ? "Saving..." : "Submit"}
                                </Button>
                                <Button
                                    onClick={() => {
                                        formRenderProps.onFormReset();
                                        setAvatarSrc(null);
                                    }}
                                    style={{ marginLeft: 12 }}
                                    disabled={isSaving}
                                >
                                    Reset
                                </Button>
                            </div>
                        </FormElement>
                    )
                }}
            />
        </>
    );
};

export default EmployeesNew;
