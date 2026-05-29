// Electrical panel data
// -----------------------------------------------------------------------------
// Labels transcribed from the handwritten panel directory cards (Square D QO
// QOC42UF, 42-circuit covers). `slot` is the printed circuit number on the panel
// (odd = left column, even = right column). Two-pole breakers list the lower
// circuit number and render double-height; their paired number is noted.
//
// NOTE: amperage, pole count, wire gauge, and breaker type (GFCI/AFCI) are NOT
// printed on the directory cards — they are reasonable inferences from the load
// type. Adjust if you confirm the actual breakers.

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
      { slot: 0, side: "main", poles: 2, amps: 200, label: "Main Breaker", wire: "4/0 AL service entrance", type: "main", notes: "Service disconnect feeding both bus stabs." },

      // Left column (odd)
      { slot: 1, side: "left", poles: 1, amps: 20, label: "Washer", wire: "12 AWG Cu", type: "standard", notes: "Laundry appliance circuit." },
      { slot: 3, side: "left", poles: 1, amps: 20, label: "Microwave", wire: "12 AWG Cu", type: "standard", notes: "Dedicated appliance circuit." },
      { slot: 5, side: "left", poles: 1, amps: 20, label: "Master Bath / Basement Bath", wire: "12 AWG Cu", type: "gfci", notes: "Bathroom receptacles." },
      { slot: 7, side: "left", poles: 1, amps: 20, label: "Bath outlets", wire: "12 AWG Cu", type: "gfci", notes: "" },
      { slot: 9, side: "left", poles: 1, amps: 15, label: "Garage Door", wire: "14 AWG Cu", type: "standard", notes: "Garage door opener." },
      { slot: 11, side: "left", poles: 1, amps: 20, label: "Dining Room / Breakfast", wire: "12 AWG Cu", type: "standard", notes: "" },
      { slot: 13, side: "left", poles: 2, amps: 30, label: "Dryer", wire: "10 AWG Cu", type: "standard", notes: "240V — circuits 13/15." },
      { slot: 17, side: "left", poles: 2, amps: 40, label: "Oven", wire: "8 AWG Cu", type: "standard", notes: "240V — circuits 17/19." },
      { slot: 21, side: "left", poles: 2, amps: 60, label: "Tesla", wire: "6 AWG Cu", type: "standard", notes: "240V Tesla EV charger — circuits 21/23." },
      { slot: 25, side: "left", poles: 2, amps: 20, label: "Surge Protector", wire: "—", type: "standard", notes: "Whole-panel SPD — circuits 25/27." },

      // Right column (even)
      { slot: 2, side: "right", poles: 1, amps: 20, label: "Kitchen outlets", wire: "12 AWG Cu", type: "gfci", notes: "Small-appliance branch circuit." },
      { slot: 4, side: "right", poles: 1, amps: 20, label: "Fridge", wire: "12 AWG Cu", type: "standard", notes: "Refrigerator." },
      { slot: 6, side: "right", poles: 1, amps: 20, label: "Sump Pump", wire: "12 AWG Cu", type: "standard", notes: "Dedicated circuit." },
      { slot: 8, side: "right", poles: 1, amps: 20, label: "Kitchen outlets", wire: "12 AWG Cu", type: "gfci", notes: "Small-appliance branch circuit." },
      { slot: 10, side: "right", poles: 1, amps: 15, label: "Vent Hood", wire: "14 AWG Cu", type: "standard", notes: "Range hood." },
      { slot: 12, side: "right", poles: 1, amps: 20, label: "Garage GFI", wire: "12 AWG Cu", type: "gfci", notes: "Garage receptacles." },
      { slot: 14, side: "right", poles: 1, amps: 20, label: "Garage GFI (tandem)", wire: "12 AWG Cu", type: "gfci", notes: "Tandem breaker." },
      { slot: 16, side: "right", poles: 2, amps: 30, label: "Heat Pump", wire: "10 AWG Cu", type: "standard", notes: "240V — circuits 16/18." },
      { slot: 20, side: "right", poles: 2, amps: 30, label: "A/C", wire: "10 AWG Cu", type: "standard", notes: "240V condenser — circuits 20/22." },
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
      { slot: 0, side: "main", poles: 2, amps: 200, label: "Main Breaker", wire: "4/0 AL feeder", type: "main", notes: "Service disconnect feeding both bus stabs." },

      // Left column (odd)
      { slot: 1, side: "left", poles: 1, amps: 20, label: "Garage", wire: "12 AWG Cu", type: "standard", notes: "" },
      { slot: 3, side: "left", poles: 1, amps: 20, label: "Powder Bath", wire: "12 AWG Cu", type: "gfci", notes: "" },
      { slot: 5, side: "left", poles: 1, amps: 15, label: "Bedroom #4", wire: "14 AWG Cu", type: "afci", notes: "" },
      { slot: 7, side: "left", poles: 1, amps: 15, label: "Basement Room (unfinished)", wire: "14 AWG Cu", type: "standard", notes: "" },
      { slot: 9, side: "left", poles: 1, amps: 15, label: "Master Bath / Closet", wire: "14 AWG Cu", type: "standard", notes: "" },
      { slot: 11, side: "left", poles: 1, amps: 20, label: "Basement Full / Family outlets", wire: "12 AWG Cu", type: "standard", notes: "" },
      { slot: 13, side: "left", poles: 1, amps: 15, label: "Front Foyer / Dining Light", wire: "14 AWG Cu", type: "standard", notes: "" },
      { slot: 15, side: "left", poles: 1, amps: 20, label: "Basement Bedroom Bath", wire: "12 AWG Cu", type: "gfci", notes: "" },
      { slot: 17, side: "left", poles: 1, amps: 15, label: "Smoke Detectors", wire: "14 AWG Cu", type: "standard", notes: "Interconnected detectors." },
      { slot: 19, side: "left", poles: 1, amps: 15, label: "Basement Full / Family Lights", wire: "14 AWG Cu", type: "standard", notes: "" },
      { slot: 21, side: "left", poles: 1, amps: 15, label: "Basement Loft Room", wire: "14 AWG Cu", type: "standard", notes: "" },
      { slot: 23, side: "left", poles: 2, amps: 30, label: "A/C", wire: "10 AWG Cu", type: "standard", notes: "240V condenser — circuits 23/25." },
      { slot: 27, side: "left", poles: 2, amps: 20, label: "Surge Protector", wire: "—", type: "standard", notes: "Whole-panel SPD — circuits 27/29." },
      { slot: 31, side: "left", poles: 1, amps: 15, label: "Spare (former Sense feed)", wire: "—", type: "spare", notes: "Previously fed the Sense energy monitor, which has been removed." },

      // Right column (even)
      { slot: 2, side: "right", poles: 1, amps: 20, label: "Dishwasher", wire: "12 AWG Cu", type: "standard", notes: "Dedicated appliance circuit." },
      { slot: 4, side: "right", poles: 1, amps: 15, label: "Porch Lights", wire: "14 AWG Cu", type: "standard", notes: "" },
      { slot: 6, side: "right", poles: 1, amps: 20, label: "Bath #4", wire: "12 AWG Cu", type: "gfci", notes: "" },
      { slot: 8, side: "right", poles: 1, amps: 20, label: "Bath #2 / Hall / Attic", wire: "12 AWG Cu", type: "gfci", notes: "" },
      { slot: 10, side: "right", poles: 1, amps: 15, label: "Pantry-Dining / Kitchen Light", wire: "14 AWG Cu", type: "standard", notes: "" },
      { slot: 12, side: "right", poles: 1, amps: 15, label: "Bedroom #3", wire: "14 AWG Cu", type: "afci", notes: "" },
      { slot: 14, side: "right", poles: 1, amps: 15, label: "Disposal", wire: "14 AWG Cu", type: "standard", notes: "Garbage disposal." },
      { slot: 16, side: "right", poles: 1, amps: 15, label: "Bedroom #2", wire: "14 AWG Cu", type: "afci", notes: "" },
      { slot: 18, side: "right", poles: 1, amps: 15, label: "Master Bedroom", wire: "14 AWG Cu", type: "afci", notes: "" },
      { slot: 20, side: "right", poles: 1, amps: 15, label: "Bedroom #3 outlets", wire: "14 AWG Cu", type: "afci", notes: "" },
      { slot: 22, side: "right", poles: 1, amps: 20, label: "Basement Furnace", wire: "12 AWG Cu", type: "standard", notes: "" },
      { slot: 24, side: "right", poles: 1, amps: 20, label: "Attic Furnace", wire: "12 AWG Cu", type: "standard", notes: "" },
      { slot: 26, side: "right", poles: 1, amps: 20, label: "Basement GFI", wire: "12 AWG Cu", type: "gfci", notes: "" },
      { slot: 28, side: "right", poles: 1, amps: 20, label: "Family Room", wire: "12 AWG Cu", type: "standard", notes: "" },
      { slot: 30, side: "right", poles: 2, amps: 40, label: "Cooktop", wire: "8 AWG Cu", type: "standard", notes: "240V — circuits 30/32." },
    ],
  },
};
