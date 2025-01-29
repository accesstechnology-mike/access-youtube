import Link from "next/link";

export default function VideoResult({ video, priority, index }) {
  const getShortcutKey = (idx) => {
    if (idx < 9) return (idx + 1).toString();
    if (idx === 9) return '0';
    if (idx === 10) return 'A';
    if (idx === 11) return 'B';
    return '';
  };

  return (
    <div className="w-full aspect-[4/3]">
      <Link
        href={`/play/${video.id}`}
        className="block h-full group bg-light rounded-lg overflow-hidden border-2 border-light hover:ring-4 hover:ring-primary-start hover:ring-offset-4 hover:ring-offset-dark transition-all focus-ring"
        aria-label={`Video ${index + 1}, ${video.title} - Alt plus ${getShortcutKey(index)}`}
      >
        <div className="relative h-full flex flex-col">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-2/3 object-cover group-hover:opacity-90 transition-opacity"
            loading={priority ? "eager" : "lazy"}
            aria-hidden="true"
          />
          <div className="flex-1 p-4 sm:pt-2 bg-light">
            <h2
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
