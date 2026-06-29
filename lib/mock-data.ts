import {
  Role,
  AnimalType,
  Status,
  RecordStatus,
  MissionStatus,
  DonationType,
  PaymentStatus,
} from "@prisma/client";

const createdAt = new Date("2024-01-01T00:00:00.000Z");

export const users = [
  {
    id: "user_admin_demo",
    email: "admin@ajunifoundation.in",
    name: "Trust Admin",
    role: Role.ADMIN,
    image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop",
    building: null,
    tower: null,
    createdAt,
  },
  {
    id: "user_resident_demo",
    email: "demo@resident.com",
    name: "Demo Resident",
    role: Role.RESIDENT,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop",
    building: null,
    tower: "Tower A",
    createdAt,
  },
  {
    id: "user_feeder_priya",
    email: "feeder@ajunifoundation.in",
    name: "Priya Sharma",
    role: Role.FEEDER,
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&auto=format&fit=crop",
    building: null,
    tower: "Tower B",
    createdAt,
  },
  {
    id: "user_feeder_rahul",
    email: "rahul@ajunifoundation.in",
    name: "Rahul Mehta",
    role: Role.FEEDER,
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop",
    building: null,
    tower: "Tower C",
    createdAt,
  },
];

export const animals = [
  {
    id: "animal_bhaiya",
    name: "Bhaiya",
    nickname: "The Gatekeeper",
    type: AnimalType.DOG,
    zone: "Back Gate",
    status: Status.HEALTHY,
    gender: "Male",
    ageApprox: "4 years",
    description:
      "Bhaiya is the unofficial guardian of the Back Gate. He greets every resident with a wagging tail and has a calm, protective nature. Neutered and vaccinated, he is the perfect companion for evening walks.",
    image:
      "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&auto=format&fit=crop",
    tags: ["protective", "calm", "neutered"],
    adoptable: false,
    createdAt,
  },
  {
    id: "animal_rani",
    name: "Rani",
    nickname: "Parking Princess",
    type: AnimalType.CAT,
    zone: "Parking Bay",
    status: Status.ADOPTABLE,
    gender: "Female",
    ageApprox: "2 years",
    description:
      "Rani is a gentle tabby who loves quiet afternoons near the parking bay. She is litter-trained, vaccinated, and gets along well with children. Ideal for a first-time adopter looking for a calm indoor companion.",
    image:
      "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&auto=format&fit=crop",
    tags: ["calm", "cuddly", "first-time friendly"],
    adoptable: true,
    createdAt,
  },
  {
    id: "animal_chottu",
    name: "Chottu",
    nickname: "Little Fighter",
    type: AnimalType.CAT,
    zone: "Parking Bay",
    status: Status.URGENT,
    gender: "Male",
    ageApprox: "6 months",
    description:
      "Chottu was found with a severe leg injury near the parking bay. He has undergone initial first aid and needs surgery to recover fully. Despite the pain, he purrs loudly when petted.",
    image:
      "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=800&auto=format&fit=crop",
    tags: ["playful", "brave", "needs care"],
    adoptable: false,
    createdAt,
  },
  {
    id: "animal_raja",
    name: "Raja",
    nickname: "Tower King",
    type: AnimalType.DOG,
    zone: "Tower A",
    status: Status.HEALTHY,
    gender: "Male",
    ageApprox: "3 years",
    description:
      "Raja patrols Tower A with confidence and charm. He is friendly with residents, loves short walks, and has been neutered and vaccinated. A true neighborhood legend.",
    image:
      "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&auto=format&fit=crop",
    tags: ["playful", "protective", "neutered"],
    adoptable: false,
    createdAt,
  },
  {
    id: "animal_billi",
    name: "Billi",
    nickname: "Silent Observer",
    type: AnimalType.CAT,
    zone: "Parking Bay",
    status: Status.ADOPTABLE,
    gender: "Female",
    ageApprox: "1.5 years",
    description:
      "Billi is a shy but affectionate cat once she trusts you. She enjoys window views and soft blankets. Perfect for a calm household that can give her patience and love.",
    image:
      "https://images.unsplash.com/photo-1529778873920-4da4926a7071?w=800&auto=format&fit=crop",
    tags: ["calm", "shy", "indoor"],
    adoptable: true,
    createdAt,
  },
  {
    id: "animal_hope",
    name: "Hope",
    nickname: "Aarey Explorer",
    type: AnimalType.DOG,
    zone: "Aarey Edge",
    status: Status.WATCHING,
    gender: "Female",
    ageApprox: "2 years",
    description:
      "Hope is often seen exploring the greener edges of Aarey Colony. She is currently under observation for a skin condition. Feeder volunteers check on her daily.",
    image:
      "https://images.unsplash.com/photo-1598133894008-61f7fdb8cc3a?w=800&auto=format&fit=crop",
    tags: ["active", "friendly", "under observation"],
    adoptable: false,
    createdAt,
  },
];

