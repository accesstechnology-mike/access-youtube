export default function VideoResult({ video }) {
  return (
    <div className="flex flex-col gap-4 p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Title repeated for accessibility - visual title will be below thumbnail */}
        <h2 className="sr-only">{video.title}</h2>
        
        {/* Thumbnail container */}
        <div className="sm:w-48 aspect-video relative rounded-lg overflow-hidden">
          <img
            src={video.thumbnail}
            alt=""
            className="w-full h-full object-cover"
            loading="lazy"
          />
          {video.duration && (
            <div className="absolute bottom-1 right-1 bg-black/80 text-white text-sm px-1 rounded">
              {video.duration}
            </div>
          )}
        </div>

        {/* Video details */}
        <div className="flex-1">
          <h2 className="text-xl font-semibold mb-2 line-clamp-2">
            {video.title}
          </h2>
          
          <div className="flex flex-col gap-1 text-gray-600">
            <p className="text-sm">
              {video.channel?.name || 'Unknown Channel'}
            </p>
            <p className="text-sm">
              {video.views?.toLocaleString()} views
            </p>
            {video.uploaded && (
              <p className="text-sm">
                Uploaded {video.uploaded}
              </p>
            )}
          </div>
        </div>
      </div>

      {video.description && (
        <p className="text-gray-600 line-clamp-2">
          {video.description}
        </p>
      )}

      <div className="flex justify-end">
        <a
          href={video.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label={`Watch ${video.title} on YouTube`}
        >
          Watch on YouTube
        </a>
      </div>
    </div>
  );
} 