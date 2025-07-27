const StatCard = ({ title, value, icon: Icon, color = "blue" }) => {
  const colorClasses = {
    blue: "bg-gradient-to-br from-indigo-500 to-cyan-500",
    green: "bg-gradient-to-br from-green-400 to-cyan-400",
    red: "bg-gradient-to-br from-rose-500 to-pink-500",
    yellow: "bg-gradient-to-br from-yellow-400 to-orange-400",
    purple: "bg-gradient-to-br from-purple-500 to-indigo-500",
    indigo: "bg-gradient-to-br from-indigo-500 to-blue-500",
  };

  const bgColor = colorClasses[color] || colorClasses.blue;

  return (
    <div
      className="rounded-2xl p-6 border border-[#21222d] shadow-lg hover:shadow-xl transition-shadow duration-200"
      style={{ background: "#171821" }}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-slate-400 text-sm font-medium tracking-wide">
            {title}
          </p>
          <p className="text-3xl font-bold text-slate-100 mt-2">{value}</p>
        </div>
        {Icon && (
          <div
            className={`p-3 rounded-xl shadow-md ${bgColor} flex items-center justify-center ml-4`}
          >
            <Icon className="w-7 h-7 text-white" />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
