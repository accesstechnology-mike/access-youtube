export async function generateMetadata({ params }) {
  return {
    title: 'Video Player - access: youtube',
    description: 'Playing a YouTube video',
  };
}

export default function VideoLayout({ children }) {
  return children;
} 