export const healthRecords = [
  {
    id: "hr_bhaiya_1",
    animalId: "animal_bhaiya",
    date: new Date("2024-01-15"),
    event: "Anti-rabies vaccination",
    status: RecordStatus.GOOD,
    funded: true,
    cost: null,
    raised: null,
    vetName: null,
    receiptUrl: null,
  },
  {
    id: "hr_bhaiya_2",
    animalId: "animal_bhaiya",
    date: new Date("2024-03-10"),
    event: "Neutering surgery",
    status: RecordStatus.RESOLVED,
    funded: true,
    cost: 1200,
    raised: 1200,
    vetName: null,
    receiptUrl: null,
  },
  {
    id: "hr_rani_1",
    animalId: "animal_rani",
    date: new Date("2024-02-20"),
    event: "Initial health checkup",
    status: RecordStatus.GOOD,
    funded: true,
    cost: null,
    raised: null,
    vetName: null,
    receiptUrl: null,
  },
  {
    id: "hr_rani_2",
    animalId: "animal_rani",
    date: new Date("2024-04-05"),
    event: "Deworming completed",
    status: RecordStatus.RESOLVED,
    funded: true,
    cost: null,
    raised: null,
    vetName: null,
    receiptUrl: null,
  },
  {
    id: "hr_chottu_1",
    animalId: "animal_chottu",
    date: new Date("2024-05-12"),
    event: "Leg injury first aid",
    status: RecordStatus.ACTIVE,
    funded: true,
    cost: 400,
    raised: 400,
    vetName: null,
    receiptUrl: null,
  },
  {
    id: "hr_chottu_2",
    animalId: "animal_chottu",
    date: new Date("2024-05-20"),
    event: "Surgery scheduled",
    status: RecordStatus.URGENT,
    funded: false,
    cost: 1800,
    raised: 600,
    vetName: null,
    receiptUrl: null,
  },
  {
    id: "hr_raja_1",
    animalId: "animal_raja",
    date: new Date("2024-01-28"),
    event: "Vaccination drive",
    status: RecordStatus.GOOD,
    funded: true,
    cost: null,
    raised: null,
    vetName: null,
    receiptUrl: null,
  },
  {
    id: "hr_raja_2",
    animalId: "animal_raja",
    date: new Date("2024-02-14"),
    event: "Neutering",
    status: RecordStatus.RESOLVED,
    funded: true,
    cost: 1200,
    raised: 1200,
    vetName: null,
    receiptUrl: null,
  },
  {
    id: "hr_billi_1",
    animalId: "animal_billi",
    date: new Date("2024-03-22"),
    event: "Health screening",
    status: RecordStatus.GOOD,
    funded: true,
    cost: null,
    raised: null,
    vetName: null,
    receiptUrl: null,
  },
  {
    id: "hr_hope_1",
    animalId: "animal_hope",
    date: new Date("2024-05-01"),
    event: "Skin condition observation",
    status: RecordStatus.ACTIVE,
    funded: false,
    cost: 800,
    raised: 200,
    vetName: null,
    receiptUrl: null,
  },
];

