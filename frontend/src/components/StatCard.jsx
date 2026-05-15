/**
 * Dashboard stat card with gradient icon backgrounds.
 */
export default function StatCard({ icon, label, value, color = 'indigo' }) {
  const colors = {
    indigo: 'from-indigo-500 to-purple-600',
    green: 'from-emerald-500 to-green-600',
    orange: 'from-orange-500 to-amber-600',
    red: 'from-red-500 to-rose-600',
    blue: 'from-blue-500 to-cyan-600',
    purple: 'from-violet-500 to-purple-600',
  }

  return (
    <div className="glass p-5 animate-fade-in-up hover:scale-[1.02] transition-transform duration-300">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors[color] || colors.indigo} flex items-center justify-center text-xl shadow-lg`}>
          {icon}
        </div>
        <div>
          <p className="text-2xl font-bold text-white">{value ?? '—'}</p>
          <p className="text-xs text-slate-400 mt-0.5">{label}</p>
        </div>
      </div>
    </div>
  )
}
