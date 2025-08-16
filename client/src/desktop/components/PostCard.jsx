export default function PostCard({ user, location, text, image, likes, comments }) {
  return (
    <div className="bg-neutral-900 text-white rounded-lg shadow-md p-4 max-w-md">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-semibold">{user}</h3>
          <p className="text-sm text-gray-400">{location}</p>
        </div>
        <span className="text-gray-400 text-xs">3 min ago</span>
      </div>
      <p className="mt-2 text-left">{text}</p>
      {image && <img src={image} alt="" className="rounded-lg mt-2 max-w-full h-auto" />}
      <div className="flex justify-between text-sm text-gray-400 mt-3">
        <span>❤️ {likes} likes</span>
        <span>💬 {comments} comments</span>
      </div>
    </div>
  );
}
