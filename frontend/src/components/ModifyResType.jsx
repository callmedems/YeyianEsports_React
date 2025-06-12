import React from 'react';
import '../css/modifyResType.css';

export default function ModifyResType() {
  const cards = [
    {
      id: 1,
      icon: "📱",
      title: "Modern iOS apps",
      description: "Cruising from Swift to AppStore.",
      colorClass: "card-orange"
    },
    {
      id: 2,
      icon: "🌐",
      title: "No-code websites",
      description: "Vibrant designs with Webflow.",
      colorClass: "card-purple"
    },
    {
      id: 3,
      icon: "🎨",
      title: "Delish UI",
      description: "Crafting products with Figma.",
      colorClass: "card-green"
    },
    {
      id: 4,
      icon: "🎮",
      title: "Gaming events",
      description: "Competitive tournaments.",
      colorClass: "card-blue"
    },
    {
      id: 5,
      icon: "🎤",
      title: "Live streaming",
      description: "Broadcast your events.",
      colorClass: "card-pink"
    }
  ];

  return (
    <div className="container">
      {cards.map(card => (
        <div key={card.id} className={`card ${card.colorClass}`}>
          <div className="icon">{card.icon}</div>
          <div className="title">{card.title}</div>
          <div className="description">{card.description}</div>
        </div>
      ))}
    </div>
  );
}
