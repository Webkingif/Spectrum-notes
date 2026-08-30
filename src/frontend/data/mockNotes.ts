export interface Note {
  id: string;
  title: string;
  excerpt: string;
  content: any; // Tiptap JSON object
  isFavorite: boolean;
  tags: string[];
  updatedAt: string;
}

export const mockNotes: Note[] = [
  {
    id: "note-1",
    title: "AI App Specs",
    excerpt: "Design system specifications, colors, and typography choices...",
    isFavorite: true,
    tags: ["Product", "Design"],
    updatedAt: "2026-08-30T10:00:00Z",
    content: {
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: { level: 1 },
          content: [{ type: "text", text: "AI Note-Taking App Specs" }]
        },
        {
          type: "paragraph",
          content: [
            { type: "text", text: "The primary color is an " },
            { type: "text", marks: [{ type: "bold" }], text: "orange accent" },
            { type: "text", text: " against a neutral slate background." }
          ]
        },
        {
          type: "bulletList",
          content: [
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: "UI Font: Inter" }]
                }
              ]
            },
            {
              type: "listItem",
              content: [
                {
                  type: "paragraph",
                  content: [{ type: "text", text: "Editor Font: Tailwind Typography" }]
                }
              ]
            }
          ]
        }
      ]
    }
  },
  {
    id: "note-2",
    title: "Meeting Notes - Marketing Sync",
    excerpt: "Attendees: Sarah, Mike, Alex. Action items for the Q3 campaign...",
    isFavorite: false,
    tags: ["Meeting", "Marketing"],
    updatedAt: "2026-08-28T14:30:00Z",
    content: {
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: { level: 1 },
          content: [{ type: "text", text: "Weekly Marketing Sync" }]
        },
        {
          type: "paragraph",
          content: [
            { type: "text", marks: [{ type: "bold" }], text: "Attendees:" },
            { type: "text", text: " Sarah, Mike, Alex" }
          ]
        },
        {
          type: "paragraph",
          content: [
            { type: "text", text: "We need to focus heavily on the new AI summarization feature in the upcoming launch. I will be working with the design team to get the assets ready." }
          ]
        }
      ]
    }
  },
  {
    id: "note-3",
    title: "Journal - August 30",
    excerpt: "Today was incredibly productive. Finally figured out how to save...",
    isFavorite: true,
    tags: ["Personal", "Journal"],
    updatedAt: "2026-08-30T18:00:00Z",
    content: {
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: { level: 1 },
          content: [{ type: "text", text: "August 30th" }]
        },
        {
          type: "paragraph",
          content: [
            { type: "text", text: "Today was incredibly productive. Finally figured out how to properly pass React Router outlet contexts so my header save button can extract the " },
            { type: "text", marks: [{ type: "italic" }], text: "exact JSON" },
            { type: "text", text: " from the Tiptap editor!" }
          ]
        }
      ]
    }
  }
];