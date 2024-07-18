import { combineReducers } from "@reduxjs/toolkit";
import portalReducer from "@/features/portal/portalSlice";
import homeReducer from "@/features/home/homeSlice";
import authReducer from "@/features/auth/authSlice";
import searchReducer from "@/features/search/searchSlice";
import filterReducer from "@/features/filter/filterSlice";

import myEnginesReducer from "@/features/my-engines/myEnginesSlice";
import publicEnginesReducer from "@/features/public-engines/publicEnginesSlice";
import engineOverviewReducer from "@/features/engine-overview/engineOverviewSlice";
import portalCategoryReducer from "@/features/portal-category/portalCategorySlice";
import portalLanguageReducer from "@/features/portal-language/portalLanguageSlice";
import portalTypeReducer from "@/features/portal-type/portalTypeSlice";
import portalPublicationYearReducer from "@/features/portal-publication-year/portalPublicationYearSlice";
import portalFilterReducer from "@/features/portal-filter/portalFilterSlice";
import librarianReducer from "@/features/librarian/librarianSlice";
import librarianProfileReducer from "@/features/librarian-profile/librarianProfileSlice";
import myNodesReducer from "@/features/my-nodes/myNodesSlice";
import swapReducer from "@/features/swap/swapSlice"
import icpLedgerReducer from "@/features/icp-ledger/icpLedgerSlice";
import tokenomicsReducer from "@/features/swap/tokenomicsSilce";
const rootReducer = combineReducers({
	home: homeReducer,
	auth: authReducer,
	search: searchReducer,
	filter: filterReducer,

	myEngines: myEnginesReducer,
	publicEngines: publicEnginesReducer,
	engineOverview: engineOverviewReducer,

	portalCategory: portalCategoryReducer,
	portalLanguage: portalLanguageReducer,
	portalType: portalTypeReducer,
	portalPublicationYear: portalPublicationYearReducer,

	portalFilter: portalFilterReducer,

	librarian: librarianReducer,
	librarianProfile: librarianProfileReducer,

	myNodes: myNodesReducer,
	swap:swapReducer,
	icpLedger:icpLedgerReducer,
	tokenomics:tokenomicsReducer,



	portal: portalReducer,
});

export default rootReducer;
