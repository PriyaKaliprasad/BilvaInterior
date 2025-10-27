import React, { useEffect, useState } from "react";
import { Grid, GridColumn, GridColumnMenuFilter } from "@progress/kendo-react-grid";
import { process } from "@progress/kendo-data-query";
import api from "../api/axios";
import { filterIcon } from '@progress/kendo-svg-icons';
import FloatingLabelWrapper from "../components/Form/FloatingLabelWrapper/FloatingLabelWrapper";
import { DateTimePicker } from "@progress/kendo-react-dateinputs";
import { Input } from "@progress/kendo-react-inputs";
import { MultiSelect } from "@progress/kendo-react-dropdowns";
import { Checkbox } from "@progress/kendo-react-inputs";
import { Label } from "@progress/kendo-react-labels";
import { Button } from "@progress/kendo-react-buttons";

// kendo column menu
const ColumnMenu = props => <GridColumnMenuFilter {...props} expanded={true} />;



const AuditTrail = () => {
  const [logs, setLogs] = useState([]); // fetched data
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState({ skip: 0, take: 15 });
  // filter state for client-side filtering
  const [filter, setFilter] = useState({ logic: "and", filters: [] });
  const [loading, setLoading] = useState(false);
  // MultiSelect options
  const [eventTypeOptions, setEventTypeOptions] = useState([]);
  const [userOptions, setUserOptions] = useState([]);
  // Fetch event types and usernames for MultiSelects
  useEffect(() => {
    // Fetch event types
    api.get('/api/audittrail/eventtypes').then(res => {
      if (Array.isArray(res.data)) {
        setEventTypeOptions(res.data.map(et => ({ label: et, value: et })));
      }
    }).catch(() => setEventTypeOptions([]));
    // Fetch usernames
    api.get('/api/audittrail/usernames').then(res => {
      if (Array.isArray(res.data)) {
        setUserOptions(res.data.map(u => ({ label: u, value: u })));
      }
    }).catch(() => setUserOptions([]));
  }, []);

  // Form state
  const [form, setForm] = useState({
    startDate: "",
    endDate: "",
    eventTypes: [],
    usernames: []
  });
  // Validation state
  const [errors, setErrors] = useState({ startDate: "", endDate: "" });
  // Store last submitted form for pagination
  const [queryParams, setQueryParams] = useState(null);


  // Build query string for server fetch (with filter params)
  const buildQueryString = (pageNumber, pageSize, paramsObj = {}) => {
    const params = new URLSearchParams({
      page: pageNumber,
      pageSize: pageSize,
      ...paramsObj,
    });
    return params.toString();
  };

  // Fetch from backend (with filter params)
  const fetchLogs = async (pageNumber = 1, pageSize = 15, paramsObj = {}) => {
    setLoading(true);
    const query = buildQueryString(pageNumber, pageSize, paramsObj);
    try {
      const { data } = await api.get(`/api/audittrail?${query}`);
      setLogs(data.logs || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error("Error fetching audit logs:", err);
      setLogs([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };


  // On mount or whenever page or queryParams changes, fetch from server
  useEffect(() => {
    const currentPage = page.skip / page.take + 1;
    fetchLogs(currentPage, page.take, queryParams || {});
  }, [page, queryParams]);


  // Kendo’s filterChange handler (client-side)
  const handleFilterChange = (e) => {
    setFilter(e.filter);
  };



  // Handle form input change (with validation)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // Validation logic for date fields
    if (name === "startDate" || name === "endDate") {
      validateDates(name === "startDate" ? value : form.startDate, name === "endDate" ? value : form.endDate);
    }
  };

  // Handle MultiSelect change for usernames
  const handleUsernamesChange = (event) => {
    setForm((prev) => ({ ...prev, usernames: event.value }));
  };

  // Validation function
  const validateDates = (start, end) => {
    let startDate = start ? new Date(start) : null;
    let endDate = end ? new Date(end) : null;
    let now = new Date();
    let newErrors = { startDate: "", endDate: "" };

    if (startDate) {
      if (startDate > now) {
        newErrors.startDate = "Start time cannot be in the future.";
      }
      if (endDate && startDate >= endDate) {
        newErrors.startDate = "Start time must be before end time.";
        newErrors.endDate = "End time must be after start time.";
      }
    }
    setErrors(newErrors);
    return newErrors;
  };


  // Handle MultiSelect change for eventType (checkbox style)
  const handleEventTypesChange = (event) => {
    setForm((prev) => ({ ...prev, eventTypes: event.value }));
  };

  // itemRender for checkbox style
  const eventTypesItemRender = (li, itemProps) => {
    const itemChildren = (
      <span>
        <Checkbox
          name={itemProps.dataItem.value}
          checked={itemProps.selected}
          onChange={e => itemProps.onClick(itemProps.index, e)}
        >
          <Label className="k-checkbox-label">&nbsp;{li.props.children}</Label>
        </Checkbox>
      </span>
    );
    return React.cloneElement(li, li.props, itemChildren);
  };

  // Convert local datetime string (yyyy-MM-ddTHH:mm) to UTC ISO string
  const toUTCISOString = (localDateTimeStr) => {
    if (!localDateTimeStr) return "";
    // localDateTimeStr is in 'yyyy-MM-ddTHH:mm' format
    const localDate = new Date(localDateTimeStr);
    return localDate.toISOString(); // always UTC
  };

  // Handle form submit
  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Validate before submit
    const validation = validateDates(form.startDate, form.endDate);
    if (validation.startDate || validation.endDate) {
      return;
    }
    // Prepare params, only include non-empty
    const params = {};
    if (form.startDate) params.startDate = toUTCISOString(form.startDate);
    if (form.endDate) params.endDate = toUTCISOString(form.endDate);
    if (form.eventTypes && form.eventTypes.length > 0) {
      // Map to .value if objects, else use as is
      const eventTypeValues = form.eventTypes.map(et => typeof et === 'object' && et.value ? et.value : et);
      params.eventTypes = eventTypeValues.join(',');
    }
    if (form.usernames && form.usernames.length > 0) {
      // Map to .value if objects, else use as is
      const usernameValues = form.usernames.map(u => typeof u === 'object' && u.value ? u.value : u);
      params.usernames = usernameValues.join(',');
    }
    setQueryParams(params);
    setPage({ skip: 0, take: 15 }); // Reset to first page
  };



  return (
    <div>
      {/* Error messages at the top in a single line, wrap on small screens */}
      {(errors.startDate || errors.endDate) && (
        <div className="d-flex flex-wrap align-items-center mb-3 gap-2">
          {errors.startDate && <span className="text-danger small">{errors.startDate}</span>}
          {errors.endDate && <span className="text-danger small">{errors.endDate}</span>}
        </div>
      )}
      {/* Filter Form */}
      <form className="mb-4" onSubmit={handleFormSubmit}>
        <div className="row g-2 align-items-end">
          <div className="col-12 col-xl-2 col-lg-3 col-md-6 mb-2 mb-md-0">
            <FloatingLabelWrapper id="startDate" label="Start Date/Time" value={form.startDate}>
              <DateTimePicker
                name="startDate"
                value={form.startDate}
                onChange={handleInputChange}
                className="w-100"
                placeholder=""
                valid={!errors.startDate}
              />
            </FloatingLabelWrapper>
          </div>
          <div className="col-12 col-xl-2 col-lg-3 col-md-6 mb-2 mb-md-0">
            <FloatingLabelWrapper id="endDate" label="End Date/Time" value={form.endDate}>
              <DateTimePicker
                name="endDate"
                value={form.endDate}
                onChange={handleInputChange}
                className="w-100"
                placeholder=""
                valid={!errors.endDate}
              />
            </FloatingLabelWrapper>
          </div>
          <div className="col-12 col-xl-2 col-lg-3 col-md-6 mb-2 mb-md-0">
            <FloatingLabelWrapper id="eventTypes" label="Event Type" value={form.eventTypes}>
              <MultiSelect
                id="eventTypes"
                name="eventTypes"
                data={eventTypeOptions}
                value={form.eventTypes}
                onChange={handleEventTypesChange}
                textField="label"
                dataItemKey="value"
                // itemRender={eventTypesItemRender}
                autoClose={false}
                className="w-100"
                placeholder="Select Event Type(s)"
                tags={form.eventTypes.length > 0 ? [{ text: `${form.eventTypes.length} selected`, data: [...form.eventTypes] }] : []}
              />
            </FloatingLabelWrapper>
          </div>
          <div className="col-12 col-xl-2 col-lg-3 col-md-6 mb-2 mb-md-0">
            <FloatingLabelWrapper id="usernames" label="Username" value={form.usernames}>
              <MultiSelect
                id="usernames"
                name="usernames"
                data={userOptions}
                value={form.usernames}
                onChange={handleUsernamesChange}
                textField="label"
                dataItemKey="value"
                autoClose={false}
                className="w-100"
                placeholder="Select Username(s)"
                tags={form.usernames.length > 0 ? [{ text: `${form.usernames.length} selected`, data: [...form.usernames] }] : []}
              />
            </FloatingLabelWrapper>
          </div>
          <div className="col-12 col-xl-2 col-lg-12 col-md-12">
            <Button
              type="submit"
              themeColor="primary"
              disabled={loading}
              className="w-100 d-lg-none"
            >
              {loading ? "Loading..." : "Get Audit Logs"}
            </Button>
            <Button
              type="submit"
              themeColor="primary"
              disabled={loading}
              className="d-none d-lg-inline-block btn-sm"
            // size={'large'}
            >
              {loading ? "Loading..." : "Get Audit Logs"}
            </Button>
          </div>
        </div>
      </form>

      <div className="overflow-auto p-0 m-0" style={{ WebkitOverflowScrolling: 'touch' }}>
        <Grid
          data={process(logs, { filter }).data}
          skip={page.skip}
          take={page.take}
          total={total}
          pageable={{
            buttonCount: 5,
            // pageSizes: [15, 30, 50],
            info: true,
            previousNext: true,
          }}
          columnMenuIcon={filterIcon}
          sortable={true}
          filter={filter}
          onFilterChange={handleFilterChange}
          onPageChange={(e) => setPage(e.page)}
          loading={loading}
          dataItemKey="id"
          style={{ height: "550px" }}
        >
          <GridColumn
            field="date"
            title="Date Time"
            width="180px"
            cell={(props) => {
              const utcDate = new Date(props.dataItem.date);
              const localDate = new Date(utcDate.getTime() - utcDate.getTimezoneOffset() * 60000);
              // Format: 'MM/DD/YYYY HH:MM:SS AM/PM' (no comma, uppercase AM/PM)
              const locale = navigator.language || 'en-US';
              const dateStr = localDate.toLocaleDateString(locale);
              let timeStr = localDate.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', second: '2-digit' });
              // Ensure AM/PM is uppercase and no comma
              timeStr = timeStr.replace(/([ap]m)$/i, (m) => m.toUpperCase());
              return <td>{dateStr + ' ' + timeStr}</td>;
            }}
          />
          <GridColumn field="email" title="Username" width="180px" columnMenu={ColumnMenu} filterable />
          <GridColumn field="ip" title="IP Address" width="140px" columnMenu={ColumnMenu} filterable />
          <GridColumn field="eventType" title="Event Type" width="160px" columnMenu={ColumnMenu} filterable />
          <GridColumn field="reason" title="Reason" width="220px" />
          <GridColumn
            field="oldValue"
            title="Old Value"
            width="200px"
            cell={(props) => <td style={{ whiteSpace: "pre-line" }}>{props.dataItem.oldValue}</td>}
          />
          <GridColumn
            field="newValue"
            title="New Value"
            width="200px"
            cell={(props) => <td style={{ whiteSpace: "pre-line" }}>{props.dataItem.newValue}</td>}
          />
        </Grid>
      </div>
    </div>
  );
};

export default AuditTrail;
