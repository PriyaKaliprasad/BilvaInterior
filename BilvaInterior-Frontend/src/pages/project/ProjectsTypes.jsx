import React, { useState, useEffect } from 'react';
import './projectTypes.css';

// KendoReact imports
import { Grid, GridColumn } from '@progress/kendo-react-grid';
import { Button } from '@progress/kendo-react-buttons';
import { Form, Field, FormElement } from '@progress/kendo-react-form';
import { Switch } from '@progress/kendo-react-inputs';

// Custom components
import FormInput from '../../components/Form/FormInput';
import CustomFormFieldSet from '../../components/Form/CustomFormFieldSet';
import { nameValidator } from '../../utils/validators';
import AddProjectType from '../AddProjectType';


export default function ProjectTypes() {
  const [projectTypes, setProjectTypes] = useState([]);
  const [skip, setSkip] = useState(0);
  const [take, setTake] = useState(6);
  const [editItem, setEditItem] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth <= 600 : false
  );

  // API URL
  const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/api/ProjectTypes`;

  const fetchData = async () => {
    try {
      const res = await fetch(apiUrl);
      if (res.ok) {
        const data = await res.json();
        setProjectTypes(data || []);
      } else {
        console.error('Failed to fetch project types:', await res.text());
      }
    } catch (err) {
      console.error('Network error while fetching:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const onResize = () => {
      setIsMobile(window.innerWidth <= 600);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // ✅ Save updated project type
  const handleEditSubmit = async (dataItem) => {
    const newName = dataItem.typeName.trim();

    // Check for duplicate name (case-insensitive)
    const duplicate = projectTypes.some(
      (p) =>
        p.name.trim().toLowerCase() === newName.toLowerCase() &&
        p.id !== editItem.id
    );

    if (duplicate) {
      setErrorMessage('⚠️ Project type with this name already exists!');
      setSuccessMessage('');
      return;
    }

    const updatedItem = {
      ...editItem,
      name: newName,
      status: dataItem.status,
    };

    try {
      const res = await fetch(`${apiUrl}/${editItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedItem),
      });

      if (res.ok) {
        setProjectTypes((prev) =>
          prev.map((p) => (p.id === editItem.id ? updatedItem : p))
        );
        setSuccessMessage('✅ Project type saved successfully!');
        setErrorMessage('');

        setTimeout(() => {
          setSuccessMessage('');
          setEditItem(null);
        }, 5000);
      } else if (res.status === 409) {
        // Server duplicate conflict (if applicable)
        const errData = await res.text();
        setErrorMessage(
          `⚠️ ${errData || 'Project type with this name already exists!'}`
        );
        setSuccessMessage('');
      } else {
        const errMsg = await res.text();
        setErrorMessage(`❌ Failed to update: ${errMsg}`);
        setSuccessMessage('');
      }
    } catch (err) {
      setErrorMessage('❌ Network error while updating project type');
      setSuccessMessage('');
    }
  };

  const handlePageChange = (event) => {
    setSkip(event.page.skip);
    setTake(event.page.take);
  };

  const StatusCell = (props) => {
    const { status } = props.dataItem;
    return (
      <td>
        <span
          className={`badge ${status ? 'status-active' : 'status-inactive'}`}
        >
          {status ? 'Active' : 'Inactive'}
        </span>
      </td>
    );
  };

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

  const SwitchField = (fieldRenderProps) => (
    <div className="k-form-field" style={{ marginTop: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
    </div>
  );

  // Mobile list rendering
  const MobileList = ({ items }) => {
    if (!items || items.length === 0) {
      return <div className="empty-mobile">No project types available.</div>;
    }
    return (
      <div className="mobile-list">
        {items.map((p) => (
          <div key={p.id} className="mobile-item">
            <div className="mobile-row">
              <div className="mobile-label">Project Type</div>
              <div className="mobile-value">{p.name}</div>
            </div>
            <div className="mobile-row">
              <div className="mobile-label">Status</div>
              <div className="mobile-value">
                <span
                  className={`badge ${p.status ? 'status-active' : 'status-inactive'
                    }`}
                >
                  {p.status ? 'Active' : 'Inactive'}
                </span>
                <Button
                  themeColor="primary"
                  size="small"
                  style={{ marginLeft: '10px' }}
                  onClick={() => setEditItem(p)}
                >
                  Edit
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Responsive action bar style
  const actionBarStyle = {
    position: 'sticky',
    top: 0,
    zIndex: 10,
    background: '#fff',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.5rem 0.5rem 0.5rem 0.5rem',
    borderBottom: '1px solid #eee',
    minHeight: 48,
    marginBottom: 10,
  };
  const actionBarBtnGroup = {
    display: 'flex',
    gap: '0.5rem',
  };

  // --- Main Render ---
  if (showAdd) {
    return (
      <>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
          <Button
            icon="arrow-left"
            size="small"
            onClick={() => setShowAdd(false)}
            className="action-btn back-btn"
            style={{ marginRight: 8 }}
          >
            <span className="tieup-action-btn-text">Back</span>
          </Button>
        </div>
        <AddProjectType />
      </>
    );
  }
  if (editItem) {
    return (
      <>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
          <Button
            icon="arrow-left"
            size="small"
            onClick={() => setEditItem(null)}
            className="action-btn back-btn"
            style={{ marginRight: 8 }}
          >
            <span className="tieup-action-btn-text">Back</span>
          </Button>
        </div>
        <div className="card">
          <h2>Edit Project Type</h2>
          <Form
            onSubmit={handleEditSubmit}
            initialValues={{
              typeName: editItem.name,
              status: editItem.status,
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

                {/* Inline Error / Success Message */}
                {errorMessage && <div className="error-box">{errorMessage}</div>}
                {successMessage && <div className="success-box">{successMessage}</div>}

                {/* Buttons */}
                <div className="form-buttons" style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                  <Button type="submit" themeColor="primary" disabled={!formRenderProps.allowSubmit}>
                    Save
                  </Button>
                  <Button type="button" onClick={() => setEditItem(null)} className="btn-cancel">
                    Cancel
                  </Button>
                </div>


              </FormElement>
            )}
          />
        </div>
      </>
    );
  }

  return (
    <main className="page-container">
      {/* Action Bar: Always visible, sticky */}
      <div style={actionBarStyle} className="projecttype-action-bar">
        <div style={actionBarBtnGroup}>
          <Button
            icon="refresh"
            size="small"
            onClick={fetchData}
            className="action-btn refresh-btn"
          >
            <span className="tieup-action-btn-text">Refresh</span>
          </Button>
        </div>
        <div style={actionBarBtnGroup}>
          <Button
            icon="plus"
            size="small"
            onClick={() => setShowAdd(true)}
            themeColor="primary"
            className="action-btn add-btn"
          >
            <span className="tieup-action-btn-text">Add</span>
          </Button>
        </div>
      </div>

      {/* Desktop / Tablet: Kendo Grid. Mobile: card list */}
      {!isMobile ? (
        <div className="card grid-wrapper">
          <Grid
            data={projectTypes.slice(skip, skip + take)}
            pageable={true}
            skip={skip}
            take={take}
            total={projectTypes.length}
            onPageChange={handlePageChange}
            style={{ minWidth: '700px', border: 'none' }}
            dataItemKey="id"
          >
            <GridColumn field="name" title="Project Type" />
            <GridColumn field="status" title="Status" cell={StatusCell} />
            <GridColumn title="Action" cell={ActionCell} />
          </Grid>
        </div>
      ) : (
        <div className="card mobile-wrapper">
          <MobileList items={projectTypes.slice(skip, skip + take)} />
        </div>
      )}
    </main>
  );
}


