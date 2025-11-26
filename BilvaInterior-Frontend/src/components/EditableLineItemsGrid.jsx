import React, { useState, useEffect } from 'react';
import { Button } from '@progress/kendo-react-buttons';

// EditableLineItemsGrid: A manual editable grid for line items
// Props:
//   value: array of line items
//   onChange: function(newLineItems) => void
//   columns: array of { field, title, type }
//
// Behavior:
//   - Always has an empty row at the end
//   - Editing a cell updates the row
//   - If a non-last row is made empty, it is deleted
//   - Adding data to the last row creates a new empty row
//   - Delete button removes a row (except last empty row)

const isRowEmpty = (item, columns) => {
  return columns.every(col => {
    if (col.field === 'id') return true;
    return !item[col.field] && item[col.field] !== 0;
  });
};


const EditableLineItemsGrid = ({ value, onChange, columns, errors = [] }) => {
  const [rows, setRows] = useState([]);
  // Track which cell is being edited: { rowIdx, field } or null
  const [editingCell, setEditingCell] = useState(null);

  // Sync with parent
  useEffect(() => {
    setRows(value);
  }, [value]);

  // Handle cell edit
  const handleCellChange = (rowIdx, field, newValue) => {
    let updated = rows.map((row, idx) =>
      idx === rowIdx ? { ...row, [field]: newValue } : row
    );

    // Remove any non-last row that is now empty
    updated = updated.filter((item, idx) => {
      if (idx === updated.length - 1) return true;
      return !isRowEmpty(item, columns);
    });

    // If last row is not empty, add a new empty row
    const last = updated[updated.length - 1];
    if (!isRowEmpty(last, columns)) {
      const maxId = updated.length ? Math.max(...updated.map(i => i.id || 0)) : 0;
      const emptyRow = { id: maxId + 1 };
      columns.forEach(col => {
        if (col.field !== 'id') emptyRow[col.field] = '';
      });
      updated.push(emptyRow);
    }
    setRows(updated);
    onChange(updated);
  };

  // Handle delete
  const handleDelete = (rowIdx) => {
    let updated = rows.filter((_, idx) => idx !== rowIdx);
    // Always ensure one empty row at the end
    if (!updated.length || !isRowEmpty(updated[updated.length - 1], columns)) {
      const maxId = updated.length ? Math.max(...updated.map(i => i.id || 0)) : 0;
      const emptyRow = { id: maxId + 1 };
      columns.forEach(col => {
        if (col.field !== 'id') emptyRow[col.field] = '';
      });
      updated.push(emptyRow);
    }
    setRows(updated);
    onChange(updated);
  };

  // Handle cell click to activate editing
  const handleCellClick = (rowIdx, field) => {
    setEditingCell({ rowIdx, field });
  };

  // Handle blur to deactivate editing
  const handleCellBlur = () => {
    setEditingCell(null);
  };

  // Fixed width for each cell (px)
  const CELL_WIDTH = 160;
  const ACTIONS_WIDTH = 80;

  return (
    <div style={{ overflowX: 'auto', width: '100%' }}>
      <table className="table table-bordered" style={{ minWidth: columns.length * CELL_WIDTH + ACTIONS_WIDTH }}>
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col.field} style={{ minWidth: CELL_WIDTH, maxWidth: CELL_WIDTH, width: CELL_WIDTH }}>{col.title}</th>
            ))}
            <th style={{ minWidth: ACTIONS_WIDTH, maxWidth: ACTIONS_WIDTH, width: ACTIONS_WIDTH }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIdx) => (
            <tr key={row.id || rowIdx}>
              {columns.map(col => {
                const isEditing = editingCell && editingCell.rowIdx === rowIdx && editingCell.field === col.field;
                return (
                  <td
                    key={col.field}
                    onClick={() => !col.readOnly && handleCellClick(rowIdx, col.field)}
                    style={{
                      cursor: col.readOnly ? 'not-allowed' : 'pointer',
                      minWidth: CELL_WIDTH,
                      maxWidth: CELL_WIDTH,
                      width: CELL_WIDTH,
                      verticalAlign: 'middle',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {isEditing ? (
                      col.type === 'numeric' ? (
                        <input
                          type="number"
                          value={row[col.field] || ''}
                          onChange={e => handleCellChange(rowIdx, col.field, e.target.value === '' ? '' : Number(e.target.value))}
                          onBlur={handleCellBlur}
                          autoFocus
                          className={`form-control ${errors[rowIdx]?.[col.field] ? "input-error" : ""}`}
                          disabled={col.readOnly}
                          style={{ minWidth: CELL_WIDTH - 10, maxWidth: CELL_WIDTH - 10 }}
                        />
                      ) : (
                        <input
                          type="text"
                          value={row[col.field] || ''}
                          onChange={e => handleCellChange(rowIdx, col.field, e.target.value)}
                          onBlur={handleCellBlur}
                          autoFocus
                          className={`form-control ${errors[rowIdx]?.[col.field] ? "input-error" : ""}`}
                          disabled={col.readOnly}
                          style={{ minWidth: CELL_WIDTH - 10, maxWidth: CELL_WIDTH - 10 }}
                        />
                      )
                    ) : (
                      <span style={{ display: 'inline-block', width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row[col.field]}</span>
                    )}

                    {errors[rowIdx]?.[col.field] && (
    <div className="text-danger small">
        {errors[rowIdx][col.field]}
    </div>
)}

                  </td>
                );
              })}
              <td style={{ minWidth: ACTIONS_WIDTH, maxWidth: ACTIONS_WIDTH, width: ACTIONS_WIDTH, textAlign: 'center', verticalAlign: 'middle' }}>
                {rows.length > 1 && rowIdx !== rows.length - 1 && (
                  <Button type="button" size="small" icon="delete" onClick={() => handleDelete(rowIdx)} />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EditableLineItemsGrid;
