interface Activity {
  id: number;
  title: string;
  description: string;
  price: number;
  rating: number;
  category: string;
  thumbnail: string;
}

interface Props {
  activity: Activity;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onClick: () => void;
}

export default function ActivityCard({
  activity,
  isFavorite,
  onToggleFavorite,
  onClick,
}: Props) {
  return (
    <div
      className="bg-white rounded-3xl p-4 cursor-pointer
      shadow-md hover:shadow-2xl hover:-translate-y-1
      transition-all duration-300 border border-indigo-100"
      onClick={onClick}
    >
      <img src={activity.thumbnail} className="rounded-2xl mb-4" />

      <h3 className="font-bold">{activity.title}</h3>
      <p className="text-sm font-semibold text-indigo-600 mb-2">
        ${activity.price}
      </p>

      <div className="flex justify-between items-center">
        <span>⭐ {activity.rating}</span>

        <button
          className="text-xl"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
        >
          <span className={isFavorite ? "text-pink-500" : "text-slate-300"}>
            {isFavorite ? "❤️" : "🤍"}
          </span>
        </button>
      </div>
    </div>
  );
}
