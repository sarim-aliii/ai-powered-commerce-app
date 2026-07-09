const DetailSkeleton = () => (
    <div className="max-w-6xl mx-auto px-4 py-12 animate-pulse">
        <div className="grid md:grid-cols-2 gap-12">
            <div className="h-96 bg-gray-200 rounded-2xl"></div>
            <div className="space-y-4">
                <div className="h-8 w-3/4 bg-gray-300 rounded"></div>
                <div className="h-6 w-1/4 bg-gray-200 rounded"></div>
                <div className="h-32 w-full bg-gray-100 rounded"></div>
                <div className="h-12 w-full bg-gray-200 rounded"></div>
            </div>
        </div>
    </div>
);

export default DetailSkeleton;