// ─── Column groups ───────────────────────────────────────────────────────────

export const columnGroups = [
  {
    name: 'Tasks',
    color: 'purple',
    columns: [
      'Tech Art Tasks',
      'Animation Tasks',
      'Feedback Inbox',
      'Script & Tuning Tasks',
      'Writing Tasks',
      'Code Tasks',
      'Game Design Tasks',
    ],
  },
  {
    name: 'QA',
    color: 'ocean',
    columns: ['CE2 Bugs Inbox'],
  },
  {
    name: 'Sound',
    color: 'caramel',
    columns: ['CE2 Music', 'Ambient Sounds', 'UI Sounds', 'Combat Sounds'],
  },
  {
    name: 'Art',
    color: 'tangerine',
    columns: [
      'Location Art',
      'Character Art',
      'Art Direction',
      'Map Art',
      'CE2 Art Requests',
    ],
  },
  {
    name: 'Archive',
    color: 'cornflower',
    columns: ['Event Polish Tasks'],
  },
]

export const allColumnNames = columnGroups.flatMap((g) => g.columns)

// ─── Milestones ──────────────────────────────────────────────────────────────

export const milestones = [
  'Alpha 1.0',
  'Alpha 2.0',
  'Beta',
  'Content Complete',
  'Polish',
  'Launch',
]

// ─── Helper: build a card ────────────────────────────────────────────────────

let _cardId = 0
function card(title, { completed = false, priority = 'b', milestone = null, values = {} } = {}) {
  return { id: `card-${++_cardId}`, title, completed, priority, milestone, values }
}

// ─── Scope rows ──────────────────────────────────────────────────────────────
// Each row: name, progress "done/total", cards array.
// Aggregate `values` is computed from cards at runtime by the components.

