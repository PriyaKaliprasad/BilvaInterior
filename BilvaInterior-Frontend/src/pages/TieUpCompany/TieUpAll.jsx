import React from "react";
import { ListView } from "@progress/kendo-react-listview";
import CustomAvatar from "../../components/Avatar/CustomAvatar";
import { Button } from "@progress/kendo-react-buttons";
import "./TieUpAll.css";

const companies = [
    {
        id: 1,
        logo: "A",
        code: "CMP001",
        contact: "John Doe",
        phone: "1234567890",
        city: "New Hampshire",
        state: "NY",
        gstin: "12ABCDE1234F1Z5",
        template: "Standard",
        status: "Active",
    },
    {
        id: 2,
        logo: "B",
        code: "CMP002",
        contact: "Jane Smith",
        phone: "9876543210",
        city: "London",
        state: "LN",
        gstin: "22FGHIJ5678K2L6",
        template: "Custom",
        status: "Inactive",
    },
    {
        id: 3,
        logo: "C",
        code: "CMP003",
        contact: "Alice Brown",
        phone: "5551234567",
        city: "San Francisco",
        state: "CA",
        gstin: "33KLMNO9012P3Q7",
        template: "Standard",
        status: "Active",
    },
    {
        id: 4,
        logo: "D",
        code: "CMP004",
        contact: "Bob Lee",
        phone: "4449876543",
        city: "Berlin",
        state: "BE",
        gstin: "44PQRST3456U4V8",
        template: "Custom",
        status: "Inactive",
    },
    {
        id: 5,
        logo: "E",
        code: "CMP005",
        contact: "Carlos Gomez",
        phone: "3332221111",
        city: "Madrid",
        state: "MD",
        gstin: "55UVWXY7890Z5A9",
        template: "Standard",
        status: "Active",
    },
    {
        id: 6,
        logo: "F",
        code: "CMP006",
        contact: "Diana Prince",
        phone: "2223334444",
        city: "Paris",
        state: "PA",
        gstin: "66BCDEF1234G6H0",
        template: "Custom",
        status: "Inactive",
    },
];

// placeholder for profile image (cleanup later)
const getRandomDiceBearUrl = (dataItem) => {
  // Combine company id + random number to get unique image every render
  const randomSeed = `${dataItem.id}-${Math.random()}`;
  return `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(randomSeed)}`;
};

const ListViewItem = (props) => {
    const { dataItem } = props;
    return (
        <div className="tieup-list-row">
            <div className="tieup-list-logo tieup-list-cell">
                <CustomAvatar src={getRandomDiceBearUrl(dataItem)} height={40} />
            </div>
            <div className="tieup-list-code tieup-list-cell">{dataItem.code}</div>
            <div className="tieup-list-contact tieup-list-cell">{dataItem.contact}</div>
            <div className="tieup-list-phone tieup-list-cell">{dataItem.phone}</div>
            <div className="tieup-list-city tieup-list-cell">{dataItem.city}</div>
            <div className="tieup-list-state tieup-list-cell">{dataItem.state}</div>
            <div className="tieup-list-gstin tieup-list-cell">{dataItem.gstin}</div>
            <div className="tieup-list-template tieup-list-cell">{dataItem.template}</div>
            <div className="tieup-list-status tieup-list-cell">{dataItem.status}</div>
            <div className="tieup-list-actions tieup-list-cell">
                <Button size="small" themeColor="primary">Edit</Button>
            </div>
        </div>
    );
};

const ListViewHeader = () => (
    <div className="tieup-list-header">
        <div className="tieup-list-header-logo tieup-list-header-cell"></div>
        <div className="tieup-list-header-code tieup-list-header-cell">Code</div>
        <div className="tieup-list-header-contact tieup-list-header-cell">Contact</div>
        <div className="tieup-list-header-phone tieup-list-header-cell">Phone</div>
        <div className="tieup-list-header-city tieup-list-header-cell">City</div>
        <div className="tieup-list-header-state tieup-list-header-cell">State</div>
        <div className="tieup-list-header-gstin tieup-list-header-cell">GSTIN</div>
        <div className="tieup-list-header-template tieup-list-header-cell">Template</div>
        <div className="tieup-list-header-status tieup-list-header-cell">Status</div>
        <div className="tieup-list-header-actions tieup-list-header-cell">Actions</div>
    </div>
);


const TieUpAll = () => {
    return (
        <div className="tieup-list-container">
            <div className="tieup-list-inner">
                <ListViewHeader />
                <ListView data={companies} item={ListViewItem} />
            </div>
        </div>
    );
};

export default TieUpAll;