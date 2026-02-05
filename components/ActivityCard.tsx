export default function ActivityCard({ activity }: { activity: any }) {
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition p-4 bg-white">
      <img 
        src={activity.thumbnail || 'https://via.placeholder.com/150'} 
        alt={activity.title} 
        className="w-full h-48 object-cover rounded-md"
      />
      <div className="mt-4">
        <h3 className="font-bold text-lg truncate">{activity.title}</h3>
        <p className="text-gray-500 text-sm capitalize">{activity.category}</p>
        <div className="flex justify-between items-center mt-4">
          <span className="font-bold text-blue-600">${activity.price}</span>
          <span className="text-yellow-500 text-sm">⭐ {activity.rating || 'N/A'}</span>
        </div>
      </div>
    </div>
  );
}