export const scopeRows = [
  {
    name: 'Locations',
    progress: '69/69',
    cards: [
      card('#location Enchanted Forest', { completed: true, priority: 'a', milestone: 'Alpha 1.0', values: { 'Tech Art Tasks': 20, 'Script & Tuning Tasks': 70, 'Code Tasks': 10, 'Game Design Tasks': 20, 'CE2 Music': 20, 'Location Art': 50, 'Map Art': 20, 'CE2 Art Requests': 10, 'Event Polish Tasks': 30 } }),
      card('#location Crystal Caverns', { completed: false, priority: 'a', milestone: 'Alpha 1.0', values: { 'Tech Art Tasks': 20, 'Script & Tuning Tasks': 70, 'Code Tasks': 10, 'Game Design Tasks': 20, 'CE2 Music': 20, 'Location Art': 50, 'Map Art': 20, 'CE2 Art Requests': 10, 'Event Polish Tasks': 30 } }),
      card('#location Sunken Ruins', { completed: false, priority: 'b', milestone: 'Alpha 2.0', values: { 'Tech Art Tasks': 20, 'Script & Tuning Tasks': 70, 'Code Tasks': 10, 'Game Design Tasks': 20, 'CE2 Music': 20, 'Location Art': 50, 'Map Art': 20, 'CE2 Art Requests': 10, 'Event Polish Tasks': 30 } }),
      card('#location Volcanic Ridge', { completed: false, priority: 'b', milestone: 'Beta', values: { 'Tech Art Tasks': 18, 'Script & Tuning Tasks': 65, 'Code Tasks': 9, 'Game Design Tasks': 18, 'CE2 Music': 18, 'Location Art': 45, 'Map Art': 18, 'CE2 Art Requests': 9, 'Event Polish Tasks': 28 } }),
      card('#location Frozen Peaks', { completed: false, priority: 'c', milestone: 'Content Complete', values: { 'Tech Art Tasks': 18, 'Script & Tuning Tasks': 64, 'Code Tasks': 10, 'Game Design Tasks': 18, 'CE2 Music': 18, 'Location Art': 50, 'Map Art': 18, 'CE2 Art Requests': 10, 'Event Polish Tasks': 28 } }),
      card('#location Howling Steppe', { completed: false, priority: 'b', milestone: 'Alpha 2.0', values: { 'Tech Art Tasks': 19, 'Script & Tuning Tasks': 65, 'Code Tasks': 9, 'Game Design Tasks': 19, 'CE2 Music': 19, 'Location Art': 45, 'Map Art': 19, 'CE2 Art Requests': 9, 'Event Polish Tasks': 28 } }),
      card('#location Moonlit Marsh', { completed: false, priority: 'c', milestone: 'Beta', values: { 'Tech Art Tasks': 19, 'Script & Tuning Tasks': 65, 'Code Tasks': 9, 'Game Design Tasks': 19, 'CE2 Music': 19, 'Location Art': 45, 'Map Art': 19, 'CE2 Art Requests': 9, 'Event Polish Tasks': 28 } }),
    ],
  },
  {
    name: 'Characters',
    progress: '6/6',
    cards: [
      card('#char Ranger', { completed: false, priority: 'a', milestone: 'Alpha 1.0', values: { 'Tech Art Tasks': 4, 'Animation Tasks': 4, 'Script & Tuning Tasks': 14, 'Game Design Tasks': 2, 'Art Direction': 6, 'CE2 Art Requests': 2 } }),
      card('#char Mage', { completed: false, priority: 'a', milestone: 'Alpha 1.0', values: { 'Tech Art Tasks': 4, 'Animation Tasks': 4, 'Script & Tuning Tasks': 14, 'Game Design Tasks': 2, 'Art Direction': 6, 'CE2 Art Requests': 2 } }),
      card('#char Rogue', { completed: false, priority: 'b', milestone: 'Alpha 2.0', values: { 'Tech Art Tasks': 4, 'Animation Tasks': 4, 'Script & Tuning Tasks': 14, 'Game Design Tasks': 2, 'Art Direction': 6, 'CE2 Art Requests': 2 } }),
    ],
  },
  {
    name: 'Items',
    progress: '54/54',
    cards: [
      card('#item Flame Sword', { completed: false, priority: 'a', milestone: 'Alpha 1.0', values: { 'Tech Art Tasks': 11, 'Script & Tuning Tasks': 44, 'Game Design Tasks': 11, 'UI Sounds': 11, 'CE2 Art Requests': 32 } }),
      card('#item Frost Shield', { completed: false, priority: 'b', milestone: 'Alpha 2.0', values: { 'Tech Art Tasks': 11, 'Script & Tuning Tasks': 43, 'Game Design Tasks': 11, 'UI Sounds': 11, 'CE2 Art Requests': 32 } }),
      card('#item Shadow Bow', { completed: false, priority: 'b', milestone: 'Beta', values: { 'Tech Art Tasks': 11, 'Script & Tuning Tasks': 43, 'Game Design Tasks': 11, 'UI Sounds': 10, 'CE2 Art Requests': 32 } }),
      card('#item Healing Potion', { completed: false, priority: 'c', milestone: 'Alpha 1.0', values: { 'Tech Art Tasks': 11, 'Script & Tuning Tasks': 43, 'Game Design Tasks': 11, 'UI Sounds': 11, 'CE2 Art Requests': 33 } }),
      card('#item Thunder Ring', { completed: false, priority: 'c', milestone: 'Content Complete', values: { 'Tech Art Tasks': 10, 'Script & Tuning Tasks': 43, 'Game Design Tasks': 10, 'UI Sounds': 10, 'CE2 Art Requests': 32 } }),
    ],
  },
  {
    name: 'Ailments',
    progress: '20/20',
    cards: [
      card('#ailment Poison', { completed: false, priority: 'b', milestone: 'Alpha 1.0', values: { 'CE2 Art Requests': 1, 'Event Polish Tasks': 1 } }),
      card('#ailment Burn', { completed: false, priority: 'b', milestone: 'Alpha 2.0', values: {} }),
      card('#ailment Freeze', { completed: false, priority: 'c', milestone: 'Beta', values: {} }),
    ],
  },
  {
    name: 'Tiles',
    progress: '30/30',
    cards: [
      card('#tile Grass', { completed: false, priority: 'a', milestone: 'Alpha 1.0', values: { 'Tech Art Tasks': 15, 'Script & Tuning Tasks': 30, 'Game Design Tasks': 8, 'CE2 Music': 15, 'CE2 Art Requests': 23 } }),
      card('#tile Water', { completed: false, priority: 'a', milestone: 'Alpha 1.0', values: { 'Tech Art Tasks': 15, 'Script & Tuning Tasks': 30, 'Game Design Tasks': 7, 'CE2 Music': 15, 'CE2 Art Requests': 22 } }),
      card('#tile Lava', { completed: false, priority: 'b', milestone: 'Alpha 2.0', values: { 'Tech Art Tasks': 15, 'Script & Tuning Tasks': 30, 'Game Design Tasks': 8, 'CE2 Music': 15, 'CE2 Art Requests': 23 } }),
      card('#tile Sand', { completed: false, priority: 'c', milestone: 'Beta', values: { 'Tech Art Tasks': 15, 'Script & Tuning Tasks': 30, 'Game Design Tasks': 7, 'CE2 Music': 15, 'CE2 Art Requests': 22 } }),
    ],
  },
  {
    name: 'Events',
    progress: '102/102',
    cards: [
      card('#event Dragon Raid', { completed: false, priority: 'a', milestone: 'Alpha 2.0', values: { 'Script & Tuning Tasks': 25, 'Writing Tasks': 20, 'CE2 Art Requests': 26 } }),
      card('#event Merchant Festival', { completed: false, priority: 'b', milestone: 'Beta', values: { 'Script & Tuning Tasks': 25, 'Writing Tasks': 21, 'CE2 Art Requests': 25 } }),
      card('#event Eclipse Ritual', { completed: false, priority: 'b', milestone: 'Content Complete', values: { 'Script & Tuning Tasks': 24, 'Writing Tasks': 21, 'CE2 Art Requests': 26 } }),
      card('#event Harvest Moon', { completed: false, priority: 'c', milestone: 'Polish', values: { 'Script & Tuning Tasks': 24, 'Writing Tasks': 20, 'CE2 Art Requests': 25 } }),
    ],
  },
  {
    name: 'Dice Actions',
    progress: '62/62',
    cards: [
      card('#dice Strike', { completed: false, priority: 'a', milestone: 'Alpha 1.0', values: {} }),
      card('#dice Dodge', { completed: false, priority: 'a', milestone: 'Alpha 1.0', values: {} }),
      card('#dice Parry', { completed: false, priority: 'b', milestone: 'Alpha 2.0', values: {} }),
      card('#dice Channel', { completed: false, priority: 'c', milestone: 'Beta', values: {} }),
    ],
  },
  {
    name: 'Goals & Modes',
    progress: '16/16',
    cards: [
      card('#mode Campaign', { completed: false, priority: 'a', milestone: 'Alpha 1.0', values: {} }),
      card('#mode Endless', { completed: false, priority: 'b', milestone: 'Beta', values: {} }),
      card('#goal Complete all quests', { completed: false, priority: 'c', milestone: 'Content Complete', values: {} }),
    ],
  },
  {
    name: 'Multiplayer',
    progress: '27/27',
    cards: [
      card('#mp Co-op lobby', { completed: false, priority: 'a', milestone: 'Beta', values: {} }),
      card('#mp Matchmaking', { completed: false, priority: 'a', milestone: 'Beta', values: {} }),
      card('#mp Spectator mode', { completed: false, priority: 'c', milestone: 'Polish', values: {} }),
    ],
  },
  {
    name: 'Explorers',
    progress: '59/59',
    cards: [
      card('#explorer Pathfinder', { completed: true, priority: 'a', milestone: 'Alpha 1.0', values: { 'Tech Art Tasks': 15, 'Animation Tasks': 15, 'Script & Tuning Tasks': 177, 'Game Design Tasks': 15, 'Art Direction': 30 } }),
      card('#explorer Cartographer', { completed: false, priority: 'a', milestone: 'Alpha 1.0', values: { 'Tech Art Tasks': 15, 'Animation Tasks': 15, 'Script & Tuning Tasks': 177, 'Game Design Tasks': 15, 'Art Direction': 29 } }),
      card('#explorer Survivalist', { completed: false, priority: 'b', milestone: 'Alpha 2.0', values: { 'Tech Art Tasks': 15, 'Animation Tasks': 14, 'Script & Tuning Tasks': 177, 'Game Design Tasks': 14, 'Art Direction': 30 } }),
      card('#explorer Archaeologist', { completed: false, priority: 'c', milestone: 'Beta', values: { 'Tech Art Tasks': 14, 'Animation Tasks': 15, 'Script & Tuning Tasks': 177, 'Game Design Tasks': 15, 'Art Direction': 29 } }),
    ],
  },
  {
    name: 'Aftermaths',
    progress: '10/10',
    cards: [
      card('#aftermath Victory celebration', { completed: false, priority: 'b', milestone: 'Content Complete', values: {} }),
      card('#aftermath Defeat screen', { completed: false, priority: 'b', milestone: 'Content Complete', values: {} }),
      card('#aftermath Score summary', { completed: false, priority: 'c', milestone: 'Polish', values: {} }),
    ],
  },
  {
    name: 'Zones',
    progress: '19/19',
    cards: [
      card('#zone Verdant Plains', { completed: false, priority: 'a', milestone: 'Alpha 1.0', values: { 'Script & Tuning Tasks': 34, 'Game Design Tasks': 5 } }),
      card('#zone Ashen Wastes', { completed: false, priority: 'b', milestone: 'Alpha 2.0', values: { 'Script & Tuning Tasks': 33, 'Game Design Tasks': 5 } }),
      card('#zone Deepwood', { completed: false, priority: 'b', milestone: 'Beta', values: { 'Script & Tuning Tasks': 33, 'Game Design Tasks': 5 } }),
      card('#zone Skyreach', { completed: false, priority: 'c', milestone: 'Content Complete', values: { 'Script & Tuning Tasks': 33, 'Game Design Tasks': 4 } }),
    ],
  },
  {
    name: 'Perks',
    progress: '16/16',
    cards: [
      card('#perk Silent Hunter', { completed: false, priority: 'a', milestone: 'Alpha 2.0', values: {} }),
      card('#perk Iron Will', { completed: false, priority: 'b', milestone: 'Beta', values: {} }),
      card('#perk Quick Reflexes', { completed: false, priority: 'c', milestone: 'Content Complete', values: {} }),
    ],
  },
  {
    name: 'Tribes',
    progress: '22/22',
    cards: [
      card('#tribe Ironclad', { completed: false, priority: 'a', milestone: 'Alpha 1.0', values: { 'Tech Art Tasks': 15, 'Feedback Inbox': 1, 'Script & Tuning Tasks': 30, 'Game Design Tasks': 1, 'CE2 Art Requests': 55 } }),
      card('#tribe Nightstalkers', { completed: false, priority: 'b', milestone: 'Alpha 2.0', values: { 'Tech Art Tasks': 15, 'Script & Tuning Tasks': 30, 'CE2 Art Requests': 55 } }),
      card('#tribe Sunseekers', { completed: false, priority: 'b', milestone: 'Beta', values: { 'Tech Art Tasks': 15, 'Script & Tuning Tasks': 30, 'CE2 Art Requests': 55 } }),
      card('#tribe Frostborn', { completed: false, priority: 'c', milestone: 'Content Complete', values: { 'Tech Art Tasks': 15, 'Script & Tuning Tasks': 30, 'CE2 Art Requests': 55 } }),
    ],
  },
  {
    name: 'Map Hazards',
    progress: '13/13',
    cards: [
      card('#hazard Spike Trap', { completed: false, priority: 'a', milestone: 'Alpha 1.0', values: { 'Tech Art Tasks': 7, 'Script & Tuning Tasks': 16, 'Game Design Tasks': 3, 'Art Direction': 3, 'CE2 Art Requests': 3 } }),
      card('#hazard Poison Gas', { completed: false, priority: 'b', milestone: 'Alpha 2.0', values: { 'Tech Art Tasks': 6, 'Script & Tuning Tasks': 16, 'Game Design Tasks': 4, 'Art Direction': 4, 'CE2 Art Requests': 4 } }),
      card('#hazard Falling Rocks', { completed: false, priority: 'b', milestone: 'Beta', values: { 'Tech Art Tasks': 7, 'Script & Tuning Tasks': 17, 'Game Design Tasks': 3, 'Art Direction': 3, 'CE2 Art Requests': 3 } }),
      card('#hazard Fire Geyser', { completed: false, priority: 'c', milestone: 'Content Complete', values: { 'Tech Art Tasks': 6, 'Script & Tuning Tasks': 16, 'Game Design Tasks': 3, 'Art Direction': 3, 'CE2 Art Requests': 3 } }),
    ],
  },
  {
    name: 'Enemies',
    progress: '30/30',
    cards: [
      card('#enemy Goblin', { completed: true, priority: 'a', milestone: 'Alpha 1.0', values: { 'Tech Art Tasks': 8, 'Animation Tasks': 14, 'Script & Tuning Tasks': 50, 'Game Design Tasks': 7, 'CE2 Bugs Inbox': 14, 'Ambient Sounds': 7, 'Character Art': 19, 'Map Art': 14 } }),
      card('#enemy Skeleton', { completed: false, priority: 'a', milestone: 'Alpha 1.0', values: { 'Tech Art Tasks': 7, 'Animation Tasks': 14, 'Script & Tuning Tasks': 49, 'Writing Tasks': 1, 'Game Design Tasks': 8, 'CE2 Bugs Inbox': 13, 'Ambient Sounds': 7, 'Character Art': 19, 'Map Art': 14 } }),
      card('#enemy Dragon', { completed: false, priority: 'a', milestone: 'Alpha 2.0', values: { 'Tech Art Tasks': 7, 'Animation Tasks': 14, 'Script & Tuning Tasks': 49, 'Game Design Tasks': 7, 'CE2 Bugs Inbox': 14, 'Ambient Sounds': 7, 'Character Art': 19, 'Map Art': 14 } }),
      card('#enemy Wraith', { completed: false, priority: 'b', milestone: 'Beta', values: { 'Tech Art Tasks': 7, 'Animation Tasks': 14, 'Script & Tuning Tasks': 48, 'Game Design Tasks': 7, 'CE2 Bugs Inbox': 13, 'Ambient Sounds': 7, 'Character Art': 18, 'Map Art': 14 } }),
    ],
  },
]

