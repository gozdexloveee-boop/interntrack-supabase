import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  BarChart3,
  Bell,
  Briefcase,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Edit3,
  Filter,
  LayoutDashboard,
  Loader2,
  LogOut,
  Moon,
  Plus,
  Search,
  ShieldCheck,
  Sun,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  BrowserRouter,
  Navigate,
  NavLink,
  Route,
  Routes,
} from "react-router-dom";
import { supabase } from "./lib/supabaseClient";

const STATUSES = [
  "Applied",
  "Shortlisted",
  "Interview Scheduled",
  "Rejected",
  "Offer Received",
];

const PRIORITIES = ["High", "Medium", "Low"];

const STATUS_COLORS = {
  Applied: "#2563eb",
  Shortlisted: "#6d28d9",
  "Interview Scheduled": "#d97706",
  Rejected: "#dc2626",
  "Offer Received": "#059669",
};

const EMPTY_FORM = {
  company: "",
  role: "",
  application_link: "",
  status: "Applied",
  priority: "Medium",
  applied_date: new Date().toISOString().slice(0, 10),
  deadline: "",
  follow_up_date: "",
  location: "",
  notes: "",
};

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function formatDate(value) {
  if (!value) return "Not added";

  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getInitials(name) {
  if (!name) return "NA";

  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function statusBadgeClass(status) {
  const classes = {
    Applied:
      "bg-blue-50 text-blue-700 ring-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:ring-blue-500/20",
    Shortlisted:
      "bg-violet-50 text-violet-700 ring-violet-200 dark:bg-violet-500/10 dark:text-violet-300 dark:ring-violet-500/20",
    "Interview Scheduled":
      "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/20",
    Rejected:
      "bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-500/20",
    "Offer Received":
      "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/20",
  };

  return classes[status] || classes.Applied;
}

function priorityBadgeClass(priority) {
  const classes = {
    High: "bg-slate-950 text-white dark:bg-white dark:text-slate-950",
    Medium:
      "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
    Low: "bg-white text-slate-500 ring-1 ring-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:ring-slate-700",
  };

  return classes[priority] || classes.Medium;
}

function deadlineClass(value) {
  if (!value) return "text-slate-500 dark:text-slate-400";

  const today = new Date();
  const target = new Date(value);

  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);

  const daysLeft = Math.ceil((target - today) / (1000 * 60 * 60 * 24));

  if (daysLeft < 0) return "text-rose-600 dark:text-rose-300";
  if (daysLeft <= 3) return "text-amber-600 dark:text-amber-300";
  return "text-emerald-600 dark:text-emerald-300";
}

function AuthScreen() {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const authResponse = isSignup
        ? await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: window.location.origin,
            },
          })
        : await supabase.auth.signInWithPassword({
            email,
            password,
          });

      if (authResponse.error) {
        throw authResponse.error;
      }

      setMessage(
        isSignup
          ? "Signup successful. Open your email, confirm your account, then come back and login."
          : "Login successful. Opening dashboard..."
      );
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] px-5 py-8 text-slate-950">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[1.75rem] border border-slate-200 bg-white p-8 shadow-sm"
        >
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600">
            <ShieldCheck size={14} />
            Secure internship workspace
          </div>

          <h1 className="max-w-3xl text-5xl font-semibold tracking-[-0.04em] text-slate-950 md:text-6xl">
            InternTrack
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            A focused dashboard for students to manage internship applications,
            deadlines, interviews, offers, and follow-ups with private user data.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              {
                title: "Authentication",
                desc: "Secure signup and login powered by Supabase Auth.",
              },
              {
                title: "Private records",
                desc: "Each user manages only their own applications.",
              },
              {
                title: "Live insights",
                desc: "Analytics update from real application records.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:bg-white hover:shadow-sm"
              >
                <CheckCircle2 className="mb-3 text-blue-600" size={19} />

                <h3 className="text-sm font-semibold text-slate-950">
                  {item.title}
                </h3>

                <p className="mt-2 text-xs font-medium leading-5 text-slate-500">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="w-full rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm"
        >
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Welcome
          </p>

          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
            {isSignup ? "Create account" : "Login to dashboard"}
          </h2>

          <p className="mt-2 text-sm font-medium leading-6 text-slate-500">
            {isSignup
              ? "Use an email you can access. Email confirmation may be enabled."
              : "Login using your confirmed account credentials."}
          </p>

          <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
            <label className="grid gap-2 text-sm font-semibold text-slate-800">
              Email
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-950 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                placeholder="student@example.com"
              />
            </label>

            <label className="grid gap-2 text-sm font-semibold text-slate-800">
              Password
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-950 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                placeholder="At least 6 characters"
              />
            </label>

            <button
              disabled={loading}
              className="mt-2 flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading && <Loader2 className="animate-spin" size={17} />}
              {isSignup ? "Sign up" : "Login"}
            </button>
          </form>

          {message && (
            <p className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 p-3 text-sm font-semibold leading-6 text-blue-700">
              {message}
            </p>
          )}

          <button
            onClick={() => {
              setIsSignup(!isSignup);
              setMessage("");
            }}
            className="mt-5 text-sm font-semibold text-blue-700 hover:text-blue-900"
          >
            {isSignup
              ? "Already have an account? Login"
              : "New here? Create an account"}
          </button>
        </motion.section>
      </div>
    </main>
  );
}

