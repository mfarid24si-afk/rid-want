import { useState } from 'react'
import { Sparkles, MessageCircle, CreditCard, AlertCircle, CheckCircle2, Clock } from 'lucide-react'
import PageHeader from '../components/layout/PageHeader'
import Card from '../components/ui/Card'
import Avatar from '../components/ui/Avatar'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import { tasksData, timelineData } from '../data/mockTasks'
import { useRole } from '../context/RoleContext'

const iconMap = {
  sparkles: Sparkles,
  message:  MessageCircle,
  credit:   CreditCard,
  alert:    AlertCircle,
}

const eventTypeStyle = {
  treatment:    { color: 'var(--success)',  bg: 'var(--success-soft)' },
  consultation: { color: 'var(--info)',     bg: 'var(--info-soft)' },
  purchase:     { color: 'var(--accent)',   bg: 'var(--accent-soft)' },
  complaint:    { color: 'var(--danger)',   bg: 'var(--danger-soft)' },
}

const Collaboration = () => {
  const { can } = useRole()
  const [tasks, setTasks] = useState(tasksData)
  const [activeTab, setActiveTab] = useState('timeline')

  if (!can('view:collaboration')) {
    return (
      <div>
        <PageHeader title="Kolaborasi Tim" />
        <Card>
          <div className="text-center py-16">
            <p className="text-4xl mb-4">🔒</p>
            <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-heading)' }}>Akses Terbatas</h3>
            <p style={{ color: 'var(--text)' }}>Fitur ini hanya untuk Admin dan Tim Klinik.</p>
          </div>
        </Card>
      </div>
    )
  }

  const toggleTask = (id) => {
    setTasks(prev => prev.map(t =>
      t.id === id ? { ...t, status: t.status === 'done' ? 'pending' : 'done' } : t
    ))
  }

  const pendingTasks = tasks.filter(t => t.status === 'pending')
  const doneTasks    = tasks.filter(t => t.status === 'done')

  const priorityColor = {
    high:   'var(--danger)',
    medium: 'var(--warning)',
    low:    'var(--success)',
  }

  return (
    <div>
      <PageHeader title="Kolaborasi Tim" subtitle="Rekam medis non-klinis & pembagian tugas tim klinik" />

      {/* Tab */}
      <div className="flex gap-2 mb-5">
        {[
          { key: 'timeline', label: '📋 Timeline Pasien' },
          { key: 'tasks',    label: '✅ Manajemen Tugas' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
            style={activeTab === tab.key
              ? { background: 'var(--accent)', color: '#fff' }
              : { background: 'var(--bg-raised)', color: 'var(--text)', border: '1px solid var(--border)' }
            }
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ——— TIMELINE TAB ——— */}
      {activeTab === 'timeline' && (
        <div className="space-y-6">
          {timelineData.map((patient, pi) => (
            <Card key={patient.id}>
              <div className="flex items-center gap-3 mb-5">
                <Avatar initials={patient.avatar} size="md" index={pi} />
                <div>
                  <h3 className="font-semibold" style={{ color: 'var(--text-heading)' }}>{patient.patient}</h3>
                  <p className="text-xs" style={{ color: 'var(--text)' }}>Riwayat Interaksi Klinik</p>
                </div>
              </div>

              <div className="relative">
                {/* Garis vertikal timeline */}
                <div className="absolute left-4 top-0 bottom-0 w-px"
                  style={{ background: 'var(--border)' }} />

                <div className="space-y-5">
                  {patient.events.map((event, ei) => {
                    const style = eventTypeStyle[event.type] || eventTypeStyle.consultation
                    const IconComp = iconMap[event.icon] || Sparkles

                    return (
                      <div key={ei} className="flex gap-4 pl-2">
                        {/* Dot + Icon */}
                        <div className="relative flex-shrink-0">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center z-10 relative"
                            style={{ background: style.bg, border: `2px solid ${style.color}` }}>
                            <IconComp className="w-4 h-4" style={{ color: style.color }} />
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 pb-4" style={{ borderBottom: '1px solid var(--border)' }}>
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="text-xs font-mono" style={{ color: 'var(--text)' }}>{event.date}</span>
                            <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                              style={{ background: style.bg, color: style.color }}>
                              {event.type}
                            </span>
                          </div>
                          <h4 className="text-sm font-semibold mb-1" style={{ color: 'var(--text-heading)' }}>
                            {event.title}
                          </h4>
                          <p className="text-xs leading-relaxed mb-1" style={{ color: 'var(--text)' }}>
                            {event.note}
                          </p>
                          <p className="text-xs font-medium" style={{ color: 'var(--accent)' }}>
                            👤 {event.staff}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* ——— TASKS TAB ——— */}
      {activeTab === 'tasks' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Tugas Pending */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold" style={{ color: 'var(--text-heading)' }}>
                ⏳ Tugas Pending ({pendingTasks.length})
              </h3>
            </div>
            <div className="space-y-3">
              {pendingTasks.map((task) => (
                <div key={task.id}
                  className="flex items-start gap-3 p-3 rounded-xl transition-all"
                  style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)' }}>
                  <button
                    onClick={() => toggleTask(task.id)}
                    className="w-5 h-5 rounded-md border-2 flex-shrink-0 mt-0.5 transition-colors"
                    style={{ borderColor: 'var(--border-strong)' }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium" style={{ color: 'var(--text-heading)' }}>{task.title}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text)' }}>
                      👤 {task.assignee} {task.patient !== '-' && `· Pasien: ${task.patient}`}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <Clock className="w-3 h-3" style={{ color: 'var(--text)' }} />
                      <span className="text-xs" style={{ color: 'var(--text)' }}>{task.dueTime}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{ background: 'transparent', color: priorityColor[task.priority], border: `1px solid ${priorityColor[task.priority]}` }}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                  <Avatar initials={task.avatar} size="sm" index={task.id.charCodeAt(1) % 7} />
                </div>
              ))}
              {pendingTasks.length === 0 && (
                <p className="text-center text-sm py-6" style={{ color: 'var(--text)' }}>
                  Semua tugas selesai! 🎉
                </p>
              )}
            </div>
          </Card>

          {/* Tugas Selesai */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-4 h-4" style={{ color: 'var(--success)' }} />
              <h3 className="font-semibold" style={{ color: 'var(--text-heading)' }}>
                Selesai ({doneTasks.length})
              </h3>
            </div>
            <div className="space-y-3">
              {doneTasks.map((task) => (
                <div key={task.id}
                  className="flex items-start gap-3 p-3 rounded-xl opacity-60 transition-all"
                  style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)' }}>
                  <button
                    onClick={() => toggleTask(task.id)}
                    className="w-5 h-5 rounded-md flex-shrink-0 mt-0.5 flex items-center justify-center"
                    style={{ background: 'var(--success)', border: '2px solid var(--success)' }}>
                    <CheckCircle2 className="w-3 h-3 text-white" />
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-through" style={{ color: 'var(--text)' }}>{task.title}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text)' }}>
                      👤 {task.assignee}
                    </p>
                  </div>
                  <Avatar initials={task.avatar} size="sm" index={task.id.charCodeAt(1) % 7} />
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

export default Collaboration