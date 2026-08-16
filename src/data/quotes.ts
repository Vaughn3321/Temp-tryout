export interface Quote {
  id: string
  text: string
  tag: string
  emoji: string
}

// Original reflections + well-known public-domain recovery slogans.
export const quotes: Quote[] = [
  { id: 'q1', text: "One day at a time isn't a slogan, it's a survival skill. You're allowed to only handle today.", tag: 'Grounding', emoji: '🌤️' },
  { id: 'q2', text: 'Progress, not perfection. You are allowed to be a work in progress and still be proud of yourself.', tag: 'Self-compassion', emoji: '🌱' },
  { id: 'q3', text: 'Easy does it. Slow is still moving. Slow is still forward.', tag: 'Patience', emoji: '🐢' },
  { id: 'q4', text: "This too shall pass — the cravings, the hard days, the awkward feelings. None of it is permanent.", tag: 'Perspective', emoji: '🌊' },
  { id: 'q5', text: 'You did not survive everything up to this point just to give up now. Keep going.', tag: 'Resilience', emoji: '🔥' },
  { id: 'q6', text: 'Let go and let God — or the universe, or your sponsor, or the group. You do not have to carry it alone.', tag: 'Surrender', emoji: '🕊️' },
  { id: 'q7', text: "First things first. You don't have to fix your whole life today. Just do the next right thing.", tag: 'Focus', emoji: '✅' },
  { id: 'q8', text: 'Your worst day sober still beats your best day using. Trust the math on this one.', tag: 'Reality check', emoji: '📊' },
  { id: 'q9', text: 'Asking for help is not weakness — it is the single most powerful move in this whole process.', tag: 'Community', emoji: '🤝' },
  { id: 'q10', text: 'Keep coming back. It really does get better, and you deserve to be around to see it.', tag: 'Hope', emoji: '✨' },
  { id: 'q11', text: 'You are not your worst decision. You are what you choose to do next.', tag: 'Identity', emoji: '🧭' },
  { id: 'q12', text: 'A rough meeting is still better than no meeting. Showing up counts more than you think.', tag: 'Consistency', emoji: '📍' },
  { id: 'q13', text: "Fake it till you make it isn't about lying — it's about acting your way into believing again.", tag: 'Momentum', emoji: '🎭' },
  { id: 'q14', text: 'Gratitude turns what you have into enough. Try naming three things before bed tonight.', tag: 'Gratitude', emoji: '🙏' },
  { id: 'q15', text: 'The two most powerful words in recovery: not yet. Not "no," just not yet.', tag: 'Willpower', emoji: '⏳' },
  { id: 'q16', text: 'Your sobriety is not a straight line, and it was never supposed to be. Curves are still progress.', tag: 'Perspective', emoji: '〰️' },
  { id: 'q17', text: "H.A.L.T. — check if you're Hungry, Angry, Lonely, or Tired before you decide anything feels like an emergency.", tag: 'Self-check', emoji: '🛑' },
  { id: 'q18', text: 'You get to rewrite what a Friday night looks like. That is not a loss, that is freedom.', tag: 'Reframe', emoji: '🔓' },
]

export function quoteOfTheDay(date: Date = new Date()): Quote {
  const dayIndex = Math.floor(date.getTime() / (1000 * 60 * 60 * 24))
  return quotes[dayIndex % quotes.length]
}
