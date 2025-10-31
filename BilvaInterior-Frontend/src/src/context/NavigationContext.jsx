import React, { createContext, useContext } from "react";
import { sidebarLinks } from "../components/Sidebar/sidebarLinks";

// Recursively find the breadcrumb trail for a given path
function findNavTrail(links, pathname, trail = []) {
	for (const item of links) {
		if (item.route === pathname) {
			return [...trail, item.title];
		}
		if (item.children) {
			const childTrail = findNavTrail(item.children, pathname, [...trail, item.title]);
			if (childTrail.length) return childTrail;
		}
	}
	return [];
}

// Get parent section (first in trail) and breadcrumb
function getNavInfo(pathname) {
	const trail = findNavTrail(sidebarLinks, pathname);
	return {
		parent: trail.length > 1 ? trail[0] : trail[0] || "",
		breadcrumb: trail,
	};
}

// Context setup as a provider
const NavigationContext = createContext();

export const NavigationProvider = ({ children }) => {
	return (
		<NavigationContext.Provider value={{ getNavInfo }}>
			{children}
		</NavigationContext.Provider>
	);
};

export const useNavigation = () => useContext(NavigationContext);
