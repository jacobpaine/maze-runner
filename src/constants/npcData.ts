export const npcData = [
  {
    id: "old_man",
    name: "Old Man",
    position: { x: 2, y: 2 },
    portrait: "/assets/oldman.gif", // Path to portrait
    dialogue: [
      {
        text: "Welcome, traveler! What brings you here?",
        options: [
          { text: "I'm looking for adventure.", next: 1 },
          { text: "Just passing through.", next: 2 },
        ],
      },
      {
        text: "Ah, adventure! You should seek the lost treasure in the maze.",
        options: [{ text: "Thanks!", next: null }],
      },
      {
        text: "Safe travels, then.",
        options: [{ text: "Farewell.", next: null }],
      },
    ],
  },
];
