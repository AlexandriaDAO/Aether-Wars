import { combineReducers } from "@reduxjs/toolkit";
import portalReducer from "@/features/portal/portalSlice";
import homeReducer from "@/features/home/homeSlice";
import authReducer from "@/features/auth/authSlice";
import searchReducer from "@/features/search/searchSlice";
import filterReducer from "@/features/filter/filterSlice";

import engineBooksReducer from "@/features/engine-books/engineBooksSlice";
import publicEnginesReducer from "@/features/public-engines/publicEnginesSlice";
import engineOverviewReducer from "@/features/engine-overview/engineOverviewSlice";
import portalCategoryReducer from "@/features/portal-category/portalCategorySlice";
import portalLanguageReducer from "@/features/portal-language/portalLanguageSlice";
import portalTypeReducer from "@/features/portal-type/portalTypeSlice";
import portalEraReducer from "@/features/portal-era/portalEraSlice";
import portalFilterReducer from "@/features/portal-filter/portalFilterSlice";

const rootReducer = combineReducers({
	home: homeReducer,
	auth: authReducer,
	search: searchReducer,
	filter: filterReducer,

	engineBooks: engineBooksReducer,
	publicEngines: publicEnginesReducer,
	engineOverview: engineOverviewReducer,

	portalCategory: portalCategoryReducer,
	portalLanguage: portalLanguageReducer,
	portalType: portalTypeReducer,
	portalEra: portalEraReducer,

	portalFilter: portalFilterReducer,

	portal: portalReducer,
});

export default rootReducer;
