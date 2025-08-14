import PostCard from "../components/PostCard";
import Sidebar from "../components/Sidebar";

export default function ForYou() {
  const posts = [
    {
      user: "Helena",
      location: "Nagla Hawai, Agra",
      text: "Fool nhi Phool hu main 🌸",
      image: "src/assets/black pencil pouch.jpg",
      likes: 21,
      comments: 2
    },
    {
      user: "Dhamdere",
      location: "Nagla Hawai, Agra",
      text: "Fool nhi Phool hu main 🌸",
      image: "src/assets/paper bg.jpg",
      likes: 21,
      comments: 2
    }
  ];

  return (
    <>
      <Sidebar />
      <div className="h-full overflow-y-auto p-6 flex flex-col items-center gap-6">
        {posts.map((post, idx) => (
          <PostCard key={idx} {...post} />
        ))}
      </div>
    </>
  );
}
