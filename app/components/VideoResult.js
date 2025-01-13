import Link from "next/link";

export default function VideoResult({ video }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex gap-4 items-start">
      <div className="flex-shrink-0">
        <Link href={`/play/${video.id}`}>
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-32 h-20 object-cover rounded-md"
            loading="lazy"
          />
        </Link>
      </div>
      <div className="flex-1">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">
          <Link href={`/play/${video.id}`} className="hover:underline">
            {video.title}
          </Link>
        </h2>
        <p className="text-gray-600 text-sm">
          {video.duration} | {video.uploaded} | {video.views} views
        </p>
      </div>
    </div>
  );
}
