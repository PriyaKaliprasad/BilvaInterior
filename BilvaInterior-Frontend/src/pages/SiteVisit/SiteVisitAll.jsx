import React, { useState, useEffect } from "react";
import { Loader } from '@progress/kendo-react-indicators';
import { Grid, GridColumn } from '@progress/kendo-react-grid';
import { Button } from '@progress/kendo-react-buttons';
import SiteVisitNew from './SiteVisitNew';
import api from '../../api/axios';


const SiteVisitAll = () => {
	const [siteVisits, setSiteVisits] = useState([]);
	const [skip, setSkip] = useState(0);
	const [take, setTake] = useState(10);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [isMobile, setIsMobile] = useState(
		typeof window !== 'undefined' ? window.innerWidth <= 600 : false
	);
	const [showAdd, setShowAdd] = useState(false);

	// Fetch site visit data
	const fetchData = async () => {
		setLoading(true);
		setError('');
		try {
			const res = await api.get('/api/sitevisit');
			setSiteVisits(res.data || []);
		} catch (err) {
			setError('Failed to fetch site visits');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);
	useEffect(() => {
		const onResize = () => setIsMobile(window.innerWidth <= 600);
		window.addEventListener('resize', onResize);
		return () => window.removeEventListener('resize', onResize);
	}, []);

	// Format date for display in IST (like AuditTrail)
	const formatDate = (dateStr) => {
		if (!dateStr) return '';
		const utcDate = new Date(dateStr);
		// Convert to IST (UTC+5:30)
		const IST_OFFSET = 5.5 * 60; // in minutes
		const istDate = new Date(utcDate.getTime() + IST_OFFSET * 60000);
		const locale = navigator.language || 'en-US';
		const dateStrLocal = istDate.toLocaleDateString(locale);
		let timeStr = istDate.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', second: '2-digit' });
		timeStr = timeStr.replace(/([ap]m)$/i, (m) => m.toUpperCase());
		return dateStrLocal + ' ' + timeStr;
	};

	// Get full name from lastModifiedBy
	const getUserName = (user) => {
		if (!user) return '';
		return [user.firstName, user.lastName].filter(Boolean).join(' ');
	};

	// Actions cell
	const ActionCell = (props) => (
		<td>
			<Button icon="edit" size="small" style={{ marginRight: 8 }} onClick={() => alert('Edit ' + props.dataItem.id)} />
			<Button icon="delete" size="small" themeColor="error" onClick={() => alert('Delete ' + props.dataItem.id)} />
		</td>
	);


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
						<SiteVisitNew />
					</>
				);
			}

			return (
				<main className="page-container">
					{/* Action Bar: Always visible, sticky */}
					<div style={actionBarStyle} className="sitevisit-action-bar">
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

					{/* Desktop / Tablet: Kendo Grid. Mobile: card list (not implemented, fallback to grid) */}
					<div className="card grid-wrapper">
						{error && <div className="error-box">{error}</div>}
						<div className="table-responsive" style={{ position: 'relative' }}>
							{loading && (
								<div style={{
									position: 'absolute',
									top: 0,
									left: 0,
									width: '100%',
									height: '100%',
									background: 'rgba(255,255,255,0.7)',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									zIndex: 10
								}}>
									<Loader size="large" type="infinite-spinner" />
								</div>
							)}
							<Grid
								data={siteVisits.slice(skip, skip + take)}
								pageable={true}
								skip={skip}
								take={take}
								total={siteVisits.length}
								onPageChange={e => { setSkip(e.page.skip); setTake(e.page.take); }}
								style={{ minWidth: 900, border: 'none' }}
								dataItemKey="id"
								loading={loading}
								resizable={true}
								noRecords={<div style={{ textAlign: 'center', padding: 24 }}>No records available</div>}
							>
								<GridColumn field="projectName" title="Project Name" width="160px" cell={props => <td>{props.dataItem.project?.name || ''}</td>} />
								<GridColumn field="lastModifiedUtc" title="Last Modified At" width="220px" cell={props => <td>{formatDate(props.dataItem.lastModifiedUtc)}</td>} />
								<GridColumn field="lastModifiedBy" title="Last Modified By" width="220px" cell={props => <td>{getUserName(props.dataItem.lastModifiedBy)}</td>} />
								<GridColumn title="Actions" width="160px" cell={ActionCell} />
							</Grid>
						</div>
					</div>
						</main>
		);
		}

		export default SiteVisitAll;
