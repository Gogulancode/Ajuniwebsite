import {
  Animal as PrismaAnimal,
  Mission as PrismaMission,
  User as PrismaUser,
  HealthRecord,
  FeederLog,
  MissionUpdate,
  Donation,
  Adoption,
  Role,
  AnimalType,
  Status,
  RecordStatus,
  MissionStatus,
  DonationType,
  PaymentStatus,
  AdoptionStatus,
} from "@prisma/client";

export type Animal = PrismaAnimal & {
  healthRecords?: HealthRecord[];
  feederLogs?: (FeederLog & { user: PrismaUser })[];
  donations?: Donation[];
  adoptions?: Adoption[];
};

export type Mission = PrismaMission & {
  animal: PrismaAnimal;
  updates?: MissionUpdate[];
  donations?: Donation[];
};

export type User = PrismaUser;

export type {
  Role,
  AnimalType,
  Status,
  RecordStatus,
  MissionStatus,
  DonationType,
  PaymentStatus,
  AdoptionStatus,
  HealthRecord,
  FeederLog,
  MissionUpdate,
  Donation,
  Adoption,
};

export interface QuizAnswer {
  tower: string;
  experience: string;
  activity: string;
  personality: string;
}

export interface Zone {
  name: string;
  lat: number;
  lng: number;
  status: "green" | "amber" | "red";
  animalCount: number;
  feederCount: number;
}
