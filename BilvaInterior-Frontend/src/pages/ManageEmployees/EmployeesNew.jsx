import React from 'react';
import { Form, Field, FormElement } from '@progress/kendo-react-form';
import { Button } from '@progress/kendo-react-buttons';
import { Switch } from '@progress/kendo-react-inputs';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import Avatar from '../../components/Avatar/CustomAvatar';
import FormInput from '../../components/Form/FormInput';
import FormUpload from '../../components/Form/FormUpload';
import CustomFormFieldSet from '../../components/Form/CustomFormFieldSet';
import { nameValidator, emailValidator, phoneValidator, imageValidator } from '../../utils/validators';
import { responsiveBreakpoints } from '../../components/Form/formConstants';
import './EmployeeNew.css';

// screen breakpoint for responsiveness
const wideScreenValue = 1100;


const roles = [
  { text: 'Admin', value: 'admin' },
  { text: 'Manager', value: 'manager' },
  { text: 'Employee', value: 'employee' }
];
const genders = [
  { text: 'Male', value: 'male' },
  { text: 'Female', value: 'female' },
  { text: 'Other', value: 'other' }
];

const EmployeesNew = () => {
  const [avatarSrc, setAvatarSrc] = React.useState(null);

  const handleImageUpload = (src) => {
    setAvatarSrc(src);
  };

  const handleSubmit = (dataItem) => {
    alert('Form submitted!\n' + JSON.stringify(dataItem, null, 2));
  };

  // Responsive order logic
  const [isWide, setIsWide] = React.useState(() => window.innerWidth >= wideScreenValue);
  React.useEffect(() => {
    const onResize = () => setIsWide(window.innerWidth >= 1025);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const leftColumn = (
    <div className="left-column">
      {/* First row: Firstname, Lastname */}
      <CustomFormFieldSet cols={responsiveBreakpoints}>
        <Field
          name="firstName"
          component={FormInput}
          label="First Name"
          validator={nameValidator}
        />
        <Field
          name="lastName"
          component={FormInput}
          label="Last Name"
          validator={nameValidator}
        />
      </CustomFormFieldSet>

      {/* Second row: Email, Mobile */}
      <CustomFormFieldSet cols={responsiveBreakpoints}>
        <Field
          name="email"
          component={FormInput}
          label="Email"
          validator={emailValidator}
        />
        <Field
          name="mobile"
          component={FormInput}
          label="Mobile"
          validator={phoneValidator}
        />
      </CustomFormFieldSet>

      {/* Third row: Address (full width) */}
      <CustomFormFieldSet cols={responsiveBreakpoints}>
        <Field
          name="address"
          component={FormInput}
          label="Address"
          validator={nameValidator}
          colSpan={responsiveBreakpoints}
        />
      </CustomFormFieldSet>

      {/* Fourth row: Role, Gender */}
      <CustomFormFieldSet cols={responsiveBreakpoints}>
        <Field
          name="role"
          label="Role"
          validator={nameValidator}
          component={(fieldProps) => (
            <DropDownList
              data={roles}
              textField="text"
              dataItemKey="value"
              value={roles.find(r => r.value === fieldProps.value) || null}
              onChange={e => fieldProps.onChange({ value: e.value.value })}
              {...fieldProps}
            />
          )}
          colSpan={1}
        />
        <Field
          name="gender"
          label="Gender"
          validator={nameValidator}
          component={(fieldProps) => (
            <DropDownList
              data={genders}
              textField="text"
              dataItemKey="value"
              value={genders.find(g => g.value === fieldProps.value) || null}
              onChange={e => fieldProps.onChange({ value: e.value.value })}
              {...fieldProps}
            />
          )}
          colSpan={1}
        />
      </CustomFormFieldSet>

      {/* Fifth row: Status Switch */}
      <CustomFormFieldSet layout={{
        cols: [{ minWidth: 0, value: 1 }],
        gap: 24
      }}>
        <Field
          name="status"
          label="Status"
          component={(fieldProps) => (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Switch
                checked={!!fieldProps.value}
                onChange={e => fieldProps.onChange({ value: e.value })}
              />
              <span>{fieldProps.value ? 'Active' : 'Inactive'}</span>
            </div>
          )}
        />
      </CustomFormFieldSet>
    </div>
  );

  const rightColumn = (
    <div className="right-column">
      {/* Zeroth row: Avatar and file upload */}
      <CustomFormFieldSet cols={responsiveBreakpoints}>
        <div className='img-container'>
          <Avatar src={avatarSrc} height={200} />
        </div>
        <Field
          name="profilePic"
          component={FormUpload}
          label="Profile Picture"
          accept=".jpg,.jpeg,.png"
          allowedFormatsArray={[".jpg", ".jpeg", ".png"]}
          validator={imageValidator}
          onImageUpload={handleImageUpload}
        />
      </CustomFormFieldSet>
    </div>
  );

  return (
    <Form
      onSubmit={handleSubmit}
      render={(formRenderProps) => (
        <FormElement className='form-container'>
          <div className="column-container">
            {isWide ? (
              <>
                {leftColumn}
                {rightColumn}
              </>
            ) : (
              <>
                {rightColumn}
                {leftColumn}
              </>
            )}
          </div>
          <div className="k-form-buttons" style={{ marginTop: 24 }}>
            <Button themeColor="primary" type="submit" disabled={!formRenderProps.allowSubmit}>
              Submit
            </Button>
            <Button onClick={formRenderProps.onFormReset} style={{ marginLeft: 12 }}>
              Reset
            </Button>
          </div>
        </FormElement>
      )}
    />
  );
};

export default EmployeesNew;
