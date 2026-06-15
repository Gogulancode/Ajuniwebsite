"use client";

import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  XCircle,
  Download,
  Users,
  PawPrint,
  HeartHandshake,
  Target,
  Loader2,
  AlertCircle,
  X,
  FileText,
} from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { ScrollReveal } from "@/components/ScrollReveal";
import { cn, formatCurrency } from "@/lib/utils";
import { Animal, Mission, Status } from "@/types";

export const dynamic = "force-dynamic";

type EditableAnimal = Animal & { editing?: boolean };

const statusOptions: Status[] = [
  "HEALTHY",
  "ADOPTABLE",
  "URGENT",
  "WATCHING",
  "RECOVERING",
];

const mockPendingFeeders = [
  { id: "f1", name: "Aisha Khan", tower: "Tower B", email: "aisha@example.com" },
  { id: "f2", name: "Rohan Mehta", tower: "Tower D", email: "rohan@example.com" },
  { id: "f3", name: "Priya Nair", tower: "Tower A", email: "priya@example.com" },
];

const financialData = [
  { category: "Food", amount: 45200 },
  { category: "Medical", amount: 78300 },
  { category: "Vet fees", amount: 31500 },
  { category: "Admin", amount: 12800 },
];

export default function AdminDashboardPage() {
  const { data: session, status } = useSession();

  const [animals, setAnimals] = useState<EditableAnimal[]>([]);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  function getErrorMessage(err: unknown) {
    return err instanceof Error ? err.message : "Something went wrong";
  }

  const [newAnimal, setNewAnimal] = useState({
    name: "",
    nickname: "",
    type: "DOG",
    zone: "",
    status: "HEALTHY" as Status,
    gender: "",
    ageApprox: "",
    description: "",
    image: "",
    tags: "",
    adoptable: false,
  });

  const [newMission, setNewMission] = useState({
    animalId: "",
    title: "",
    description: "",
    image: "",
    target: "",
    daysLeft: "",
  });

  const [missionUpdate, setMissionUpdate] = useState<{
    missionId: string;
    text: string;
    time: string;
    photoUrl: string;
  }>({ missionId: "", text: "", time: "", photoUrl: "" });

  const [pendingFeeders, setPendingFeeders] = useState(mockPendingFeeders);

  useEffect(() => {
    async function fetchData() {
      try {
        const [animalsRes, missionsRes] = await Promise.all([
          fetch("/api/animals"),
          fetch("/api/missions"),
        ]);
        if (animalsRes.ok) setAnimals(await animalsRes.json());
        if (missionsRes.ok) setMissions(await missionsRes.json());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  async function handleCreateAnimal(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/animals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newAnimal,
          tags: newAnimal.tags.split(",").map((t) => t.trim()).filter(Boolean),
          target: undefined,
        }),
      });
      if (!res.ok) throw new Error("Failed to create animal");
      const created = await res.json();
      setAnimals((prev) => [created, ...prev]);
      setModalOpen(false);
      setNewAnimal({
        name: "",
        nickname: "",
        type: "DOG",
        zone: "",
        status: "HEALTHY",
        gender: "",
        ageApprox: "",
        description: "",
        image: "",
        tags: "",
        adoptable: false,
      });
      setMessage({ type: "success", text: "Animal added successfully." });
    } catch (err) {
      setMessage({ type: "error", text: getErrorMessage(err) });
    }
  }

  async function updateAnimal(id: string, updates: Partial<Animal>) {
    try {
      const res = await fetch(`/api/animals/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Failed to update animal");
      const updated = await res.json();
      setAnimals((prev) =>
        prev.map((a) => (a.id === id ? { ...updated, editing: false } : a))
      );
      setMessage({ type: "success", text: "Animal updated." });
    } catch (err) {
      setMessage({ type: "error", text: getErrorMessage(err) });
    }
  }

  async function deleteAnimal(id: string) {
    if (!confirm("Are you sure you want to delete this animal?")) return;
    try {
      const res = await fetch(`/api/animals/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete animal");
      setAnimals((prev) => prev.filter((a) => a.id !== id));
      setMessage({ type: "success", text: "Animal deleted." });
    } catch (err) {
      setMessage({ type: "error", text: getErrorMessage(err) });
    }
  }

  async function handleCreateMission(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/missions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newMission,
          target: Number(newMission.target),
          daysLeft: Number(newMission.daysLeft),
        }),
      });
      if (!res.ok) throw new Error("Failed to create mission");
      const created = await res.json();
      setMissions((prev) => [created, ...prev]);
      setNewMission({
        animalId: "",
        title: "",
        description: "",
        image: "",
        target: "",
        daysLeft: "",
      });
      setMessage({ type: "success", text: "Mission created." });
    } catch (err) {
      setMessage({ type: "error", text: getErrorMessage(err) });
    }
  }

  async function handleAddMissionUpdate(missionId: string) {
    const update = missionUpdate;
    if (!update.text || update.missionId !== missionId) return;
    try {
      const res = await fetch(`/api/missions/${missionId}/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: update.text,
          time: update.time || new Date().toLocaleString("en-IN"),
          photoUrl: update.photoUrl,
        }),
      });
      if (!res.ok) throw new Error("Failed to add update");
      setMissionUpdate({ missionId: "", text: "", time: "", photoUrl: "" });
      setMessage({ type: "success", text: "Mission update posted." });
    } catch (err) {
      setMessage({ type: "error", text: getErrorMessage(err) });
    }
  }

  function exportCSV() {
    const total = financialData.reduce((sum, row) => sum + row.amount, 0);
    const rows = [
      ["Category", "Amount (₹)"],
      ...financialData.map((row) => [row.category, row.amount.toString()]),
      ["Total", total.toString()],
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ajuni-financial-report-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <GlassCard className="max-w-md w-full p-8 text-center">
          <AlertCircle className="w-12 h-12 text-amber-600 mx-auto mb-4" />
          <h2 className="font-heading text-xl font-bold text-[#1a1a1a] mb-2">
            Admin access required
          </h2>
          <p className="text-muted-foreground mb-6">
            Please sign in with an admin account to view this dashboard.
          </p>
          <button
            onClick={() => signIn()}
            className="btn-gradient px-6 py-2.5 rounded-xl font-semibold"
          >
            Sign in
          </button>
        </GlassCard>
      </div>
    );
  }

  const role = (session?.user as { role?: string })?.role;
  if (role !== "ADMIN" && role !== "TRUST") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <GlassCard className="max-w-md w-full p-8 text-center">
          <AlertCircle className="w-12 h-12 text-rose-600 mx-auto mb-4" />
          <h2 className="font-heading text-xl font-bold text-[#1a1a1a] mb-2">
            Unauthorized
          </h2>
          <p className="text-muted-foreground">
            You do not have permission to access the trust admin dashboard.
          </p>
        </GlassCard>
      </div>
    );
  }

  const totalDonations = financialData.reduce((sum, row) => sum + row.amount, 0);

  return (
    <div className="min-h-screen bg-background pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        <ScrollReveal>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-heading text-3xl sm:text-4xl font-bold text-[#1a1a1a]">
                Trust Admin
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage animals, missions, feeders, and finances.
              </p>
            </div>
            <div className="text-sm text-muted-foreground">
              Signed in as <span className="text-[#1a1a1a]">{session?.user?.email}</span>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <GlassCard className="p-5" hover={false}>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <PawPrint className="w-5 h-5" />
                </div>
                <span className="text-muted-foreground text-sm">Animals</span>
              </div>
              <p className="text-2xl font-bold text-[#1a1a1a]">{animals.length}</p>
            </GlassCard>
            <GlassCard className="p-5" hover={false}>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <span className="text-muted-foreground text-sm">Donations</span>
              </div>
              <p className="text-2xl font-bold text-[#1a1a1a]">{formatCurrency(totalDonations)}</p>
            </GlassCard>
            <GlassCard className="p-5" hover={false}>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600">
                  <Users className="w-5 h-5" />
                </div>
                <span className="text-muted-foreground text-sm">Pending Adoptions</span>
              </div>
              <p className="text-2xl font-bold text-[#1a1a1a]">7</p>
            </GlassCard>
            <GlassCard className="p-5" hover={false}>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-secondary/10 text-primary">
                  <Target className="w-5 h-5" />
                </div>
                <span className="text-muted-foreground text-sm">Active Missions</span>
              </div>
              <p className="text-2xl font-bold text-[#1a1a1a]">{missions.length}</p>
            </GlassCard>
          </div>
        </ScrollReveal>

        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "p-3 rounded-lg text-sm flex items-center gap-2",
              message.type === "success"
                ? "bg-emerald-500/15 text-emerald-600"
                : "bg-rose-500/15 text-rose-600"
            )}
          >
            {message.type === "success" ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            {message.text}
          </motion.div>
        )}

        <ScrollReveal>
          <GlassCard className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h2 className="font-heading text-xl font-bold text-[#1a1a1a] flex items-center gap-2">
                <PawPrint className="w-5 h-5 text-primary" />
                Animal Management
              </h2>
              <button
                onClick={() => setModalOpen(true)}
                className="btn-gradient px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add animal
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-black/[0.08] text-xs text-muted-foreground uppercase tracking-wider">
                    <th className="pb-3 font-medium">Animal</th>
                    <th className="pb-3 font-medium">Zone</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Tags</th>
                    <th className="pb-3 font-medium">Adoptable</th>
                    <th className="pb-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {animals.map((animal) => (
                    <tr key={animal.id} className="border-b border-black/[0.05] last:border-0">
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0">
                            <Image
                              src={animal.image}
                              alt={animal.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium text-[#1a1a1a]">{animal.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {animal.nickname || animal.type}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 text-[#1a1a1a]/80">{animal.zone}</td>
                      <td className="py-3">
                        {animal.editing ? (
                          <select
                            value={animal.status}
                            onChange={(e) =>
                              setAnimals((prev) =>
                                prev.map((a) =>
                                  a.id === animal.id
                                    ? { ...a, status: e.target.value as Status }
                                    : a
                                )
                              )
                            }
                            className="bg-black/[0.03] border border-black/[0.08] rounded-lg px-2 py-1 text-[#1a1a1a] text-xs"
                          >
                            {statusOptions.map((s) => (
                              <option key={s} value={s} className="bg-card">
                                {s}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span
                            className={cn(
                              "px-2 py-1 rounded-full text-[10px] font-semibold border",
                              animal.status === "URGENT"
                                ? "bg-rose-500/15 text-rose-600 border-rose-500/30"
                                : animal.status === "ADOPTABLE"
                                ? "bg-secondary/15 text-primary border-secondary/30"
                                : "bg-black/[0.05] text-[#1a1a1a] border-black/[0.08]"
                            )}
                          >
                            {animal.status}
                          </span>
                        )}
                      </td>
                      <td className="py-3">
                        {animal.editing ? (
                          <input
                            value={(animal.tags || []).join(", ")}
                            onChange={(e) =>
                              setAnimals((prev) =>
                                prev.map((a) =>
                                  a.id === animal.id
                                    ? {
                                        ...a,
                                        tags: e.target.value
                                          .split(",")
                                          .map((t) => t.trim())
                                          .filter(Boolean),
                                      }
                                    : a
                                )
                              )
                            }
                            className="bg-black/[0.03] border border-black/[0.08] rounded-lg px-2 py-1 text-[#1a1a1a] text-xs w-32"
                          />
                        ) : (
                          <span className="text-muted-foreground">
                            {(animal.tags || []).join(", ") || "—"}
                          </span>
                        )}
                      </td>
                      <td className="py-3">
                        {animal.editing ? (
                          <input
                            type="checkbox"
                            checked={animal.adoptable}
                            onChange={(e) =>
                              setAnimals((prev) =>
                                prev.map((a) =>
                                  a.id === animal.id
                                    ? { ...a, adoptable: e.target.checked }
                                    : a
                                )
                              )
                            }
                            className="rounded border-black/[0.12] bg-black/[0.03] text-primary"
                          />
                        ) : (
                          <span
                            className={cn(
                              "text-xs",
                              animal.adoptable ? "text-emerald-600" : "text-muted-foreground"
                            )}
                          >
                            {animal.adoptable ? "Yes" : "No"}
                          </span>
                        )}
                      </td>
                      <td className="py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {animal.editing ? (
                            <>
                              <button
                                onClick={() =>
                                  updateAnimal(animal.id, {
                                    status: animal.status,
                                    tags: animal.tags,
                                    adoptable: animal.adoptable,
                                  })
                                }
                                className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/25"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() =>
                                  setAnimals((prev) =>
                                    prev.map((a) =>
                                      a.id === animal.id ? { ...a, editing: false } : a
                                    )
                                  )
                                }
                                className="p-1.5 rounded-lg bg-black/[0.03] text-muted-foreground hover:bg-black/[0.05]"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() =>
                                setAnimals((prev) =>
                                  prev.map((a) =>
                                    a.id === animal.id ? { ...a, editing: true } : a
                                  )
                                )
                              }
                              className="p-1.5 rounded-lg bg-black/[0.03] text-muted-foreground hover:bg-black/[0.05]"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteAnimal(animal.id)}
                            className="p-1.5 rounded-lg bg-rose-500/15 text-rose-600 hover:bg-rose-500/25"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </ScrollReveal>

        <div className="grid lg:grid-cols-2 gap-6">
          <ScrollReveal>
            <GlassCard className="p-6">
              <h2 className="font-heading text-xl font-bold text-[#1a1a1a] mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Mission Management
              </h2>

              <div className="space-y-4 mb-6">
                {missions.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No active missions.</p>
                ) : (
                  missions.map((mission) => (
                    <div
                      key={mission.id}
                      className="p-4 rounded-xl bg-black/[0.03] border border-black/[0.08]"
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <p className="font-medium text-[#1a1a1a]">{mission.title}</p>
                          <p className="text-xs text-muted-foreground">
                            For {mission.animal?.name || "—"} · Target{" "}
                            {formatCurrency(mission.target)}
                          </p>
                        </div>
                        <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-semibold border border-primary/20">
                          {mission.status}
                        </span>
                      </div>

                      {missionUpdate.missionId === mission.id ? (
                        <div className="mt-3 space-y-2">
                          <input
                            value={missionUpdate.text}
                            onChange={(e) =>
                              setMissionUpdate({
                                ...missionUpdate,
                                text: e.target.value,
                                missionId: mission.id,
                              })
                            }
                            placeholder="Update message"
                            className="w-full bg-black/[0.03] border border-black/[0.08] rounded-lg px-3 py-2 text-sm text-[#1a1a1a] placeholder:text-muted-foreground/60"
                          />
                          <div className="flex gap-2">
                            <input
                              value={missionUpdate.time}
                              onChange={(e) =>
                                setMissionUpdate({
                                  ...missionUpdate,
                                  time: e.target.value,
                                  missionId: mission.id,
                                })
                              }
                              placeholder="Time"
                              className="flex-1 bg-black/[0.03] border border-black/[0.08] rounded-lg px-3 py-2 text-sm text-[#1a1a1a] placeholder:text-muted-foreground/60"
                            />
                            <button
                              onClick={() => handleAddMissionUpdate(mission.id)}
                              className="px-3 py-2 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20"
                            >
                              Post
                            </button>
                            <button
                              onClick={() =>
                                setMissionUpdate({
                                  missionId: "",
                                  text: "",
                                  time: "",
                                  photoUrl: "",
                                })
                              }
                              className="px-3 py-2 rounded-lg bg-black/[0.03] text-muted-foreground text-xs hover:bg-black/[0.05]"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() =>
                            setMissionUpdate({
                              missionId: mission.id,
                              text: "",
                              time: new Date().toLocaleString("en-IN"),
                              photoUrl: "",
                            })
                          }
                          className="mt-2 text-xs text-primary hover:text-primary transition-colors flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" /> Add update
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>

              <form onSubmit={handleCreateMission} className="space-y-3 pt-4 border-t border-black/[0.08]">
                <p className="text-sm font-medium text-[#1a1a1a]">Create mission</p>
                <select
                  value={newMission.animalId}
                  onChange={(e) =>
                    setNewMission({ ...newMission, animalId: e.target.value })
                  }
                  className="w-full bg-black/[0.03] border border-black/[0.08] rounded-xl px-3 py-2 text-sm text-[#1a1a1a]"
                >
                  <option value="" className="bg-card">
                    Select animal
                  </option>
                  {animals.map((a) => (
                    <option key={a.id} value={a.id} className="bg-card">
                      {a.name}
                    </option>
                  ))}
                </select>
                <input
                  value={newMission.title}
                  onChange={(e) =>
                    setNewMission({ ...newMission, title: e.target.value })
                  }
                  placeholder="Mission title"
                  className="w-full bg-black/[0.03] border border-black/[0.08] rounded-xl px-3 py-2 text-sm text-[#1a1a1a] placeholder:text-muted-foreground/60"
                />
                <textarea
                  value={newMission.description}
                  onChange={(e) =>
                    setNewMission({ ...newMission, description: e.target.value })
                  }
                  placeholder="Description"
                  rows={2}
                  className="w-full bg-black/[0.03] border border-black/[0.08] rounded-xl px-3 py-2 text-sm text-[#1a1a1a] placeholder:text-muted-foreground/60 resize-none"
                />
                <div className="flex gap-3">
                  <input
                    type="number"
                    value={newMission.target}
                    onChange={(e) =>
                      setNewMission({ ...newMission, target: e.target.value })
                    }
                    placeholder="Target ₹"
                    className="flex-1 bg-black/[0.03] border border-black/[0.08] rounded-xl px-3 py-2 text-sm text-[#1a1a1a] placeholder:text-muted-foreground/60"
                  />
                  <input
                    type="number"
                    value={newMission.daysLeft}
                    onChange={(e) =>
                      setNewMission({ ...newMission, daysLeft: e.target.value })
                    }
                    placeholder="Days left"
                    className="flex-1 bg-black/[0.03] border border-black/[0.08] rounded-xl px-3 py-2 text-sm text-[#1a1a1a] placeholder:text-muted-foreground/60"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full btn-gradient py-2 rounded-xl text-sm font-semibold"
                >
                  Create mission
                </button>
              </form>
            </GlassCard>
          </ScrollReveal>

          <div className="space-y-6">
            <ScrollReveal delay={0.1}>
              <GlassCard className="p-6">
                <h2 className="font-heading text-xl font-bold text-[#1a1a1a] mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Feeder Verification
                </h2>
                <div className="space-y-3">
                  {pendingFeeders.map((feeder) => (
                    <div
                      key={feeder.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-black/[0.03] border border-black/[0.08]"
                    >
                      <div>
                        <p className="font-medium text-[#1a1a1a]">{feeder.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {feeder.email} · {feeder.tower}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            setPendingFeeders((prev) =>
                              prev.filter((f) => f.id !== feeder.id)
                            )
                          }
                          className="p-2 rounded-lg bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/25"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            setPendingFeeders((prev) =>
                              prev.filter((f) => f.id !== feeder.id)
                            )
                          }
                          className="p-2 rounded-lg bg-rose-500/15 text-rose-600 hover:bg-rose-500/25"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-heading text-xl font-bold text-[#1a1a1a] flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Financial Report
                  </h2>
                  <button
                    onClick={exportCSV}
                    className="px-3 py-2 rounded-lg bg-black/[0.03] text-[#1a1a1a]/80 hover:text-primary hover:bg-black/[0.05] text-sm font-medium flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" /> Export CSV
                  </button>
                </div>
                <div className="space-y-3">
                  {financialData.map((row) => (
                    <div
                      key={row.category}
                      className="flex items-center justify-between p-3 rounded-xl bg-black/[0.03] border border-black/[0.08]"
                    >
                      <span className="text-sm text-[#1a1a1a]/80">{row.category}</span>
                      <span className="font-medium text-[#1a1a1a]">
                        {formatCurrency(row.amount)}
                      </span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-primary/10 border border-primary/20">
                    <span className="text-sm font-medium text-[#1a1a1a]">Total</span>
                    <span className="font-bold text-[#1a1a1a]">
                      {formatCurrency(totalDonations)}
                    </span>
                  </div>
                </div>
              </GlassCard>
            </ScrollReveal>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {modalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 glass p-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-heading text-xl font-bold text-[#1a1a1a]">
                  Add New Animal
                </h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-black/[0.03]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateAnimal} className="space-y-4">
                <input
                  required
                  value={newAnimal.name}
                  onChange={(e) =>
                    setNewAnimal({ ...newAnimal, name: e.target.value })
                  }
                  placeholder="Name"
                  className="w-full bg-black/[0.03] border border-black/[0.08] rounded-xl px-4 py-3 text-[#1a1a1a] placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/50"
                />
                <input
                  value={newAnimal.nickname}
                  onChange={(e) =>
                    setNewAnimal({ ...newAnimal, nickname: e.target.value })
                  }
                  placeholder="Nickname"
                  className="w-full bg-black/[0.03] border border-black/[0.08] rounded-xl px-4 py-3 text-[#1a1a1a] placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/50"
                />
                <div className="grid grid-cols-2 gap-4">
                  <select
                    value={newAnimal.type}
                    onChange={(e) =>
                      setNewAnimal({ ...newAnimal, type: e.target.value })
                    }
                    className="w-full bg-black/[0.03] border border-black/[0.08] rounded-xl px-4 py-3 text-[#1a1a1a]"
                  >
                    <option value="DOG" className="bg-card">Dog</option>
                    <option value="CAT" className="bg-card">Cat</option>
                  </select>
                  <select
                    value={newAnimal.status}
                    onChange={(e) =>
                      setNewAnimal({
                        ...newAnimal,
                        status: e.target.value as Status,
                      })
                    }
                    className="w-full bg-black/[0.03] border border-black/[0.08] rounded-xl px-4 py-3 text-[#1a1a1a]"
                  >
                    {statusOptions.map((s) => (
                      <option key={s} value={s} className="bg-card">
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <input
                  value={newAnimal.zone}
                  onChange={(e) =>
                    setNewAnimal({ ...newAnimal, zone: e.target.value })
                  }
                  placeholder="Zone"
                  className="w-full bg-black/[0.03] border border-black/[0.08] rounded-xl px-4 py-3 text-[#1a1a1a] placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/50"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    value={newAnimal.gender}
                    onChange={(e) =>
                      setNewAnimal({ ...newAnimal, gender: e.target.value })
                    }
                    placeholder="Gender"
                    className="w-full bg-black/[0.03] border border-black/[0.08] rounded-xl px-4 py-3 text-[#1a1a1a] placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/50"
                  />
                  <input
                    value={newAnimal.ageApprox}
                    onChange={(e) =>
                      setNewAnimal({ ...newAnimal, ageApprox: e.target.value })
                    }
                    placeholder="Age approx"
                    className="w-full bg-black/[0.03] border border-black/[0.08] rounded-xl px-4 py-3 text-[#1a1a1a] placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/50"
                  />
                </div>
                <input
                  required
                  value={newAnimal.image}
                  onChange={(e) =>
                    setNewAnimal({ ...newAnimal, image: e.target.value })
                  }
                  placeholder="Image URL"
                  className="w-full bg-black/[0.03] border border-black/[0.08] rounded-xl px-4 py-3 text-[#1a1a1a] placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/50"
                />
                <input
                  value={newAnimal.tags}
                  onChange={(e) =>
                    setNewAnimal({ ...newAnimal, tags: e.target.value })
                  }
                  placeholder="Tags (comma separated)"
                  className="w-full bg-black/[0.03] border border-black/[0.08] rounded-xl px-4 py-3 text-[#1a1a1a] placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/50"
                />
                <textarea
                  value={newAnimal.description}
                  onChange={(e) =>
                    setNewAnimal({ ...newAnimal, description: e.target.value })
                  }
                  placeholder="Description"
                  rows={3}
                  className="w-full bg-black/[0.03] border border-black/[0.08] rounded-xl px-4 py-3 text-[#1a1a1a] placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/50 resize-none"
                />
                <label className="flex items-center gap-2 text-sm text-[#1a1a1a]/80">
                  <input
                    type="checkbox"
                    checked={newAnimal.adoptable}
                    onChange={(e) =>
                      setNewAnimal({ ...newAnimal, adoptable: e.target.checked })
                    }
                    className="rounded border-black/[0.12] bg-black/[0.03] text-primary"
                  />
                  Adoptable
                </label>
                <button
                  type="submit"
                  className="w-full btn-gradient py-3 rounded-xl font-semibold"
                >
                  Add Animal
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
