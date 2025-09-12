import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { Dialog } from '@progress/kendo-react-dialogs';
import './TieUpNew.css';
import { Form, Field, FormElement } from '@progress/kendo-react-form';
import { Button } from '@progress/kendo-react-buttons';
import FormInput from '../../components/Form/FormInput';
import FormMaskedInput from '../../components/Form/FormMaskedInput';
import FormUpload from '../../components/Form/FormUpload';
import CustomFormFieldSet from '../../components/Form/CustomFormFieldSet';
import { nameValidator, emailValidator, phoneValidator, pincodeValidator, imageValidator } from '../../utils/validators';
import Avatar from '../../components/Avatar/CustomAvatar';

const responsiveBreakpoints = [
    { minWidth: 0, maxWidth: 499, value: 1 },
    { minWidth: 500, value: 2 }
];

const gstinValidator = (value) => {
    if (!value) return "GSTIN is required";

    const gstRegex = /^([0-9]{2}[A-Z]{4}([A-Z]{1}|[0-9]{1})[0-9]{4}[A-Z]{1}[A-Z0-9]{1}Z[A-Z0-9]{1})$/;

    if (!gstRegex.test(value)) {
        return "Invalid GSTIN format.";
    }

    return "";
};

const TieUpNew = () => {
    const [avatarSrc, setAvatarSrc] = useState(null);
    const [excelFile, setExcelFile] = useState(null);
    const [excelData, setExcelData] = useState(null);
    const [previewOpen, setPreviewOpen] = useState(false);

    const handleImageUpload = (src) => {
        setAvatarSrc(src);
    };

    // Handle file upload
    const handleExcelUpload = (files) => {
        if (files && files.length > 0) {
            const file = files[0].getRawFile ? files[0].getRawFile() : files[0];
            if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
                setExcelFile(file);
            } else {
                setExcelFile(null);
            }
        } else {
            setExcelFile(null);
        }
    };

    // Parse and preview Excel
    const handlePreview = () => {
        if (!excelFile) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            setExcelData(json);
            setPreviewOpen(true);
        };
        reader.readAsArrayBuffer(excelFile);
    };

    const handleSubmit = (dataItem) => {
        alert('Form submitted!\n' + JSON.stringify(dataItem, null, 2));
    };

    return (
        <Form
            onSubmit={handleSubmit}
            render={(formRenderProps) => (
                <FormElement style={{ maxWidth: 700, padding: '0 1rem' }}>

                    {/* Zeroth row: Avatar and file upload */}
                    <CustomFormFieldSet cols={responsiveBreakpoints}>
                        <div className='img-container'>
                            <Avatar src={avatarSrc} height={100} />
                        </div>
                        <Field
                            name="profilePic"
                            component={FormUpload}
                            label="Company Logo"
                            accept=".jpg,.jpeg,.png"
                            allowedFormatsArray={[".jpg", ".jpeg", ".png"]}
                            validator={imageValidator}
                            onImageUpload={handleImageUpload}
                        />
                    </CustomFormFieldSet>

                    {/* Fieldset 1: Contact Info */}
                    <CustomFormFieldSet legend="Contact Info" cols={responsiveBreakpoints} className="custom-fieldset">
                        <Field
                            name="companyName"
                            component={FormInput}
                            label="Company Name"
                            validator={nameValidator}
                            colSpan={1}
                        />
                        <Field
                            name="contactPerson"
                            component={FormInput}
                            label="Contact Person"
                            validator={nameValidator}
                            colSpan={1}
                        />
                        <Field
                            name="phone"
                            component={FormMaskedInput}
                            label="Phone"
                            mask="00000 00000"
                            validator={phoneValidator}
                            colSpan={1}
                        />
                        <Field
                            name="email"
                            component={FormInput}
                            label="Email"
                            validator={emailValidator}
                            colSpan={1}
                        />
                        <Field
                            name="storeCode"
                            component={FormInput}
                            label="Store Code"
                            validator={nameValidator}
                            colSpan={1}
                        />
                        <Field
                            name="sapCode"
                            component={FormInput}
                            label="SAP Code"
                            validator={nameValidator}
                            colSpan={1}
                        />
                    </CustomFormFieldSet>

                    {/* Fieldset 2: Address */}
                    <CustomFormFieldSet legend="Address" cols={responsiveBreakpoints} className="custom-fieldset">
                        <Field
                            name="addressLine1"
                            component={FormInput}
                            label="Address Line 1"
                            colSpan={responsiveBreakpoints}
                        />
                        <Field
                            name="addressLine2"
                            component={FormInput}
                            label="Address Line 2"
                            colSpan={responsiveBreakpoints}
                        />
                        <Field
                            name="city"
                            component={FormInput}
                            label="City"
                            colSpan={1}
                        />
                        <Field
                            name="state"
                            component={FormInput}
                            label="State"
                            colSpan={1}
                        />
                        <Field
                            name="pincode"
                            component={FormMaskedInput}
                            mask="0 0 0 0 0 0"
                            label="Pincode"
                            validator={pincodeValidator}
                            colSpan={1}
                            style={{ maxWidth: 200 }}
                        />
                    </CustomFormFieldSet>

                    {/* Fieldset 3: Business Details */}
                    <CustomFormFieldSet legend="Business Details" cols={responsiveBreakpoints} className="custom-fieldset">
                        <Field
                            name="gstin"
                            component={FormInput}
                            label="GSTIN"
                            validator={gstinValidator}
                            colSpan={1}
                            style={{ maxWidth: 350 }}
                        />
                    </CustomFormFieldSet>

                    {/* Fieldset 4: Billing Template (Excel) */}
                    <CustomFormFieldSet legend="Billing Template (Excel)" cols={responsiveBreakpoints} className="custom-fieldset">
                        <Field
                            name="billingTemplate"
                            component={FormUpload}
                            label="Upload Excel File"
                            accept=".xlsx,.xls"
                            allowedFormatsArray={[".xlsx", ".xls"]}
                            colSpan={responsiveBreakpoints}
                            onChange={(e) => handleExcelUpload(e.value)}
                        />
                    </CustomFormFieldSet>
                    {excelFile && (
                        <CustomFormFieldSet cols={responsiveBreakpoints} className="custom-fieldset">
                            <Button style={{ marginTop: 12 }} onClick={handlePreview}>
                                Preview
                            </Button>
                        </CustomFormFieldSet>
                    )}

                    <div className="k-form-buttons" style={{ marginTop: 24 }}>
                        <Button themeColor="primary" type="submit" disabled={!formRenderProps.allowSubmit}>
                            Submit
                        </Button>
                        <Button onClick={formRenderProps.onFormReset} style={{ marginLeft: 12 }}>
                            Reset
                        </Button>
                    </div>

                    {/* Excel Preview Dialog */}
                    {previewOpen && (
                        <Dialog title={
                            excelFile?.name
                                ? excelFile.name.length > 25
                                    ? excelFile.name.slice(0, 22) + '...'
                                    : excelFile.name
                                : "Excel Preview"
                        } onClose={() => setPreviewOpen(false)}>
                            <div className='excel-preview'
                            >
                                {excelData ? (
                                    <table className="k-table k-table-md k-table-bordered" style={{ width: '100%', minWidth: 400 }}>
                                        <tbody>
                                            {excelData.map((row, i) => (
                                                <tr key={i}>
                                                    {row.map((cell, j) => (
                                                        <td key={j}>{cell}</td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div>No data to preview.</div>
                                )}
                            </div>
                        </Dialog>
                    )}
                </FormElement>
            )}
        />
    );
};

export default TieUpNew;
