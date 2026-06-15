import { PrismaClient, Role, AnimalType, Status, RecordStatus, MissionStatus, DonationType, PaymentStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clean existing data
  await prisma.donation.deleteMany();
  await prisma.adoption.deleteMany();
  await prisma.feederLog.deleteMany();
  await prisma.healthRecord.deleteMany();
  await prisma.missionUpdate.deleteMany();
  await prisma.mission.deleteMany();
  await prisma.animal.deleteMany();
  await prisma.user.deleteMany();

  const admin = await prisma.user.create({
    data: {
      email: "admin@ajunifoundation.in",
      name: "Trust Admin",
      role: Role.ADMIN,
      image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop",
    },
  });

  const resident = await prisma.user.create({
    data: {
      email: "demo@resident.com",
      name: "Demo Resident",
      role: Role.RESIDENT,
      tower: "Tower A",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop",
    },
  });

  const feeder1 = await prisma.user.create({
    data: {
      email: "feeder@ajunifoundation.in",
      name: "Priya Sharma",
      role: Role.FEEDER,
      tower: "Tower B",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&auto=format&fit=crop",
    },
  });

  const feeder2 = await prisma.user.create({
    data: {
      email: "rahul@ajunifoundation.in",
      name: "Rahul Mehta",
      role: Role.FEEDER,
      tower: "Tower C",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop",
    },
  });

  const animals = await prisma.animal.createMany({
    data: [
      {
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
      },
      {
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
      },
      {
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
      },
      {
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
      },
      {
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
      },
      {
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
      },
    ],
  });

  const createdAnimals = await prisma.animal.findMany();

  const bhaiya = createdAnimals.find((a) => a.name === "Bhaiya")!;
  const rani = createdAnimals.find((a) => a.name === "Rani")!;
  const chottu = createdAnimals.find((a) => a.name === "Chottu")!;
  const raja = createdAnimals.find((a) => a.name === "Raja")!;
  const billi = createdAnimals.find((a) => a.name === "Billi")!;
  const hope = createdAnimals.find((a) => a.name === "Hope")!;

  await prisma.healthRecord.createMany({
    data: [
      { animalId: bhaiya.id, date: new Date("2024-01-15"), event: "Anti-rabies vaccination", status: RecordStatus.GOOD, funded: true },
      { animalId: bhaiya.id, date: new Date("2024-03-10"), event: "Neutering surgery", status: RecordStatus.RESOLVED, funded: true, cost: 1200, raised: 1200 },
      { animalId: rani.id, date: new Date("2024-02-20"), event: "Initial health checkup", status: RecordStatus.GOOD, funded: true },
      { animalId: rani.id, date: new Date("2024-04-05"), event: "Deworming completed", status: RecordStatus.RESOLVED, funded: true },
      { animalId: chottu.id, date: new Date("2024-05-12"), event: "Leg injury first aid", status: RecordStatus.ACTIVE, funded: true, cost: 400, raised: 400 },
      { animalId: chottu.id, date: new Date("2024-05-20"), event: "Surgery scheduled", status: RecordStatus.URGENT, funded: false, cost: 1800, raised: 600 },
      { animalId: raja.id, date: new Date("2024-01-28"), event: "Vaccination drive", status: RecordStatus.GOOD, funded: true },
      { animalId: raja.id, date: new Date("2024-02-14"), event: "Neutering", status: RecordStatus.RESOLVED, funded: true, cost: 1200, raised: 1200 },
      { animalId: billi.id, date: new Date("2024-03-22"), event: "Health screening", status: RecordStatus.GOOD, funded: true },
      { animalId: hope.id, date: new Date("2024-05-01"), event: "Skin condition observation", status: RecordStatus.ACTIVE, funded: false, cost: 800, raised: 200 },
    ],
  });

  await prisma.feederLog.createMany({
    data: [
      { userId: feeder1.id, animalId: bhaiya.id, photoUrl: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&auto=format&fit=crop", notes: "Fed rice and chicken. Bhaiya was calm and friendly.", latitude: 19.1535, longitude: 72.8775 },
      { userId: feeder2.id, animalId: rani.id, photoUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&auto=format&fit=crop", notes: "Rani ate well and enjoyed some petting.", latitude: 19.1528, longitude: 72.8768 },
      { userId: feeder1.id, animalId: chottu.id, photoUrl: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=400&auto=format&fit=crop", notes: "Gave medicine. Wound looks better today.", latitude: 19.1529, longitude: 72.877 },
      { userId: feeder2.id, animalId: raja.id, photoUrl: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&auto=format&fit=crop", notes: "Raja walked with me to the tower entrance.", latitude: 19.1538, longitude: 72.878 },
    ],
  });

  await prisma.mission.createMany({
    data: [
      {
        animalId: chottu.id,
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
      },
      {
        animalId: bhaiya.id,
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
      },
    ],
  });

  const missions = await prisma.mission.findMany();
  const chottuMission = missions.find((m) => m.title.includes("Chottu"))!;
  const bhaiyaMission = missions.find((m) => m.title.includes("Bhaiya"))!;

  await prisma.missionUpdate.createMany({
    data: [
      { missionId: chottuMission.id, time: "2 days ago", text: "Vet confirmed surgery is needed within the week." },
      { missionId: chottuMission.id, time: "5 days ago", text: "Initial X-rays completed. fracture is clean and operable." },
      { missionId: bhaiyaMission.id, time: "1 day ago", text: "Paw dressing changed; infection is responding to antibiotics." },
      { missionId: bhaiyaMission.id, time: "4 days ago", text: "Vet visit done; treatment plan finalized." },
    ],
  });

  await prisma.donation.createMany({
    data: [
      { userId: resident.id, missionId: chottuMission.id, amount: 250, type: DonationType.MISSION, status: PaymentStatus.SUCCESS },
      { userId: resident.id, missionId: bhaiyaMission.id, amount: 500, type: DonationType.MISSION, status: PaymentStatus.SUCCESS },
      { animalId: rani.id, amount: 600, type: DonationType.MONTHLY, status: PaymentStatus.SUCCESS },
    ],
  });

  console.log("Seed completed successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
