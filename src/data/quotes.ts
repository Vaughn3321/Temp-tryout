export interface Quote {
  id: string
  text: string
  tag: string
}

// Original reflections + well-known public-domain recovery slogans.
export const quotes: Quote[] = [
  { id: 'q1', text: "One day at a time isn't a slogan, it's a survival skill. You're allowed to only handle today.", tag: 'Grounding' },
  { id: 'q2', text: 'Progress, not perfection. You are allowed to be a work in progress and still be proud of yourself.', tag: 'Self-compassion' },
  { id: 'q3', text: 'Easy does it. Slow is still moving. Slow is still forward.', tag: 'Patience' },
  { id: 'q4', text: "This too shall pass — the cravings, the hard days, the awkward feelings. None of it is permanent.", tag: 'Perspective' },
  { id: 'q5', text: 'You did not survive everything up to this point just to give up now. Keep going.', tag: 'Resilience' },
  { id: 'q6', text: 'Let go and let God — or the universe, or your sponsor, or the group. You do not have to carry it alone.', tag: 'Surrender' },
  { id: 'q7', text: "First things first. You don't have to fix your whole life today. Just do the next right thing.", tag: 'Focus' },
  { id: 'q8', text: 'Your worst day sober still beats your best day using. Trust the math on this one.', tag: 'Reality check' },
  { id: 'q9', text: 'Asking for help is not weakness — it is the single most powerful move in this whole process.', tag: 'Community' },
  { id: 'q10', text: 'Keep coming back. It really does get better, and you deserve to be around to see it.', tag: 'Hope' },
  { id: 'q11', text: 'You are not your worst decision. You are what you choose to do next.', tag: 'Identity' },
  { id: 'q12', text: 'A rough meeting is still better than no meeting. Showing up counts more than you think.', tag: 'Consistency' },
  { id: 'q13', text: "Fake it till you make it isn't about lying — it's about acting your way into believing again.", tag: 'Momentum' },
  { id: 'q14', text: 'Gratitude turns what you have into enough. Try naming three things before bed tonight.', tag: 'Gratitude' },
  { id: 'q15', text: 'The two most powerful words in recovery: not yet. Not "no," just not yet.', tag: 'Willpower' },
  { id: 'q16', text: 'Your sobriety is not a straight line, and it was never supposed to be. Curves are still progress.', tag: 'Perspective' },
  { id: 'q17', text: "H.A.L.T. — check if you're Hungry, Angry, Lonely, or Tired before you decide anything feels like an emergency.", tag: 'Self-check' },
  { id: 'q18', text: 'You get to rewrite what a Friday night looks like. That is not a loss, that is freedom.', tag: 'Reframe' },
]

export function quoteOfTheDay(date: Date = new Date()): Quote {
  const dayIndex = Math.floor(date.getTime() / (1000 * 60 * 60 * 24))
  return quotes[dayIndex % quotes.length]
}