function Header({ user, darkMode, setDarkMode, onOpenForm, onSignOut }) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur-2xl dark:border-slate-800 dark:bg-slate-950/90 lg:px-8">
      <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-950 text-white shadow-sm dark:bg-white dark:text-slate-950">
            <LayoutDashboard size={20} />
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              InternTrack
            </p>
            <h1 className="text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
              Internship Dashboard
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            aria-label="Notifications"
            className="relative rounded-2xl border border-slate-200 bg-white p-2.5 text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          >
            <Bell size={18} />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-blue-600 ring-2 ring-white dark:ring-slate-900" />
          </button>

          <button
            aria-label="Toggle dark mode"
            onClick={() => setDarkMode(!darkMode)}
            className="rounded-2xl border border-slate-200 bg-white p-2.5 text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button
            onClick={onOpenForm}
            className="hidden items-center gap-2 rounded-2xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-700 sm:flex"
          >
            <Plus size={17} />
            Add Application
          </button>

          <div className="hidden items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 dark:border-slate-800 dark:bg-slate-900 sm:flex">
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-slate-950 text-white dark:bg-white dark:text-slate-950">
              <UserRound size={16} />
            </div>
            <p className="max-w-36 truncate text-xs font-semibold text-slate-700 dark:text-slate-200">
              {user?.email}
            </p>
          </div>

          <button
            aria-label="Sign out"
            onClick={onSignOut}
            className="rounded-2xl border border-slate-200 bg-white p-2.5 text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}

