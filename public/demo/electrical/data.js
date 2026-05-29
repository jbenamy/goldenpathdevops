// Electrical panel data
// -----------------------------------------------------------------------------
// Labels transcribed from the handwritten panel directory cards (Square D QO
// QOC42UF, 42-circuit covers). `slot` is the printed circuit number on the panel
// (odd = left column, even = right column). Two-pole breakers list the lower
// circuit number and render double-height; their paired number is noted.
//
// NOTE: amperage, pole count, and breaker type (GFCI/AFCI) are NOT printed on
// the directory cards — they are reasonable inferences from the load type.
// Adjust if you confirm the actual breakers.

const PANELS = {
  A: {
    name: "Panel A",
    make: "Square D QO — QOC42UF",
    mainAmps: 200,
    voltage: "120/240V split-phase",
    location: "Left enclosure",
    description:
      "42-circuit Square D QO load center. Carries the major 240V loads — dryer, oven, heat pump, A/C, and the Tesla EV charger.",
    circuits: [
      { slot: 0, side: "main", poles: 2, amps: 200, label: "Main Breaker", type: "main", notes: "Service disconnect feeding both bus stabs." },

      // Left column (odd) — 6 × 20A DF, then 30/40/60 standard two-pole
      { slot: 1, side: "left", poles: 1, amps: 20, label: "Washer", type: "df", notes: "Laundry appliance circuit." },
      { slot: 3, side: "left", poles: 1, amps: 20, label: "Microwave", type: "df", notes: "Dedicated appliance circuit." },
      { slot: 5, side: "left", poles: 1, amps: 20, label: "Master Bath / Basement Bath", type: "df", notes: "Bathroom receptacles." },
      { slot: 7, side: "left", poles: 1, amps: 20, label: "Bath Outlets", type: "df", notes: "" },
      { slot: 9, side: "left", poles: 1, amps: 20, label: "Gate Door", type: "df", notes: "Gate door opener." },
      { slot: 11, side: "left", poles: 1, amps: 20, label: "Dining Room / Breakfast", type: "df", notes: "" },
      { slot: 13, side: "left", poles: 2, amps: 30, label: "Dryer", type: "standard", notes: "240V — circuits 13/15." },
      { slot: 17, side: "left", poles: 2, amps: 40, label: "Oven", type: "standard", notes: "240V — circuits 17/19." },
      { slot: 21, side: "left", poles: 2, amps: 60, label: "Tesla", type: "standard", notes: "240V Tesla EV charger — circuits 21/23." },

      // Right column (even) — 5 × 20A DF, 2 × 20A standard, 35/35 standard two-pole, then 20A standard
      { slot: 2, side: "right", poles: 1, amps: 20, label: "Kitchen Outlets", type: "df", notes: "Small-appliance branch circuit." },
      { slot: 4, side: "right", poles: 1, amps: 20, label: "Fridge", type: "df", notes: "Refrigerator." },
      { slot: 6, side: "right", poles: 1, amps: 20, label: "Sump Pump", type: "df", notes: "Dedicated circuit." },
      { slot: 8, side: "right", poles: 1, amps: 20, label: "Kitchen Outlets", type: "df", notes: "Small-appliance branch circuit." },
      { slot: 10, side: "right", poles: 1, amps: 20, label: "Vent Hood", type: "df", notes: "Range hood." },
      { slot: 12, side: "right", poles: 1, amps: 20, label: "Garage GFI", type: "standard", notes: "Garage receptacles." },
      { slot: 14, side: "right", poles: 1, amps: 20, label: "Garage GFI (Tandem)", type: "standard", notes: "Tandem breaker." },
      { slot: 16, side: "right", poles: 2, amps: 35, label: "Heat Pump", type: "standard", notes: "240V — circuits 16/18." },
      { slot: 20, side: "right", poles: 2, amps: 35, label: "A/C", type: "standard", notes: "240V condenser — circuits 20/22." },
      { slot: 24, side: "right", poles: 1, amps: 20, label: "Surge Protector", type: "standard", notes: "Whole-panel SPD." },
    ],
  },

  B: {
    name: "Panel B",
    make: "Square D QO — QOC42UF",
    mainAmps: 200,
    voltage: "120/240V split-phase",
    location: "Right enclosure",
    description:
      "42-circuit Square D QO load center. Carries most of the lighting and receptacle branch circuits for bedrooms, baths, and the basement, plus the cooktop, furnaces, and a second A/C.",
    circuits: [
      { slot: 0, side: "main", poles: 2, amps: 200, label: "Main Breaker", type: "main", notes: "Service disconnect feeding both bus stabs." },

      // Left column (odd) — 10 × 15A DF, then 90A two-pole, 20A, 25A standard
      { slot: 1, side: "left", poles: 1, amps: 15, label: "Garage", type: "df", notes: "" },
      { slot: 3, side: "left", poles: 1, amps: 15, label: "Powder Bath", type: "df", notes: "" },
      { slot: 5, side: "left", poles: 1, amps: 15, label: "Bedroom #4", type: "df", notes: "" },
      { slot: 7, side: "left", poles: 1, amps: 15, label: "Basement Room (Unfinished)", type: "df", notes: "" },
      { slot: 9, side: "left", poles: 1, amps: 15, label: "Master Bath / Closet", type: "df", notes: "" },
      { slot: 11, side: "left", poles: 1, amps: 15, label: "Basement Full / Family Outlets", type: "df", notes: "" },
      { slot: 13, side: "left", poles: 1, amps: 15, label: "Front Foyer / Dining Light", type: "df", notes: "" },
      { slot: 15, side: "left", poles: 1, amps: 15, label: "Basement Bedroom Bath", type: "df", notes: "" },
      { slot: 17, side: "left", poles: 1, amps: 15, label: "Smoke Detectors", type: "df", notes: "Interconnected detectors." },
      { slot: 19, side: "left", poles: 1, amps: 15, label: "Basement Full / Family Lights", type: "df", notes: "" },
      { slot: 21, side: "left", poles: 2, amps: 90, label: "A/C", type: "standard", notes: "240V condenser — circuits 21/23." },
      { slot: 25, side: "left", poles: 2, amps: 20, label: "Surge Protector", type: "standard", notes: "Whole-panel SPD — circuits 25/27." },
      { slot: 29, side: "left", poles: 2, amps: 25, label: "Spare (Sense)", type: "spare", notes: "2-pole spare — formerly fed the Sense energy monitor — circuits 29/31." },

      // Right column (even) — 9 × 15A DF, 3 × 15A standard, 1 × 15A DF, then 45A two-pole standard
      { slot: 2, side: "right", poles: 1, amps: 15, label: "Dishwasher", type: "df", notes: "Dedicated appliance circuit." },
      { slot: 4, side: "right", poles: 1, amps: 15, label: "Porch Lights", type: "df", notes: "" },
      { slot: 6, side: "right", poles: 1, amps: 15, label: "Bath #4", type: "df", notes: "" },
      { slot: 8, side: "right", poles: 1, amps: 15, label: "Bath #2 / Hall / Attic", type: "df", notes: "" },
      { slot: 10, side: "right", poles: 1, amps: 15, label: "Pantry-Dining / Kitchen Light", type: "df", notes: "" },
      { slot: 12, side: "right", poles: 1, amps: 15, label: "Bedroom #3", type: "df", notes: "" },
      { slot: 14, side: "right", poles: 1, amps: 15, label: "Disposal", type: "df", notes: "Garbage disposal." },
      { slot: 16, side: "right", poles: 1, amps: 15, label: "Bedroom #2", type: "df", notes: "" },
      { slot: 18, side: "right", poles: 1, amps: 15, label: "Master Bedroom", type: "df", notes: "" },
      { slot: 20, side: "right", poles: 1, amps: 15, label: "Bedroom #3 Outlets", type: "standard", notes: "" },
      { slot: 22, side: "right", poles: 1, amps: 15, label: "Basement Furnace", type: "standard", notes: "" },
      { slot: 24, side: "right", poles: 1, amps: 15, label: "Attic Furnace", type: "standard", notes: "" },
      { slot: 26, side: "right", poles: 1, amps: 15, label: "Basement GFI", type: "df", notes: "" },
      { slot: 28, side: "right", poles: 2, amps: 45, label: "Cooktop", type: "standard", notes: "240V — circuits 28/30." },
    ],
  },
};
