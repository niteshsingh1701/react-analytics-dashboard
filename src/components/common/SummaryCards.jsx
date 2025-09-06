import React from "react";

const SummaryCards = ({ cards = [] }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`bg-white p-6 rounded-lg shadow-md border-l-4 ${card.borderColor || 'border-blue-500'}`}
        >
          <div className="flex items-center">
            <div className={`p-3 rounded-full ${card.iconBgColor || 'bg-blue-100'}`}>
              {card.icon}
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                {card.title}
              </p>
              <p className={`text-2xl font-bold ${card.valueColor || 'text-blue-600'}`}>
                {card.value}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;
