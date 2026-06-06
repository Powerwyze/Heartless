// Rider-Waite-Smith tarot deck images. Public domain (Pamela Colman Smith, 1909).
// Sourced from trustedtarot.com which hosts the full deck as PNGs at predictable
// kebab-case slugs. Verified all 78 cards return HTTP 200.

const BASE = 'https://www.trustedtarot.com/img/cards';

// Convert "The High Priestess" → "the-high-priestess"
const toSlug = (name: string): string =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// Slug overrides for cards where trustedtarot.com uses a non-standard filename.
const SLUG_OVERRIDES: Record<string, string> = {
  'The Hierophant': 'the-heirophant', // misspelled on source CDN
};

export const getTarotImage = (cardName: string): string => {
  const slug = SLUG_OVERRIDES[cardName] ?? toSlug(cardName);
  return `${BASE}/${slug}.png`;
};

// Convenience map for any place that wants name → URL up front.
export const TAROT_IMAGES: Record<string, string> = (() => {
  const cards = [
    'The Fool','The Magician','The High Priestess','The Empress','The Emperor',
    'The Hierophant','The Lovers','The Chariot','Strength','The Hermit',
    'Wheel of Fortune','Justice','The Hanged Man','Death','Temperance',
    'The Devil','The Tower','The Star','The Moon','The Sun',
    'Judgement','The World',
    'Ace of Wands','Two of Wands','Three of Wands','Four of Wands','Five of Wands',
    'Six of Wands','Seven of Wands','Eight of Wands','Nine of Wands','Ten of Wands',
    'Page of Wands','Knight of Wands','Queen of Wands','King of Wands',
    'Ace of Cups','Two of Cups','Three of Cups','Four of Cups','Five of Cups',
    'Six of Cups','Seven of Cups','Eight of Cups','Nine of Cups','Ten of Cups',
    'Page of Cups','Knight of Cups','Queen of Cups','King of Cups',
    'Ace of Swords','Two of Swords','Three of Swords','Four of Swords','Five of Swords',
    'Six of Swords','Seven of Swords','Eight of Swords','Nine of Swords','Ten of Swords',
    'Page of Swords','Knight of Swords','Queen of Swords','King of Swords',
    'Ace of Pentacles','Two of Pentacles','Three of Pentacles','Four of Pentacles','Five of Pentacles',
    'Six of Pentacles','Seven of Pentacles','Eight of Pentacles','Nine of Pentacles','Ten of Pentacles',
    'Page of Pentacles','Knight of Pentacles','Queen of Pentacles','King of Pentacles',
  ];
  return Object.fromEntries(cards.map(c => [c, getTarotImage(c)]));
})();
