// Mock RESO-compliant property data (Bridge Data Output format)
// Uses exact RESO keys per PRD Phase 0 requirements

export const mockProperty = {
  ListingKey: "MOCK-2026-001",
  ListPrice: 4250000,
  StandardStatus: "Active",
  PropertyType: "Residential",
  PropertySubType: "Condominium",
  LivingArea: 2850,
  BedroomsTotal: 3,
  BathroomsTotalInteger: 3,
  BathroomsFull: 2,
  BathroomsHalf: 1,
  YearBuilt: 2024,
  Levels: ["One"],
  Stories: 1,
  ArchitecturalStyle: ["Contemporary"],
  Flooring: ["Marble", "Hardwood"],
  Heating: ["Central"],
  Cooling: ["Central Air"],
  ParkingTotal: 2,
  GarageSpaces: 2,
  AssociationFee: 2800,
  AssociationFeeFrequency: "Monthly",
  TaxAnnualAmount: 42500,
  BridgeModificationTimestamp: "2026-02-15T14:30:00.000Z",
  ModificationTimestamp: "2026-02-15T14:25:00.000Z",
  ListingContractDate: "2026-01-15",
  DaysOnMarket: 33,

  // Address
  UnparsedAddress: "1500 Ocean Drive, Unit 5, Miami Beach, FL 33139",
  StreetNumber: "1500",
  StreetName: "Ocean",
  StreetSuffix: "Drive",
  UnitNumber: "5",
  City: "Miami Beach",
  StateOrProvince: "FL",
  PostalCode: "33139",
  Country: "US",
  Latitude: 25.7781,
  Longitude: -80.1307,

  // Description
  PublicRemarks:
    "Stunning oceanfront residence in one of Miami Beach's most coveted addresses. This impeccably designed 3-bedroom, 3-bathroom condominium offers 2,850 sq ft of refined living space with floor-to-ceiling windows framing panoramic views of the Atlantic Ocean. Features include a chef's kitchen with Gaggenau appliances, Italian marble flooring throughout, a private terrace with summer kitchen, and direct beach access. Building amenities include 24-hour concierge, infinity pool, spa, fitness center, and private marina.",

  // Media — nested inside Property (Bridge format, NOT separate fetch)
  Media: [
    {
      MediaURL: "/mock/living-room.jpg",
      ShortDescription: "Living Room with Ocean View",
      MediaCategory: "Photo",
      Order: 0,
    },
    {
      MediaURL: "/mock/kitchen.jpg",
      ShortDescription: "Chef's Kitchen",
      MediaCategory: "Photo",
      Order: 1,
    },
    {
      MediaURL: "/mock/master-bedroom.jpg",
      ShortDescription: "Primary Suite",
      MediaCategory: "Photo",
      Order: 2,
    },
    {
      MediaURL: "/mock/terrace.jpg",
      ShortDescription: "Private Terrace",
      MediaCategory: "Photo",
      Order: 3,
    },
  ],

  // Listing Agent (NOT our brokerage — demonstrates courtesy attribution)
  ListAgentFullName: "Jane Smith",
  ListAgentEmail: "jane@otherbrokerage.com",
  ListOfficeName: "Prestige Realty Group",
  ListOfficePhone: "305-555-0100",
};

// Our brokerage name — used for attribution logic
export const OUR_BROKERAGE = "LoKation Real Estate";

// Site agent — all inquiries route to Andrew
export const SITE_AGENT = {
  name: "Andrew Whalen",
  title: "Realtor®",
  brokerage: "LoKation Real Estate",
  email: "andrew@iamandrewwhalen.com",
  phone: "(305) 420-6613",
};
