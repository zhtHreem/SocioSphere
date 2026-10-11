// Questions every new society's application form starts with (the owner can edit them later)
export const APPLY_DEFAULT_QUESTIONS = (name) => [
  { title: `Why do you want to join ${name}?`, type: 'Paragraph', options: [], required: true },
  { title: 'How much experience do you have?', type: 'Multiple choice', options: ['Just starting', 'A little', 'Quite a bit'], required: true },
  { title: 'When can you usually make it?', type: 'Checkbox', options: ['Weekday evenings', 'Weekends', 'Both'], required: false },
];