export const missions = [
  {
    id: "mission_chottu_surgery",
    animalId: "animal_chottu",
    title: "Chottu's Surgery Fund",
    description:
      "Chottu needs urgent orthopedic surgery for his injured leg. Your contribution will cover the procedure, post-operative care, and medicines.",
    image:
      "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=800&auto=format&fit=crop",
    target: 1800,
    raised: 600,
    donors: 12,
    daysLeft: 8,
    status: MissionStatus.ACTIVE,
    createdAt,
  },
  {
    id: "mission_bhaiya_paw",
    animalId: "animal_bhaiya",
    title: "Bhaiya's Paw Treatment",
    description:
      "Bhaiya has developed a painful paw infection. The target covers vet consultation, antibiotics, dressing, and follow-up visits.",
    image:
      "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&auto=format&fit=crop",
    target: 1800,
    raised: 1000,
    donors: 21,
    daysLeft: 12,
    status: MissionStatus.ACTIVE,
    createdAt,
  },
];

export const missionUpdates = [
  {
    id: "mu_chottu_1",
    missionId: "mission_chottu_surgery",
    time: "2 days ago",
    text: "Vet confirmed surgery is needed within the week.",
    photoUrl: null,
  },
  {
    id: "mu_chottu_2",
    missionId: "mission_chottu_surgery",
    time: "5 days ago",
    text: "Initial X-rays completed. fracture is clean and operable.",
    photoUrl: null,
  },
  {
    id: "mu_bhaiya_1",
    missionId: "mission_bhaiya_paw",
    time: "1 day ago",
    text: "Paw dressing changed; infection is responding to antibiotics.",
    photoUrl: null,
  },
  {
    id: "mu_bhaiya_2",
    missionId: "mission_bhaiya_paw",
    time: "4 days ago",
    text: "Vet visit done; treatment plan finalized.",
    photoUrl: null,
  },
];

export const feederLogs = [
  {
    id: "fl_1",
    userId: "user_feeder_priya",
    animalId: "animal_bhaiya",
    date: new Date("2024-06-10T08:00:00.000Z"),
    photoUrl:
      "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&auto=format&fit=crop",
    notes: "Fed rice and chicken. Bhaiya was calm and friendly.",
    latitude: 19.1535,
    longitude: 72.8775,
  },
  {
    id: "fl_2",
    userId: "user_feeder_rahul",
    animalId: "animal_rani",
    date: new Date("2024-06-11T09:30:00.000Z"),
    photoUrl:
      "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&auto=format&fit=crop",
    notes: "Rani ate well and enjoyed some petting.",
    latitude: 19.1528,
    longitude: 72.8768,
  },
  {
    id: "fl_3",
    userId: "user_feeder_priya",
    animalId: "animal_chottu",
    date: new Date("2024-06-12T07:45:00.000Z"),
    photoUrl:
      "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=400&auto=format&fit=crop",
    notes: "Gave medicine. Wound looks better today.",
    latitude: 19.1529,
    longitude: 72.877,
  },
  {
    id: "fl_4",
    userId: "user_feeder_rahul",
    animalId: "animal_raja",
    date: new Date("2024-06-13T10:00:00.000Z"),
    photoUrl:
      "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&auto=format&fit=crop",
    notes: "Raja walked with me to the tower entrance.",
    latitude: 19.1538,
    longitude: 72.878,
  },
];

export const donations = [
  {
    id: "donation_1",
    userId: "user_resident_demo",
    animalId: null,
    missionId: "mission_chottu_surgery",
    amount: 250,
    type: DonationType.MISSION,
    razorpayId: null,
    status: PaymentStatus.SUCCESS,
    createdAt,
  },
  {
    id: "donation_2",
    userId: "user_resident_demo",
    animalId: null,
    missionId: "mission_bhaiya_paw",
    amount: 500,
    type: DonationType.MISSION,
    razorpayId: null,
    status: PaymentStatus.SUCCESS,
    createdAt,
  },
  {
    id: "donation_3",
    userId: null,
    animalId: "animal_rani",
    missionId: null,
    amount: 600,
    type: DonationType.MONTHLY,
    razorpayId: null,
    status: PaymentStatus.SUCCESS,
    createdAt,
  },
];