// ─── Helpers for aggregation ─────────────────────────────────────────────────

/** Aggregate card values into { columnName: total } for a list of cards */
export function aggregateCards(cards) {
  const agg = {}
  for (const c of cards) {
    for (const [col, val] of Object.entries(c.values)) {
      agg[col] = (agg[col] ?? 0) + val
    }
  }
  return agg
}

/** Aggregate only completed cards → { columnName: doneCount } */
export function aggregateDone(cards) {
  return aggregateCards(cards.filter((c) => c.completed))
}

/** Filter cards by active priorities (Set) and/or milestone (string|null) */
export function filterCards(cards, { priorities = null, milestone = null } = {}) {
  let filtered = cards
  if (priorities && priorities.size > 0) {
    filtered = filtered.filter((c) => priorities.has(c.priority))
  }
  if (milestone) {
    filtered = filtered.filter((c) => c.milestone === milestone)
  }
  return filtered
}

// ─── Capacity data ───────────────────────────────────────────────────────────

const months = ['2026-01', '2026-02', '2026-03', '2026-04', '2026-05', '2026-06']
export { months }

/**
 * capacityData: array of team groups, each containing decks, each with members.
 * Members have a weekly capacity (cards/week) and monthly allocations (hours or cards).
 */
/** Build a flat lookup: deckName → { members, totalCap }
 *  totalCap = sum of all members' monthly allocations */
