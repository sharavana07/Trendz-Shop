"user client";
import React from "react";

export function CategoryGrid({ categories = [] }: { categories?: { name: string; image: string }[] }) {
return (
<section className="max-w-7xl mx-auto py-12 px-4">
<h2 className="text-2xl font-semibold mb-6">Shop by Category</h2>
<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
{categories.map((c, i) => (
<div key={i} className="flex flex-col items-center gap-2 text-center p-3 bg-gray-900 rounded-lg hover:shadow-lg transition">
<div className="h-20 w-20 rounded-lg overflow-hidden bg-white/5 flex items-center justify-center">
<img src={c.image} alt={c.name} className="h-full w-full object-cover" />
</div>
<div className="text-sm text-gray-200">{c.name}</div>
</div>
))}
</div>
</section>
);
}