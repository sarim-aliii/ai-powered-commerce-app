const SkeletonLoader = ({ count = 4 }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(count)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm animate-pulse">
                    {/* Image placeholder */}
                    <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                    {/* Brand placeholder */}
                    <div className="h-3 w-1/4 bg-gray-200 rounded mb-2"></div>
                    {/* Title placeholder */}
                    <div className="h-5 w-3/4 bg-gray-300 rounded mb-3"></div>
                    {/* Description placeholder */}
                    <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 w-5/6 bg-gray-200 rounded mb-4"></div>
                    {/* Price & Button placeholder */}
                    <div className="flex justify-between items-center pt-4 border-t">
                        <div className="h-6 w-1/3 bg-gray-300 rounded"></div>
                        <div className="h-10 w-1/4 bg-gray-200 rounded-lg"></div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SkeletonLoader;