function AppTabs() {
  const tabs = [
    { name: "Overview", path: "/dashboard", icon: LayoutDashboard },
    { name: "Applications", path: "/applications", icon: Briefcase },
    { name: "Analytics", path: "/analytics", icon: BarChart3 },
    { name: "Activity", path: "/activity", icon: Clock3 },
  ];

  return (
    <nav className="mx-auto max-w-[1500px] px-4 pt-5 lg:px-8">
      <div className="inline-flex max-w-full flex-wrap gap-1.5 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm">
        {tabs.map((tab) => {
          const Icon = tab.icon;

          return (
            <NavLink
              key={tab.path}
              to={tab.path}
              className={({ isActive }) =>
                cn(
                "inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition",
                  isActive
                     ? "bg-slate-950 text-white shadow-sm"
                     : "text-slate-500 hover:bg-slate-100 hover:text-slate-950"
                )
              }
            >
              <Icon size={16} />
              {tab.name}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}

function StatCard({ label, value, helper, icon: Icon, delay }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -3 }}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {label}
          </p>

          <h3 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 dark:text-white">
            {value}
          </h3>
        </div>

        <div className="grid h-11 w-11 place-items-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
          <Icon size={20} strokeWidth={2.2} />
        </div>
      </div>

      <p className="mt-4 text-xs font-medium text-slate-400">{helper}</p>
    </motion.article>
  );
}

function ApplicationModal({
  isOpen,
  onClose,
  form,
  setForm,
  onSubmit,
  editingApplication,
  saving,
}) {
  function updateField(field, value) {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 px-4 py-6 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-[1.75rem] bg-white p-6 shadow-2xl dark:bg-slate-900"
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                  Application
                </p>
                <h2 className="mt-1 text-2xl font-semibold text-slate-950 dark:text-white">
                  {editingApplication
                    ? "Edit application"
                    : "Add new application"}
                </h2>
              </div>

              <button
                onClick={onClose}
                className="rounded-2xl bg-slate-100 p-2 text-slate-600 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
              >
                <X size={18} />
              </button>
            </div>

            <form className="grid gap-4" onSubmit={onSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Company
                  <input
                    required
                    value={form.company}
                    onChange={(e) => updateField("company", e.target.value)}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-medium outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-950"
                    placeholder="NovaTech"
                  />
                </label>

                <label className="grid gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Role
                  <input
                    required
                    value={form.role}
                    onChange={(e) => updateField("role", e.target.value)}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-medium outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-950"
                    placeholder="Frontend Intern"
                  />
                </label>
              </div>

              <label className="grid gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                Application Link
                <input
                  value={form.application_link}
                  onChange={(e) =>
                    updateField("application_link", e.target.value)
                  }
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-medium outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-950"
                  placeholder="https://company.com/apply"
                />
              </label>

              <div className="grid gap-4 md:grid-cols-3">
                <label className="grid gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Status
                  <select
                    value={form.status}
                    onChange={(e) => updateField("status", e.target.value)}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-medium outline-none dark:border-slate-700 dark:bg-slate-950"
                  >
                    {STATUSES.map((status) => (
                      <option key={status}>{status}</option>
                    ))}
                  </select>
                </label>

                <label className="grid gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Priority
                  <select
                    value={form.priority}
                    onChange={(e) => updateField("priority", e.target.value)}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-medium outline-none dark:border-slate-700 dark:bg-slate-950"
                  >
                    {PRIORITIES.map((priority) => (
                      <option key={priority}>{priority}</option>
                    ))}
                  </select>
                </label>

                <label className="grid gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Location
                  <input
                    value={form.location}
                    onChange={(e) => updateField("location", e.target.value)}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-medium outline-none dark:border-slate-700 dark:bg-slate-950"
                    placeholder="Remote"
                  />
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <label className="grid gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Applied Date
                  <input
                    type="date"
                    value={form.applied_date || ""}
                    onChange={(e) =>
                      updateField("applied_date", e.target.value)
                    }
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-medium outline-none dark:border-slate-700 dark:bg-slate-950"
                  />
                </label>

                <label className="grid gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Deadline
                  <input
                    type="date"
                    value={form.deadline || ""}
                    onChange={(e) => updateField("deadline", e.target.value)}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-medium outline-none dark:border-slate-700 dark:bg-slate-950"
                  />
                </label>

                <label className="grid gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Follow-up Date
                  <input
                    type="date"
                    value={form.follow_up_date || ""}
                    onChange={(e) =>
                      updateField("follow_up_date", e.target.value)
                    }
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-medium outline-none dark:border-slate-700 dark:bg-slate-950"
                  />
                </label>
              </div>

              <label className="grid gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                Notes
                <textarea
                  value={form.notes}
                  onChange={(e) => updateField("notes", e.target.value)}
                  className="min-h-24 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-medium outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-950"
                  placeholder="Applied through LinkedIn. Follow up after 5 days."
                />
              </label>

              <button
                disabled={saving}
                className="flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-70"
              >
                {saving && <Loader2 className="animate-spin" size={17} />}
                {editingApplication ? "Save Changes" : "Add Application"}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function ChartCard({ title, subtitle, children }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="mb-5">
        <h3 className="text-lg font-semibold text-slate-950 dark:text-white">
          {title}
        </h3>
        <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
          {subtitle}
        </p>
      </div>

      {children}
    </motion.article>
  );
}

function EmptyChart() {
  return (
    <div className="grid h-[260px] place-items-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 text-center dark:border-slate-700 dark:bg-slate-950">
      <div>
        <BarChart3 className="mx-auto text-slate-400" size={30} />
        <p className="mt-3 text-sm font-semibold text-slate-500">
          Add applications to see charts
        </p>
      </div>
    </div>
  );
}

function Charts({ applications }) {
  const statusData = STATUSES.map((status) => ({
    name: status,
    value: applications.filter((app) => app.status === status).length,
    color: STATUS_COLORS[status],
  })).filter((item) => item.value > 0);

  const weeklyData = useMemo(() => {
    const counts = {};

    applications.forEach((app) => {
      const dateValue = app.applied_date || app.created_at?.slice(0, 10);

      const label = dateValue
        ? new Date(dateValue).toLocaleDateString("en-IN", {
            month: "short",
            day: "numeric",
          })
        : "Unknown";

      counts[label] = (counts[label] || 0) + 1;
    });

    return Object.entries(counts)
      .slice(-7)
      .map(([date, count]) => ({ date, count }));
  }, [applications]);

  const responseData = STATUSES.map((status) => ({
    status: status.replace(" Scheduled", ""),
    count: applications.filter((app) => app.status === status).length,
  }));

  return (
    <section className="grid gap-4 xl:grid-cols-3">
      <ChartCard title="Application Funnel" subtitle="Current status split">
        {statusData.length === 0 ? (
          <EmptyChart />
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={58}
                outerRadius={86}
                paddingAngle={4}
                dataKey="value"
              >
                {statusData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <RechartsTooltip />
            </PieChart>
          </ResponsiveContainer>
        )}
      </ChartCard>

      <ChartCard title="Weekly Activity" subtitle="Applications by applied date">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={weeklyData}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e2e8f0"
            />
            <XAxis dataKey="date" tickLine={false} axisLine={false} />
            <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
            <RechartsTooltip />
            <Bar dataKey="count" radius={[10, 10, 0, 0]} fill="#2563eb" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Response Insights" subtitle="Status counts from live data">
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={responseData}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e2e8f0"
            />
            <XAxis dataKey="status" tickLine={false} axisLine={false} />
            <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
            <RechartsTooltip />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#0f172a"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
    </section>
  );
}

function ApplicationsTable({ applications, onEdit, onDelete }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [sortBy, setSortBy] = useState("created_at");

  const filteredApplications = useMemo(() => {
    return applications
      .filter((app) => {
        const text = `${app.company} ${app.role} ${
          app.location || ""
        }`.toLowerCase();

        const matchesSearch = text.includes(query.toLowerCase());
        const matchesFilter = filter === "All" || app.status === filter;

        return matchesSearch && matchesFilter;
      })
      .sort((a, b) => {
        if (sortBy === "company") {
          return a.company.localeCompare(b.company);
        }

        if (sortBy === "deadline") {
          return (
            new Date(a.deadline || "2999-12-31") -
            new Date(b.deadline || "2999-12-31")
          );
        }

        return new Date(b.created_at) - new Date(a.created_at);
      });
  }, [applications, query, filter, sortBy]);

  return (
    <section className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-5 flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
        <div>
          <h3 className="text-xl font-semibold text-slate-950 dark:text-white">
            Applications
          </h3>
          <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
            Search, filter, sort, edit, and delete your internship applications.
          </p>
        </div>

        <div className="grid gap-2 md:grid-cols-[1fr_190px_160px] xl:w-[650px]">
          <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-800 dark:bg-slate-950">
            <Search size={16} className="text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent text-sm font-medium text-slate-700 outline-none dark:text-slate-200"
              placeholder="Search company, role, location"
            />
          </label>

          <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-800 dark:bg-slate-950">
            <Filter size={16} className="text-slate-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full bg-transparent text-sm font-semibold outline-none dark:text-slate-200"
            >
              <option>All</option>
              {STATUSES.map((status) => (
                <option key={status}>{status}</option>
              ))}
            </select>
          </label>

          <label className="flex items-center rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-800 dark:bg-slate-950">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-transparent text-sm font-semibold outline-none dark:text-slate-200"
            >
              <option value="created_at">Newest</option>
              <option value="deadline">Deadline</option>
              <option value="company">Company</option>
            </select>
          </label>
        </div>
      </div>

      {filteredApplications.length === 0 ? (
        <div className="grid min-h-64 place-items-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center dark:border-slate-700 dark:bg-slate-950">
          <div>
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              <Briefcase size={24} />
            </div>

            <h4 className="mt-4 text-lg font-semibold text-slate-950 dark:text-white">
              No applications found
            </h4>

            <p className="mt-1 text-sm font-medium text-slate-500">
              Add your first application or change your filters.
            </p>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] border-separate border-spacing-y-2">
            <thead>
              <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                <th className="px-3 py-2">Company</th>
                <th className="px-3 py-2">Role</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Applied</th>
                <th className="px-3 py-2">Deadline</th>
                <th className="px-3 py-2">Priority</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredApplications.map((app, index) => (
                <motion.tr
                  key={app.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="group bg-slate-50 text-sm transition hover:bg-slate-100/70 dark:bg-slate-950 dark:hover:bg-slate-800"
                >
                  <td className="rounded-l-2xl px-3 py-4">
                    <div className="flex items-center gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-950 text-xs font-semibold text-white shadow-sm dark:bg-white dark:text-slate-950">
                        {getInitials(app.company)}
                      </div>

                      <div>
                        <p className="font-semibold text-slate-950 dark:text-white">
                          {app.company}
                        </p>
                        <p className="text-xs font-medium text-slate-400">
                          {app.location || "Location not added"}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-3 py-4 font-medium text-slate-600 dark:text-slate-300">
                    {app.role}
                  </td>

                  <td className="px-3 py-4">
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-1 text-xs font-semibold ring-1",
                        statusBadgeClass(app.status)
                      )}
                    >
                      {app.status}
                    </span>
                  </td>

                  <td className="px-3 py-4 font-medium text-slate-500 dark:text-slate-400">
                    {formatDate(app.applied_date)}
                  </td>

                  <td
                    className={cn(
                      "px-3 py-4 font-semibold",
                      deadlineClass(app.deadline)
                    )}
                  >
                    {formatDate(app.deadline)}
                  </td>

                  <td className="px-3 py-4">
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-1 text-xs font-semibold",
                        priorityBadgeClass(app.priority)
                      )}
                    >
                      {app.priority}
                    </span>
                  </td>

                  <td className="rounded-r-2xl px-3 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        aria-label={`Edit ${app.company}`}
                        onClick={() => onEdit(app)}
                        className="rounded-xl bg-white p-2 text-slate-600 shadow-sm transition hover:text-blue-700 dark:bg-slate-900 dark:text-slate-300"
                      >
                        <Edit3 size={16} />
                      </button>

                      <button
                        aria-label={`Delete ${app.company}`}
                        onClick={() => onDelete(app.id)}
                        className="rounded-xl bg-white p-2 text-slate-600 shadow-sm transition hover:text-rose-700 dark:bg-slate-900 dark:text-slate-300"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function ActivityTimeline({ applications }) {
  const recent = applications.slice(0, 5);

  return (
    <section className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <h3 className="text-xl font-semibold text-slate-950 dark:text-white">
        Recent Activity
      </h3>

      <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
        Live updates from your Supabase database.
      </p>

      <div className="mt-5 space-y-2">
        {recent.length === 0 ? (
          <p className="rounded-2xl bg-slate-50 p-4 text-sm font-medium text-slate-500 dark:bg-slate-950">
            No recent activity yet. Add an application to start tracking.
          </p>
        ) : (
          recent.map((app, index) => (
            <motion.div
              key={app.id}
              whileHover={{ x: 4 }}
              className="relative flex gap-4 rounded-2xl p-3 transition hover:bg-slate-50 dark:hover:bg-slate-950"
            >
              {index !== recent.length - 1 && (
                <div className="absolute left-[30px] top-12 h-8 w-px bg-slate-200 dark:bg-slate-800" />
              )}

              <div className="z-10 grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                <Activity size={17} />
              </div>

              <div>
                <p className="font-semibold text-slate-950 dark:text-white">
                  {app.status} at {app.company}
                </p>
                <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                  {app.role} · {formatDate(app.created_at)}
                </p>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </section>
  );
}

function OverviewPage({ stats, openCreateForm }) {
  return (
    <>
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-7"
      >
        <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-blue-100/60 blur-3xl" />

        <div className="relative grid gap-6 lg:grid-cols-[1fr_340px] lg:items-center">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Connected to Supabase · Live database
            </div>

            <h2 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
              InternTrack
            </h2>

            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              A focused internship tracking workspace for managing applications,
              interviews, deadlines, offers, and follow-ups with real-time data.
            </p>

            <div className="mt-6 flex flex-wrap gap-3 text-sm font-medium text-slate-600">
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5">
                Auth enabled
              </span>
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5">
                Private user data
              </span>
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5">
                Live analytics
              </span>
            </div>

            <button
              onClick={openCreateForm}
              className="mt-7 inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-700 sm:hidden"
            >
              <Plus size={17} />
              Add Application
            </button>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-medium text-slate-500">Current Focus</p>

            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
              Build. Apply. Follow up.
            </h3>

            <div className="mt-5 h-2 rounded-full bg-slate-200">
              <div
                className="h-2 rounded-full bg-blue-600"
                style={{
                  width: `${Math.min((stats.total / 50) * 100, 100)}%`,
                }}
              />
            </div>

            <p className="mt-2 text-xs font-medium text-slate-500">
              {stats.total} / 50 applications tracked
            </p>
          </div>
        </div>
      </motion.section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <StatCard
          label="Total Applications"
          value={stats.total}
          helper="Stored in Supabase"
          icon={Briefcase}
          delay={0.02}
        />
        <StatCard
          label="Interviews"
          value={stats.interviews}
          helper="Scheduled rounds"
          icon={CalendarDays}
          delay={0.04}
        />
        <StatCard
          label="Offers"
          value={stats.offers}
          helper="Positive outcomes"
          icon={CheckCircle2}
          delay={0.06}
        />
        <StatCard
          label="Rejected"
          value={stats.rejected}
          helper="Learning signals"
          icon={X}
          delay={0.08}
        />
        <StatCard
          label="Response Rate"
          value={`${stats.responseRate}%`}
          helper="Interview + offer + reject"
          icon={Activity}
          delay={0.1}
        />
        <StatCard
          label="Active"
          value={stats.active}
          helper="Still in progress"
          icon={BarChart3}
          delay={0.12}
        />
      </section>
    </>
  );
}

function ApplicationsPage({ applications, openEditForm, deleteApplication }) {
  return (
    <ApplicationsTable
      applications={applications}
      onEdit={openEditForm}
      onDelete={deleteApplication}
    />
  );
}

function AnalyticsPage({ applications }) {
  return <Charts applications={applications} />;
}

function ActivityPage({ applications }) {
  return (
    <div className="max-w-4xl">
      <ActivityTimeline applications={applications} />
    </div>
  );
}

function Dashboard({ user }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingApplication, setEditingApplication] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  async function fetchApplications() {
    setLoading(true);

    const { data, error } = await supabase
      .from("internship_applications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      alert(error.message);
    } else {
      setApplications(data || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchApplications();

    const channel = supabase
      .channel("internship_applications_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "internship_applications",
        },
        () => {
          fetchApplications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const stats = useMemo(() => {
    const total = applications.length;

    const interviews = applications.filter(
      (app) => app.status === "Interview Scheduled"
    ).length;

    const offers = applications.filter(
      (app) => app.status === "Offer Received"
    ).length;

    const rejected = applications.filter(
      (app) => app.status === "Rejected"
    ).length;

    const active = applications.filter(
      (app) => app.status !== "Rejected" && app.status !== "Offer Received"
    ).length;

    const responseRate = total
      ? Math.round(((interviews + offers + rejected) / total) * 100)
      : 0;

    return { total, interviews, offers, rejected, active, responseRate };
  }, [applications]);

  function openCreateForm() {
    setEditingApplication(null);
    setForm(EMPTY_FORM);
    setIsFormOpen(true);
  }

  function openEditForm(application) {
    setEditingApplication(application);

    setForm({
      company: application.company || "",
      role: application.role || "",
      application_link: application.application_link || "",
      status: application.status || "Applied",
      priority: application.priority || "Medium",
      applied_date: application.applied_date || "",
      deadline: application.deadline || "",
      follow_up_date: application.follow_up_date || "",
      location: application.location || "",
      notes: application.notes || "",
    });

    setIsFormOpen(true);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);

    const payload = {
      ...form,
      deadline: form.deadline || null,
      follow_up_date: form.follow_up_date || null,
      applied_date: form.applied_date || null,
    };

    try {
      if (editingApplication) {
        const { error } = await supabase
          .from("internship_applications")
          .update(payload)
          .eq("id", editingApplication.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("internship_applications")
          .insert({
            ...payload,
            user_id: user.id,
          });

        if (error) throw error;
      }

      setIsFormOpen(false);
      setEditingApplication(null);
      setForm(EMPTY_FORM);
      await fetchApplications();
    } catch (error) {
      alert(error.message);
    } finally {
      setSaving(false);
    }
  }

  async function deleteApplication(id) {
    const shouldDelete = confirm("Delete this internship application?");

    if (!shouldDelete) return;

    const { error } = await supabase
      .from("internship_applications")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
    } else {
      await fetchApplications();
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  return (
    <div className={cn(darkMode && "dark")}>
      <div className="min-h-screen bg-[#f6f8fb] text-slate-950 dark:bg-slate-950 dark:text-white">
        <Header
          user={user}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          onOpenForm={openCreateForm}
          onSignOut={signOut}
        />

        <AppTabs />

        <main className="mx-auto max-w-[1500px] space-y-6 px-4 py-6 lg:px-8">
          {loading ? (
            <div className="grid min-h-80 place-items-center rounded-3xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
              <Loader2 className="animate-spin text-blue-600" size={36} />
            </div>
          ) : (
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />

              <Route
                path="/dashboard"
                element={
                  <OverviewPage
                    stats={stats}
                    openCreateForm={openCreateForm}
                  />
                }
              />

              <Route
                path="/applications"
                element={
                  <ApplicationsPage
                    applications={applications}
                    openEditForm={openEditForm}
                    deleteApplication={deleteApplication}
                  />
                }
              />

              <Route
                path="/analytics"
                element={<AnalyticsPage applications={applications} />}
              />

              <Route
                path="/activity"
                element={<ActivityPage applications={applications} />}
              />

              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          )}
        </main>

        <ApplicationModal
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          form={form}
          setForm={setForm}
          onSubmit={handleSubmit}
          editingApplication={editingApplication}
          saving={saving}
        />
      </div>
    </div>
  );
}

export default function App() {
  const [session, setSession] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setCheckingSession(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (checkingSession) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-950 text-white">
        <div className="text-center">
          <Loader2
            className="mx-auto mb-4 animate-spin text-blue-400"
            size={36}
          />
          <p className="font-semibold">Loading InternTrack...</p>
        </div>
      </main>
    );
  }

  if (!session) {
    return <AuthScreen />;
  }

  return (
    <BrowserRouter>
      <Dashboard user={session.user} />
    </BrowserRouter>
  );
}
