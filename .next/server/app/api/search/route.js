/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/search/route";
exports.ids = ["app/api/search/route"];
exports.modules = {

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "../app-render/after-task-async-storage.external":
/*!***********************************************************************************!*\
  !*** external "next/dist/server/app-render/after-task-async-storage.external.js" ***!
  \***********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/after-task-async-storage.external.js");

/***/ }),

/***/ "../app-render/work-async-storage.external":
/*!*****************************************************************************!*\
  !*** external "next/dist/server/app-render/work-async-storage.external.js" ***!
  \*****************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-async-storage.external.js");

/***/ }),

/***/ "./work-unit-async-storage.external":
/*!**********************************************************************************!*\
  !*** external "next/dist/server/app-render/work-unit-async-storage.external.js" ***!
  \**********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-unit-async-storage.external.js");

/***/ }),

/***/ "sqlite3":
/*!**************************!*\
  !*** external "sqlite3" ***!
  \**************************/
/***/ ((module) => {

"use strict";
module.exports = require("sqlite3");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("https");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ "(rsc)/./node_modules/.pnpm/next@15.2.0-canary.3_react-dom@19.0.0_react@19.0.0__react@19.0.0/node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fsearch%2Froute&page=%2Fapi%2Fsearch%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fsearch%2Froute.js&appDir=%2Fhome%2Fmike%2FCODE%2Faccess-youtube%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Fmike%2FCODE%2Faccess-youtube&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/next@15.2.0-canary.3_react-dom@19.0.0_react@19.0.0__react@19.0.0/node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fsearch%2Froute&page=%2Fapi%2Fsearch%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fsearch%2Froute.js&appDir=%2Fhome%2Fmike%2FCODE%2Faccess-youtube%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Fmike%2FCODE%2Faccess-youtube&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/.pnpm/next@15.2.0-canary.3_react-dom@19.0.0_react@19.0.0__react@19.0.0/node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/.pnpm/next@15.2.0-canary.3_react-dom@19.0.0_react@19.0.0__react@19.0.0/node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/.pnpm/next@15.2.0-canary.3_react-dom@19.0.0_react@19.0.0__react@19.0.0/node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _home_mike_CODE_access_youtube_app_api_search_route_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/search/route.js */ \"(rsc)/./app/api/search/route.js\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/search/route\",\n        pathname: \"/api/search\",\n        filename: \"route\",\n        bundlePath: \"app/api/search/route\"\n    },\n    resolvedPagePath: \"/home/mike/CODE/access-youtube/app/api/search/route.js\",\n    nextConfigOutput,\n    userland: _home_mike_CODE_access_youtube_app_api_search_route_js__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvLnBucG0vbmV4dEAxNS4yLjAtY2FuYXJ5LjNfcmVhY3QtZG9tQDE5LjAuMF9yZWFjdEAxOS4wLjBfX3JlYWN0QDE5LjAuMC9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZzZWFyY2glMkZyb3V0ZSZwYWdlPSUyRmFwaSUyRnNlYXJjaCUyRnJvdXRlJmFwcFBhdGhzPSZwYWdlUGF0aD1wcml2YXRlLW5leHQtYXBwLWRpciUyRmFwaSUyRnNlYXJjaCUyRnJvdXRlLmpzJmFwcERpcj0lMkZob21lJTJGbWlrZSUyRkNPREUlMkZhY2Nlc3MteW91dHViZSUyRmFwcCZwYWdlRXh0ZW5zaW9ucz10c3gmcGFnZUV4dGVuc2lvbnM9dHMmcGFnZUV4dGVuc2lvbnM9anN4JnBhZ2VFeHRlbnNpb25zPWpzJnJvb3REaXI9JTJGaG9tZSUyRm1pa2UlMkZDT0RFJTJGYWNjZXNzLXlvdXR1YmUmaXNEZXY9dHJ1ZSZ0c2NvbmZpZ1BhdGg9dHNjb25maWcuanNvbiZiYXNlUGF0aD0mYXNzZXRQcmVmaXg9Jm5leHRDb25maWdPdXRwdXQ9JnByZWZlcnJlZFJlZ2lvbj0mbWlkZGxld2FyZUNvbmZpZz1lMzAlM0QhIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQStGO0FBQ3ZDO0FBQ3FCO0FBQ007QUFDbkY7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLHlHQUFtQjtBQUMzQztBQUNBLGNBQWMsa0VBQVM7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLFlBQVk7QUFDWixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsUUFBUSxzREFBc0Q7QUFDOUQ7QUFDQSxXQUFXLDRFQUFXO0FBQ3RCO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDMEY7O0FBRTFGIiwic291cmNlcyI6WyIiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXBwUm91dGVSb3V0ZU1vZHVsZSB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL3JvdXRlLW1vZHVsZXMvYXBwLXJvdXRlL21vZHVsZS5jb21waWxlZFwiO1xuaW1wb3J0IHsgUm91dGVLaW5kIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcm91dGUta2luZFwiO1xuaW1wb3J0IHsgcGF0Y2hGZXRjaCBhcyBfcGF0Y2hGZXRjaCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2xpYi9wYXRjaC1mZXRjaFwiO1xuaW1wb3J0ICogYXMgdXNlcmxhbmQgZnJvbSBcIi9ob21lL21pa2UvQ09ERS9hY2Nlc3MteW91dHViZS9hcHAvYXBpL3NlYXJjaC9yb3V0ZS5qc1wiO1xuLy8gV2UgaW5qZWN0IHRoZSBuZXh0Q29uZmlnT3V0cHV0IGhlcmUgc28gdGhhdCB3ZSBjYW4gdXNlIHRoZW0gaW4gdGhlIHJvdXRlXG4vLyBtb2R1bGUuXG5jb25zdCBuZXh0Q29uZmlnT3V0cHV0ID0gXCJcIlxuY29uc3Qgcm91dGVNb2R1bGUgPSBuZXcgQXBwUm91dGVSb3V0ZU1vZHVsZSh7XG4gICAgZGVmaW5pdGlvbjoge1xuICAgICAgICBraW5kOiBSb3V0ZUtpbmQuQVBQX1JPVVRFLFxuICAgICAgICBwYWdlOiBcIi9hcGkvc2VhcmNoL3JvdXRlXCIsXG4gICAgICAgIHBhdGhuYW1lOiBcIi9hcGkvc2VhcmNoXCIsXG4gICAgICAgIGZpbGVuYW1lOiBcInJvdXRlXCIsXG4gICAgICAgIGJ1bmRsZVBhdGg6IFwiYXBwL2FwaS9zZWFyY2gvcm91dGVcIlxuICAgIH0sXG4gICAgcmVzb2x2ZWRQYWdlUGF0aDogXCIvaG9tZS9taWtlL0NPREUvYWNjZXNzLXlvdXR1YmUvYXBwL2FwaS9zZWFyY2gvcm91dGUuanNcIixcbiAgICBuZXh0Q29uZmlnT3V0cHV0LFxuICAgIHVzZXJsYW5kXG59KTtcbi8vIFB1bGwgb3V0IHRoZSBleHBvcnRzIHRoYXQgd2UgbmVlZCB0byBleHBvc2UgZnJvbSB0aGUgbW9kdWxlLiBUaGlzIHNob3VsZFxuLy8gYmUgZWxpbWluYXRlZCB3aGVuIHdlJ3ZlIG1vdmVkIHRoZSBvdGhlciByb3V0ZXMgdG8gdGhlIG5ldyBmb3JtYXQuIFRoZXNlXG4vLyBhcmUgdXNlZCB0byBob29rIGludG8gdGhlIHJvdXRlLlxuY29uc3QgeyB3b3JrQXN5bmNTdG9yYWdlLCB3b3JrVW5pdEFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MgfSA9IHJvdXRlTW9kdWxlO1xuZnVuY3Rpb24gcGF0Y2hGZXRjaCgpIHtcbiAgICByZXR1cm4gX3BhdGNoRmV0Y2goe1xuICAgICAgICB3b3JrQXN5bmNTdG9yYWdlLFxuICAgICAgICB3b3JrVW5pdEFzeW5jU3RvcmFnZVxuICAgIH0pO1xufVxuZXhwb3J0IHsgcm91dGVNb2R1bGUsIHdvcmtBc3luY1N0b3JhZ2UsIHdvcmtVbml0QXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcywgcGF0Y2hGZXRjaCwgIH07XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFwcC1yb3V0ZS5qcy5tYXAiXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/.pnpm/next@15.2.0-canary.3_react-dom@19.0.0_react@19.0.0__react@19.0.0/node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fsearch%2Froute&page=%2Fapi%2Fsearch%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fsearch%2Froute.js&appDir=%2Fhome%2Fmike%2FCODE%2Faccess-youtube%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Fmike%2FCODE%2Faccess-youtube&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./node_modules/.pnpm/next@15.2.0-canary.3_react-dom@19.0.0_react@19.0.0__react@19.0.0/node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/next@15.2.0-canary.3_react-dom@19.0.0_react@19.0.0__react@19.0.0/node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "(ssr)/./node_modules/.pnpm/next@15.2.0-canary.3_react-dom@19.0.0_react@19.0.0__react@19.0.0/node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/next@15.2.0-canary.3_react-dom@19.0.0_react@19.0.0__react@19.0.0/node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "(rsc)/./app/api/search/route.js":
/*!*********************************!*\
  !*** ./app/api/search/route.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/.pnpm/next@15.2.0-canary.3_react-dom@19.0.0_react@19.0.0__react@19.0.0/node_modules/next/dist/api/server.js\");\n/* harmony import */ var scrape_youtube__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! scrape-youtube */ \"(rsc)/./node_modules/.pnpm/scrape-youtube@2.4.0/node_modules/scrape-youtube/lib/index.js\");\n/* harmony import */ var scrape_youtube__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(scrape_youtube__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var sqlite3__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! sqlite3 */ \"sqlite3\");\n/* harmony import */ var sqlite3__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(sqlite3__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! path */ \"path\");\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_3__);\n\n\n\n\n// Construct the path to the SQLite database file\nconst dbPath = path__WEBPACK_IMPORTED_MODULE_3___default().join(process.cwd(), 'lib', 'db', 'db.sqlite');\n// Initialize the database connection\nconst db = new (sqlite3__WEBPACK_IMPORTED_MODULE_2___default().Database)(dbPath, (err)=>{\n    if (err) {\n        console.error(\"Failed to connect to database:\", err);\n    } else {\n        console.log(\"Successfully connected to the database.\");\n    }\n});\nasync function isBadWordPresent(query) {\n    return new Promise((resolve, reject)=>{\n        const sql = `SELECT word FROM bad_words WHERE ? LIKE '% ' || word || ' %' OR ? LIKE word || ' %' OR ? LIKE '% ' || word OR ? = word`;\n        db.get(sql, [\n            query.toLowerCase(),\n            query.toLowerCase(),\n            query.toLowerCase(),\n            query.toLowerCase()\n        ], (err, row)=>{\n            if (err) {\n                console.error(\"Database error:\", err);\n                reject(err);\n            } else {\n                const isBad = !!row;\n                resolve(isBad);\n            }\n        });\n    });\n}\n// Wrap the YouTube search logic in use cache\nasync function getYouTubeSearchResults(searchTerm) {\n    // 'use cache';  // Temporarily disabled for testing\n    console.log(\"Fetching results from YouTube (uncached)...\");\n    // Log the exact options we're using\n    const options = {\n        type: 'video',\n        safeSearch: true,\n        request: {\n            headers: {\n                // Cookie removed for testing\n                // Add User-Agent as YouTube might be checking this\n                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',\n                // Add Accept-Language to ensure we get English results\n                'Accept-Language': 'en-US,en;q=0.9'\n            }\n        }\n    };\n    console.log('Search options:', JSON.stringify(options, null, 2));\n    const searchResults = await scrape_youtube__WEBPACK_IMPORTED_MODULE_1__.youtube.search(searchTerm, options);\n    // Log more details about the results\n    if (searchResults.videos.length > 0) {\n        console.log(`Found ${searchResults.videos.length} results`);\n        console.log(\"First result:\", {\n            title: searchResults.videos[0].title,\n            duration: searchResults.videos[0].duration,\n            uploaded: searchResults.videos[0].uploaded,\n            views: searchResults.videos[0].views\n        });\n    }\n    return {\n        videos: searchResults.videos\n    };\n}\nasync function GET(request) {\n    const { searchParams } = new URL(request.url);\n    const searchTerm = searchParams.get('term');\n    if (!searchTerm) {\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: 'Search term is required'\n        }, {\n            status: 400\n        });\n    }\n    // Check for bad words in the search term *before* scraping\n    const isBad = await isBadWordPresent(searchTerm);\n    if (isBad) {\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: 'Search query contains inappropriate content.'\n        }, {\n            status: 400\n        });\n    }\n    try {\n        const requestTime = Date.now();\n        const { videos } = await getYouTubeSearchResults(searchTerm);\n        const executionTime = Date.now() - requestTime;\n        // If execution time is very short (less than 50ms), it's likely cached\n        const cached = executionTime < 50;\n        console.log(`YouTube search results (cached: ${cached}, execution time: ${executionTime}ms)`);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            videos,\n            cached\n        });\n    } catch (error) {\n        console.error('Error during scraping:', error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: 'Failed to fetch search results'\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QyxHQUFHO1FBQzVCLE1BQU0sRUFBRWQsTUFBTSxFQUFFLEdBQUcsTUFBTVgsd0JBQXdCQztRQUNqRCxNQUFNeUIsZ0JBQWdCRixLQUFLQyxHQUFHLEtBQUtGO1FBRW5DLHVFQUF1RTtRQUN2RSxNQUFNSSxTQUFTRCxnQkFBZ0I7UUFDL0J2QyxRQUFRRSxHQUFHLENBQUMsQ0FBQyxnQ0FBZ0MsRUFBRXNDLE9BQU8sa0JBQWtCLEVBQUVELGNBQWMsR0FBRyxDQUFDO1FBRTVGLE9BQU9sRCxxREFBWUEsQ0FBQzZDLElBQUksQ0FBQztZQUFFVjtZQUFRZ0I7UUFBTztJQUM1QyxFQUFFLE9BQU92QyxPQUFPO1FBQ2RELFFBQVFDLEtBQUssQ0FBQywwQkFBMEJBO1FBQ3hDLE9BQU9aLHFEQUFZQSxDQUFDNkMsSUFBSSxDQUFDO1lBQUVqQyxPQUFPO1FBQWlDLEdBQUc7WUFBRWtDLFFBQVE7UUFBSTtJQUN0RjtBQUNGIiwic291cmNlcyI6WyIvaG9tZS9taWtlL0NPREUvYWNjZXNzLXlvdXR1YmUvYXBwL2FwaS9zZWFyY2gvcm91dGUuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmV4dFJlc3BvbnNlIH0gZnJvbSAnbmV4dC9zZXJ2ZXInO1xuaW1wb3J0IHsgeW91dHViZSB9IGZyb20gJ3NjcmFwZS15b3V0dWJlJztcbmltcG9ydCBzcWxpdGUzIGZyb20gJ3NxbGl0ZTMnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5cbi8vIENvbnN0cnVjdCB0aGUgcGF0aCB0byB0aGUgU1FMaXRlIGRhdGFiYXNlIGZpbGVcbmNvbnN0IGRiUGF0aCA9IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCAnbGliJywgJ2RiJywgJ2RiLnNxbGl0ZScpO1xuXG4vLyBJbml0aWFsaXplIHRoZSBkYXRhYmFzZSBjb25uZWN0aW9uXG5jb25zdCBkYiA9IG5ldyBzcWxpdGUzLkRhdGFiYXNlKGRiUGF0aCwgKGVycikgPT4ge1xuICBpZiAoZXJyKSB7XG4gICAgY29uc29sZS5lcnJvcihcIkZhaWxlZCB0byBjb25uZWN0IHRvIGRhdGFiYXNlOlwiLCBlcnIpO1xuICB9IGVsc2Uge1xuICAgIGNvbnNvbGUubG9nKFwiU3VjY2Vzc2Z1bGx5IGNvbm5lY3RlZCB0byB0aGUgZGF0YWJhc2UuXCIpO1xuICB9XG59KTtcblxuYXN5bmMgZnVuY3Rpb24gaXNCYWRXb3JkUHJlc2VudChxdWVyeSkge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGNvbnN0IHNxbCA9IGBTRUxFQ1Qgd29yZCBGUk9NIGJhZF93b3JkcyBXSEVSRSA/IExJS0UgJyUgJyB8fCB3b3JkIHx8ICcgJScgT1IgPyBMSUtFIHdvcmQgfHwgJyAlJyBPUiA/IExJS0UgJyUgJyB8fCB3b3JkIE9SID8gPSB3b3JkYDtcbiAgICBkYi5nZXQoc3FsLCBbcXVlcnkudG9Mb3dlckNhc2UoKSwgcXVlcnkudG9Mb3dlckNhc2UoKSwgcXVlcnkudG9Mb3dlckNhc2UoKSwgcXVlcnkudG9Mb3dlckNhc2UoKV0sIChlcnIsIHJvdykgPT4ge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiRGF0YWJhc2UgZXJyb3I6XCIsIGVycik7XG4gICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgaXNCYWQgPSAhIXJvdztcbiAgICAgICAgcmVzb2x2ZShpc0JhZCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xufVxuXG4vLyBXcmFwIHRoZSBZb3VUdWJlIHNlYXJjaCBsb2dpYyBpbiB1c2UgY2FjaGVcbmFzeW5jIGZ1bmN0aW9uIGdldFlvdVR1YmVTZWFyY2hSZXN1bHRzKHNlYXJjaFRlcm0pIHtcbiAgLy8gJ3VzZSBjYWNoZSc7ICAvLyBUZW1wb3JhcmlseSBkaXNhYmxlZCBmb3IgdGVzdGluZ1xuICBjb25zb2xlLmxvZyhcIkZldGNoaW5nIHJlc3VsdHMgZnJvbSBZb3VUdWJlICh1bmNhY2hlZCkuLi5cIik7XG4gIFxuICAvLyBMb2cgdGhlIGV4YWN0IG9wdGlvbnMgd2UncmUgdXNpbmdcbiAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICB0eXBlOiAndmlkZW8nLFxuICAgIHNhZmVTZWFyY2g6IHRydWUsXG4gICAgcmVxdWVzdDoge1xuICAgICAgaGVhZGVyczoge1xuICAgICAgICAvLyBDb29raWUgcmVtb3ZlZCBmb3IgdGVzdGluZ1xuICAgICAgICAvLyBBZGQgVXNlci1BZ2VudCBhcyBZb3VUdWJlIG1pZ2h0IGJlIGNoZWNraW5nIHRoaXNcbiAgICAgICAgJ1VzZXItQWdlbnQnOiAnTW96aWxsYS81LjAgKFdpbmRvd3MgTlQgMTAuMDsgV2luNjQ7IHg2NCkgQXBwbGVXZWJLaXQvNTM3LjM2JyxcbiAgICAgICAgLy8gQWRkIEFjY2VwdC1MYW5ndWFnZSB0byBlbnN1cmUgd2UgZ2V0IEVuZ2xpc2ggcmVzdWx0c1xuICAgICAgICAnQWNjZXB0LUxhbmd1YWdlJzogJ2VuLVVTLGVuO3E9MC45JyxcbiAgICAgIH0sXG4gICAgfSxcbiAgfTtcbiAgXG4gIGNvbnNvbGUubG9nKCdTZWFyY2ggb3B0aW9uczonLCBKU09OLnN0cmluZ2lmeShvcHRpb25zLCBudWxsLCAyKSk7XG4gIFxuICBjb25zdCBzZWFyY2hSZXN1bHRzID0gYXdhaXQgeW91dHViZS5zZWFyY2goc2VhcmNoVGVybSwgb3B0aW9ucyk7XG5cbiAgLy8gTG9nIG1vcmUgZGV0YWlscyBhYm91dCB0aGUgcmVzdWx0c1xuICBpZiAoc2VhcmNoUmVzdWx0cy52aWRlb3MubGVuZ3RoID4gMCkge1xuICAgIGNvbnNvbGUubG9nKGBGb3VuZCAke3NlYXJjaFJlc3VsdHMudmlkZW9zLmxlbmd0aH0gcmVzdWx0c2ApO1xuICAgIGNvbnNvbGUubG9nKFwiRmlyc3QgcmVzdWx0OlwiLCB7XG4gICAgICB0aXRsZTogc2VhcmNoUmVzdWx0cy52aWRlb3NbMF0udGl0bGUsXG4gICAgICBkdXJhdGlvbjogc2VhcmNoUmVzdWx0cy52aWRlb3NbMF0uZHVyYXRpb24sXG4gICAgICB1cGxvYWRlZDogc2VhcmNoUmVzdWx0cy52aWRlb3NbMF0udXBsb2FkZWQsXG4gICAgICB2aWV3czogc2VhcmNoUmVzdWx0cy52aWRlb3NbMF0udmlld3NcbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiB7IHZpZGVvczogc2VhcmNoUmVzdWx0cy52aWRlb3MgfTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIEdFVChyZXF1ZXN0KSB7XG4gIGNvbnN0IHsgc2VhcmNoUGFyYW1zIH0gPSBuZXcgVVJMKHJlcXVlc3QudXJsKTtcbiAgY29uc3Qgc2VhcmNoVGVybSA9IHNlYXJjaFBhcmFtcy5nZXQoJ3Rlcm0nKTtcblxuICBpZiAoIXNlYXJjaFRlcm0pIHtcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBlcnJvcjogJ1NlYXJjaCB0ZXJtIGlzIHJlcXVpcmVkJyB9LCB7IHN0YXR1czogNDAwIH0pO1xuICB9XG5cbiAgLy8gQ2hlY2sgZm9yIGJhZCB3b3JkcyBpbiB0aGUgc2VhcmNoIHRlcm0gKmJlZm9yZSogc2NyYXBpbmdcbiAgY29uc3QgaXNCYWQgPSBhd2FpdCBpc0JhZFdvcmRQcmVzZW50KHNlYXJjaFRlcm0pO1xuICBpZiAoaXNCYWQpIHtcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBlcnJvcjogJ1NlYXJjaCBxdWVyeSBjb250YWlucyBpbmFwcHJvcHJpYXRlIGNvbnRlbnQuJyB9LCB7IHN0YXR1czogNDAwIH0pO1xuICB9XG5cbiAgdHJ5IHtcbiAgICBjb25zdCByZXF1ZXN0VGltZSA9IERhdGUubm93KCk7XG4gICAgY29uc3QgeyB2aWRlb3MgfSA9IGF3YWl0IGdldFlvdVR1YmVTZWFyY2hSZXN1bHRzKHNlYXJjaFRlcm0pO1xuICAgIGNvbnN0IGV4ZWN1dGlvblRpbWUgPSBEYXRlLm5vdygpIC0gcmVxdWVzdFRpbWU7XG4gICAgXG4gICAgLy8gSWYgZXhlY3V0aW9uIHRpbWUgaXMgdmVyeSBzaG9ydCAobGVzcyB0aGFuIDUwbXMpLCBpdCdzIGxpa2VseSBjYWNoZWRcbiAgICBjb25zdCBjYWNoZWQgPSBleGVjdXRpb25UaW1lIDwgNTA7XG4gICAgY29uc29sZS5sb2coYFlvdVR1YmUgc2VhcmNoIHJlc3VsdHMgKGNhY2hlZDogJHtjYWNoZWR9LCBleGVjdXRpb24gdGltZTogJHtleGVjdXRpb25UaW1lfW1zKWApO1xuICAgIFxuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IHZpZGVvcywgY2FjaGVkIH0pO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGR1cmluZyBzY3JhcGluZzonLCBlcnJvcik7XG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgZXJyb3I6ICdGYWlsZWQgdG8gZmV0Y2ggc2VhcmNoIHJlc3VsdHMnIH0sIHsgc3RhdHVzOiA1MDAgfSk7XG4gIH1cbn0gIl0sIm5hbWVzIjpbIk5leHRSZXNwb25zZSIsInlvdXR1YmUiLCJzcWxpdGUzIiwicGF0aCIsImRiUGF0aCIsImpvaW4iLCJwcm9jZXNzIiwiY3dkIiwiZGIiLCJEYXRhYmFzZSIsImVyciIsImNvbnNvbGUiLCJlcnJvciIsImxvZyIsImlzQmFkV29yZFByZXNlbnQiLCJxdWVyeSIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0Iiwic3FsIiwiZ2V0IiwidG9Mb3dlckNhc2UiLCJyb3ciLCJpc0JhZCIsImdldFlvdVR1YmVTZWFyY2hSZXN1bHRzIiwic2VhcmNoVGVybSIsIm9wdGlvbnMiLCJ0eXBlIiwic2FmZVNlYXJjaCIsInJlcXVlc3QiLCJoZWFkZXJzIiwiSlNPTiIsInN0cmluZ2lmeSIsInNlYXJjaFJlc3VsdHMiLCJzZWFyY2giLCJ2aWRlb3MiLCJsZW5ndGgiLCJ0aXRsZSIsImR1cmF0aW9uIiwidXBsb2FkZWQiLCJ2aWV3cyIsIkdFVCIsInNlYXJjaFBhcmFtcyIsIlVSTCIsInVybCIsImpzb24iLCJzdGF0dXMiLCJyZXF1ZXN0VGltZSIsIkRhdGUiLCJub3ciLCJleGVjdXRpb25UaW1lIiwiY2FjaGVkIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./app/api/search/route.js\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next@15.2.0-canary.3_react-dom@19.0.0_react@19.0.0__react@19.0.0","vendor-chunks/scrape-youtube@2.4.0"], () => (__webpack_exec__("(rsc)/./node_modules/.pnpm/next@15.2.0-canary.3_react-dom@19.0.0_react@19.0.0__react@19.0.0/node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fsearch%2Froute&page=%2Fapi%2Fsearch%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fsearch%2Froute.js&appDir=%2Fhome%2Fmike%2FCODE%2Faccess-youtube%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Fmike%2FCODE%2Faccess-youtube&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();