export const leaderboard = [
  { tower: "Tower Cluster A", coverage: 92, feederCount: 18 },
  { tower: "Tower Cluster B", coverage: 84, feederCount: 14 },
  { tower: "Tower Cluster C", coverage: 76, feederCount: 11 },
  { tower: "Tower Cluster D", coverage: 88, feederCount: 16 },
  { tower: "Aarey Edge", coverage: 65, feederCount: 9 },
];

export const financialBreakdown = [
  { category: "Food", amount: 45200 },
  { category: "Medical", amount: 78300 },
  { category: "Vet fees", amount: 31500 },
  { category: "Admin", amount: 12800 },
];

export function getUserById(id: string) {
  return users.find((u) => u.id === id) || null;
}

export function getHealthRecordsByAnimalId(animalId: string) {
  return healthRecords
    .filter((h) => h.animalId === animalId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getFeederLogsByAnimalId(animalId: string, limit?: number) {
  const logs = feederLogs
    .filter((l) => l.animalId === animalId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map((log) => ({
      ...log,
      user: getUserById(log.userId),
    }));
  return limit ? logs.slice(0, limit) : logs;
}

export function getMissionsByAnimalId(animalId: string) {
  return missions.filter((m) => m.animalId === animalId);
}

export function getDonationsByAnimalId(animalId: string) {
  return donations.filter((d) => d.animalId === animalId);
}

export function getMissionUpdatesByMissionId(missionId: string) {
  return missionUpdates.filter((u) => u.missionId === missionId);
}

export function getAnimalById(id: string) {
  const animal = animals.find((a) => a.id === id);
  if (!animal) return null;
  return {
    ...animal,
    healthRecords: getHealthRecordsByAnimalId(id),
    feederLogs: getFeederLogsByAnimalId(id),
    missions: getMissionsByAnimalId(id),
    donations: getDonationsByAnimalId(id),
  };
}

export function getAnimals(filters?: {
  type?: string;
  zone?: string;
  status?: string;
  adoptable?: boolean;
}) {
  let result = [...animals];
  if (filters?.type) result = result.filter((a) => a.type === filters.type);
  if (filters?.zone) result = result.filter((a) => a.zone === filters.zone);
  if (filters?.status) result = result.filter((a) => a.status === filters.status);
  if (filters?.adoptable !== undefined)
    result = result.filter((a) => a.adoptable === filters.adoptable);

  return result
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .map((animal) => ({
      ...animal,
      healthRecords: getHealthRecordsByAnimalId(animal.id),
      feederLogs: getFeederLogsByAnimalId(animal.id, 5),
    }));
}

export function getMissionById(id: string) {
  const mission = missions.find((m) => m.id === id);
  if (!mission) return null;
  return {
    ...mission,
    animal: animals.find((a) => a.id === mission.animalId) || null,
    updates: getMissionUpdatesByMissionId(id),
  };
}

export function getMissions() {
  return missions
    .filter((m) => m.status === MissionStatus.ACTIVE)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .map((mission) => ({
      ...mission,
      animal: animals.find((a) => a.id === mission.animalId) || null,
      updates: getMissionUpdatesByMissionId(mission.id),
    }));
}

export function getFeederLogs(filters?: { animalId?: string; userId?: string }) {
  let result = feederLogs.map((log) => ({
    ...log,
    user: getUserById(log.userId),
    animal: animals.find((a) => a.id === log.animalId) || null,
  }));
  if (filters?.animalId) result = result.filter((l) => l.animalId === filters.animalId);
  if (filters?.userId) result = result.filter((l) => l.userId === filters.userId);
  return result.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getLeaderboard() {
  return leaderboard;
}

export function getFinancialBreakdown() {
  return financialBreakdown;
}

export function getAdoptableAnimals() {
  return animals
    .filter((a) => a.adoptable)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getQuizMatches(answers: {
  activity?: string;
  experience?: string;
  personality?: string;
}) {
  const adoptable = getAdoptableAnimals();
  const scored = adoptable.map((animal) => {
    let score = 0;
    if (answers.activity === "Couch potato" && animal.type === AnimalType.CAT) {
      score += 3;
    }
    if (answers.experience === "First-time") {
      const tags = animal.tags.map((t) => t.toLowerCase());
      if (tags.includes("calm")) score += 2;
      if (tags.includes("first-time friendly")) score += 3;
    }
    if (answers.personality) {
      const tags = animal.tags.map((t) => t.toLowerCase());
      if (tags.includes(answers.personality.toLowerCase())) score += 3;
    }
    return { animal, score };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored.map((item) => item.animal);
}

export function getUsers() {
  return users;
}

/**
 * Dynamically calculate the zone leaderboard from feeder logs.
 * Groups feeds by tower cluster, counts unique feeders in the last 7 days,
 * and computes coverage as a percentage of the target feeder count
 * (1 feeder per 4 animals, minimum 3).
 */
export function calculateLeaderboard() {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Get recent feeds (last 7 days)
  const recentFeeds = feederLogs.filter((log) => new Date(log.date) >= sevenDaysAgo);

  // Initialize stats for all known zones
  const zoneStats = new Map<string, { userIds: Set<string>; feedCount: number }>();
  const allZones = ["Tower Cluster A", "Tower Cluster B", "Tower Cluster C", "Tower Cluster D", "Aarey Edge"];
  allZones.forEach((z) => zoneStats.set(z, { userIds: new Set(), feedCount: 0 }));

  // Count animals per tower zone
  const animalsPerZone = new Map<string, number>();
  animals.forEach((a) => {
    const towerZone = mapAnimalZoneToTower(a.zone);
    animalsPerZone.set(towerZone, (animalsPerZone.get(towerZone) || 0) + 1);
  });

  // Process recent feeds
  recentFeeds.forEach((feed) => {
    const animal = animals.find((a) => a.id === feed.animalId);
    if (!animal) return;
    const towerZone = mapAnimalZoneToTower(animal.zone);
    const stats = zoneStats.get(towerZone);
    if (stats) {
      stats.userIds.add(feed.userId);
      stats.feedCount++;
    }
  });

  // Build leaderboard entries
  return allZones
    .map((zone) => {
      const stats = zoneStats.get(zone)!;
      const animalCount = animalsPerZone.get(zone) || 0;
      const targetFeeders = Math.max(3, Math.ceil(animalCount / 4));
      const feederCount = stats.userIds.size;
      const coverage = targetFeeders > 0 ? Math.min(100, Math.round((feederCount / targetFeeders) * 100)) : 0;

      return {
        tower: zone,
        coverage,
        feederCount,
        animalCount,
        feedCount: stats.feedCount,
      };
    })
    .sort((a, b) => b.coverage - a.coverage);
}

/**
 * Map an individual animal zone to its parent tower cluster.
 */
function mapAnimalZoneToTower(animalZone: string): string {
  const zone = animalZone.toLowerCase();
  if (zone.includes("tower a")) return "Tower Cluster A";
  if (zone.includes("tower b")) return "Tower Cluster B";
  if (zone.includes("tower c")) return "Tower Cluster C";
  if (zone.includes("tower d")) return "Tower Cluster D";
  if (zone.includes("back gate")) return "Tower Cluster B";
  if (zone.includes("parking")) return "Tower Cluster C";
  if (zone.includes("aarey") || zone.includes("green")) return "Aarey Edge";
  return "Tower Cluster A"; // Default fallback
}
