

export function BannerCarousel() {


// Simple 3-frame CSS-based carousel placeholder.
// Replace with a react carousel library for autoplay, swiping, indicators.
return (
<div className="relative w-full overflow-hidden rounded-xl">
<div className="h-[52vh] md:h-[60vh] w-full">
<img src="/images/banners/main-banner.jpg" alt="sale" className="w-full h-full object-cover rounded-xl" />
<div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-start p-8 md:p-20">
<h1 className="text-3xl md:text-5xl font-bold">Big Deals On Electronics</h1>
<p className="text-gray-300 max-w-xl mt-3">Top brands — best prices — fast delivery</p>
<div className="mt-6">
<button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg font-semibold">Shop Now</button>
</div>
</div>
</div>
</div>
);
}