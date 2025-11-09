"user client";

import React from "react";

export function SearchBar() {
return (
<div className="w-full">
<label className="sr-only">Search</label>
<div className="flex items-center gap-2">
<input
type="search"
placeholder="Search for products, brands and more"
className="w-full px-4 py-3 rounded-full bg-white/5 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
/>
<button className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white">Search</button>
</div>
</div>
);
}