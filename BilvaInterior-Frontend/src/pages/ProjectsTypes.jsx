import React, { useState } from 'react';
import './projectTypes.css';

// KendoReact imports
import { Grid, GridColumn } from '@progress/kendo-react-grid';
import { Button } from '@progress/kendo-react-buttons';
import { Form, Field, FormElement } from '@progress/kendo-react-form';
import { Dialog } from '@progress/kendo-react-dialogs';
import { Switch } from '@progress/kendo-react-inputs';

// Custom components
import FormInput from '../components/Form/FormInput';
import CustomFormFieldSet from '../components/Form/CustomFormFieldSet';
import { nameValidator } from '../utils/validators';

// --- Dummy Data ---
const initialProjectTypes = [
  { id: 1, type: 'Residential', status: 'Active' },
  { id: 2, type: 'Commercial', status: 'Active' },
  { id: 3, type: 'Office Space', status: 'Active' },
  { id: 4, type: 'Landscape', status: 'Active' },
  { id: 5, type: 'Healthcare Facility', status: 'Active' },
  { id: 6, type: 'Renovation', status: 'Inactive' },
  { id: 7, type: 'Landscape', status: 'Inactive' },
];

export default function ProjectTypes() {
  const [projectTypes, setProjectTypes] = useState(initialProjectTypes);

  // Pagination state
  const [skip, setSkip] = useState(0);
  const [take, setTake] = useState(6);

  // Dialog state
  const [editItem, setEditItem] = useState(null);

  // Page change
  const handlePageChange = (event) => {
    setSkip(event.page.skip);
    setTake(event.page.take);
  };

  // Save updated project type
  const handleEditSubmit = (dataItem) => {
    const updated = projectTypes.map((p) =>
      p.id === editItem.id
        ? {
            ...p,
            type: dataItem.typeName,
            status: dataItem.status ? 'Active' : 'Inactive',
          }
        : p
    );
    setProjectTypes(updated);
    setEditItem(null);
  };

  // Status cell
  const StatusCell = (props) => {
    const { status } = props.dataItem;
    return (
      <td>
        <span
          className={`badge ${
            status === 'Active' ? 'status-active' : 'status-inactive'
          }`}
        >
          {status}
        </span>
      </td>
    );
  };

  // Action cell
  const ActionCell = (props) => (
    <td>
      <Button
        themeColor="primary"
        size="small"
        onClick={() => setEditItem(props.dataItem)}
      >
        Edit
      </Button>
    </td>
  );

  // Custom Switch Field
  const SwitchField = (fieldRenderProps) => (
    <div className="k-form-field" style={{ marginTop: '12px' }}>
      <label>Status</label>
      <Switch
        checked={fieldRenderProps.value}
        onChange={(e) =>
          fieldRenderProps.onChange({
            value: e.value,
          })
        }
        onLabel="ACTIVE"
        offLabel="INACTIVE"
      />
    </div>
  );

  return (
    <main className="page-container">
      {/* Grid Section */}
      <div className="card">
        <Grid
          data={projectTypes.slice(skip, skip + take)}
          pageable={true}
          skip={skip}
          take={take}
          total={projectTypes.length}
          onPageChange={handlePageChange}
          style={{ height: 'auto', border: 'none' }}
          dataItemKey="id" // ✅ Fix warning about keys
        >
          <GridColumn field="type" title="Project Type" />
          <GridColumn field="status" title="Status" cell={StatusCell} />
          <GridColumn title="Action" cell={ActionCell} />
        </Grid>
      </div>

      {/* Edit Dialog */}
      {editItem && (
        <Dialog
          title="Edit Project Type"
          onClose={() => setEditItem(null)}
          width={window.innerWidth < 600 ? '95%' : 500} // ✅ responsive width
        >
          <Form
            onSubmit={handleEditSubmit}
            initialValues={{
              typeName: editItem.type,
              status: editItem.status === 'Active',
            }}
            render={(formRenderProps) => (
              <FormElement className="responsive-form">
                <CustomFormFieldSet>
                  <Field
                    name="typeName"
                    component={FormInput}
                    label="Name of Project Type"
                    validator={nameValidator}
                  />
                  <Field name="status" component={SwitchField} />
                </CustomFormFieldSet>

                <div className="form-buttons">
                  <Button
                    type="button"
                    onClick={() => setEditItem(null)}
                    className="btn-cancel"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    themeColor="primary"
                    disabled={!formRenderProps.allowSubmit}
                  >
                    Save
                  </Button>
                </div>
              </FormElement>
            )}
          />
        </Dialog>
      )}
    </main>
  );
}
