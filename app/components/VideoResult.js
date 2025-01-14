import Link from "next/link";

export default function VideoResult({ video, index }) {
  // Create accesskey based on index (1-9, then 0, then a-z)
  const getAccessKey = (i) => {
    if (i < 9) return String(i + 1);
    if (i === 9) return "0";
    return String.fromCharCode(97 + (i - 10)); // a-z for 10+
  };

  return (
    <div className="w-full aspect-[4/3]">
      <Link
        href={`/play/${video.id}`}
        className="block h-full group bg-light rounded-lg overflow-hidden border-2 border-light hover:ring-4 hover:ring-primary-start hover:ring-offset-4 hover:ring-offset-dark transition-all focus-ring"
        accessKey={getAccessKey(index)}
      >
        <div className="relative h-full flex flex-col">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-2/3 object-cover group-hover:opacity-90 transition-opacity"
            loading="lazy"
          />
          <div className="flex-1 p-4 sm:pt-2 bg-light">
            <h2
              aria-hidden="true"
              className="text-dark text-xl sm:text-xl lg:text-base xl:text-xl font-bold line-clamp-2 text-center group-hover:text-primary-end group-focus:text-primary-end transition-colors"
            >
              {video.title}
            </h2>
          </div>
        </div>
      </Link>
    </div>
  );
}