export function getDeckCapacity() {
  const map = {}
  for (const group of capacityData) {
    for (const deck of group.decks) {
      let totalCap = 0
      for (const m of deck.members) {
        for (const v of Object.values(m.months)) totalCap += v
      }
      map[deck.name] = { members: deck.members, totalCap }
    }
  }
  return map
}

export const capacityData = [
  {
    group: 'Tasks',
    color: 'purple',
    decks: [
      {
        name: 'Tech Art Tasks',
        members: [
          { name: 'muuutsch', capacity: 0, months: { '2026-01': 0, '2026-02': 0, '2026-03': 0, '2026-04': 0, '2026-05': 0, '2026-06': 0 } },
          { name: 'Alex K.', capacity: 0, months: { '2026-01': 0, '2026-02': 0, '2026-03': 0, '2026-04': 0, '2026-05': 0, '2026-06': 0 } },
        ],
      },
      {
        name: 'Animation Tasks',
        members: [
          { name: 'Riad', capacity: 0, months: { '2026-01': 0, '2026-02': 0, '2026-03': 0, '2026-04': 0, '2026-05': 0, '2026-06': 0 } },
        ],
      },
      {
        name: 'Feedback Inbox',
        members: [
          { name: 'Sarah L.', capacity: 0, months: { '2026-01': 0, '2026-02': 0, '2026-03': 0, '2026-04': 0, '2026-05': 0, '2026-06': 0 } },
        ],
      },
      {
        name: 'Script & Tuning Tasks',
        members: [
          { name: 'muuutsch', capacity: 0, months: { '2026-01': 0, '2026-02': 0, '2026-03': 0, '2026-04': 0, '2026-05': 0, '2026-06': 0 } },
          { name: 'Jonas P.', capacity: 0, months: { '2026-01': 0, '2026-02': 0, '2026-03': 0, '2026-04': 0, '2026-05': 0, '2026-06': 0 } },
          { name: 'Lena W.', capacity: 0, months: { '2026-01': 0, '2026-02': 0, '2026-03': 0, '2026-04': 0, '2026-05': 0, '2026-06': 0 } },
        ],
      },
      {
        name: 'Writing Tasks',
        members: [
          { name: 'Emily R.', capacity: 0, months: { '2026-01': 0, '2026-02': 0, '2026-03': 0, '2026-04': 0, '2026-05': 0, '2026-06': 0 } },
        ],
      },
      {
        name: 'Code Tasks',
        members: [
          { name: 'Chris D.', capacity: 0, months: { '2026-01': 0, '2026-02': 0, '2026-03': 0, '2026-04': 0, '2026-05': 0, '2026-06': 0 } },
          { name: 'Mika T.', capacity: 0, months: { '2026-01': 0, '2026-02': 0, '2026-03': 0, '2026-04': 0, '2026-05': 0, '2026-06': 0 } },
        ],
      },
      {
        name: 'Game Design Tasks',
        members: [
          { name: 'muuutsch', capacity: 0, months: { '2026-01': 0, '2026-02': 0, '2026-03': 0, '2026-04': 0, '2026-05': 0, '2026-06': 0 } },
          { name: 'Nina B.', capacity: 0, months: { '2026-01': 0, '2026-02': 0, '2026-03': 0, '2026-04': 0, '2026-05': 0, '2026-06': 0 } },
        ],
      },
    ],
  },
  {
    group: 'QA',
    color: 'ocean',
    decks: [
      {
        name: 'CE2 Bugs Inbox',
        members: [
          { name: 'Tom H.', capacity: 0, months: { '2026-01': 0, '2026-02': 0, '2026-03': 0, '2026-04': 0, '2026-05': 0, '2026-06': 0 } },
          { name: 'Lisa M.', capacity: 0, months: { '2026-01': 0, '2026-02': 0, '2026-03': 0, '2026-04': 0, '2026-05': 0, '2026-06': 0 } },
        ],
      },
    ],
  },
  {
    group: 'Sound',
    color: 'caramel',
    decks: [
      {
        name: 'CE2 Music',
        members: [
          { name: 'Max S.', capacity: 0, months: { '2026-01': 0, '2026-02': 0, '2026-03': 0, '2026-04': 0, '2026-05': 0, '2026-06': 0 } },
        ],
      },
      {
        name: 'Ambient Sounds',
        members: [
          { name: 'Max S.', capacity: 0, months: { '2026-01': 0, '2026-02': 0, '2026-03': 0, '2026-04': 0, '2026-05': 0, '2026-06': 0 } },
        ],
      },
      {
        name: 'UI Sounds',
        members: [
          { name: 'Anna F.', capacity: 0, months: { '2026-01': 0, '2026-02': 0, '2026-03': 0, '2026-04': 0, '2026-05': 0, '2026-06': 0 } },
        ],
      },
      {
        name: 'Combat Sounds',
        members: [
          { name: 'Max S.', capacity: 0, months: { '2026-01': 0, '2026-02': 0, '2026-03': 0, '2026-04': 0, '2026-05': 0, '2026-06': 0 } },
        ],
      },
    ],
  },
  {
    group: 'Art',
    color: 'tangerine',
    decks: [
      {
        name: 'Location Art',
        members: [
          { name: 'Yuki N.', capacity: 0, months: { '2026-01': 0, '2026-02': 0, '2026-03': 0, '2026-04': 0, '2026-05': 0, '2026-06': 0 } },
          { name: 'David C.', capacity: 0, months: { '2026-01': 0, '2026-02': 0, '2026-03': 0, '2026-04': 0, '2026-05': 0, '2026-06': 0 } },
        ],
      },
      {
        name: 'Character Art',
        members: [
          { name: 'Yuki N.', capacity: 0, months: { '2026-01': 0, '2026-02': 0, '2026-03': 0, '2026-04': 0, '2026-05': 0, '2026-06': 0 } },
        ],
      },
      {
        name: 'Art Direction',
        members: [
          { name: 'David C.', capacity: 0, months: { '2026-01': 0, '2026-02': 0, '2026-03': 0, '2026-04': 0, '2026-05': 0, '2026-06': 0 } },
        ],
      },
      {
        name: 'Map Art',
        members: [
          { name: 'David C.', capacity: 0, months: { '2026-01': 0, '2026-02': 0, '2026-03': 0, '2026-04': 0, '2026-05': 0, '2026-06': 0 } },
        ],
      },
      {
        name: 'CE2 Art Requests',
        members: [
          { name: 'Yuki N.', capacity: 0, months: { '2026-01': 0, '2026-02': 0, '2026-03': 0, '2026-04': 0, '2026-05': 0, '2026-06': 0 } },
          { name: 'David C.', capacity: 0, months: { '2026-01': 0, '2026-02': 0, '2026-03': 0, '2026-04': 0, '2026-05': 0, '2026-06': 0 } },
          { name: 'Priya G.', capacity: 0, months: { '2026-01': 0, '2026-02': 0, '2026-03': 0, '2026-04': 0, '2026-05': 0, '2026-06': 0 } },
        ],
      },
    ],
  },
  {
    group: 'Archive',
    color: 'cornflower',
    decks: [
      {
        name: 'Event Polish Tasks',
        members: [
          { name: 'Sarah L.', capacity: 0, months: { '2026-01': 0, '2026-02': 0, '2026-03': 0, '2026-04': 0, '2026-05': 0, '2026-06': 0 } },
        ],
      },
    ],
  },
]
