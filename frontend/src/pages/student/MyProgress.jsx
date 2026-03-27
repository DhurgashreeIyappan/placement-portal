import { motion } from 'framer-motion';
import { Building2, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getMyInterviewProgress } from '../../api/studentApi';

function RoundBadge({ status }) {
  if (status === 'cleared') return <span className="badge badge-success"><CheckCircle2 size={11} />Cleared</span>;
  if (status === 'rejected') return <span className="badge badge-error"><XCircle size={11} />Rejected</span>;
  return <span className="badge badge-warning"><Clock size={11} />{status || 'Pending'}</span>;
}

function getProgressPct(rounds) {
  if (!rounds?.length) return 0;
  const cleared = rounds.filter((r) => r.status === 'cleared').length;
  return Math.round((cleared / rounds.length) * 100);
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 20 } }
};

export default function MyProgress() {
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyInterviewProgress()
      .then((res) => setProgress(res.data.progress || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-state"><div className="spinner" /><span>Loading progress...</span></div>;

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Interview Progress</h1>
          <p>Track your round-by-round progress across all drives</p>
        </div>
      </div>

      {progress.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card">
          <div className="empty-state">
            <div className="empty-state-icon"><TrendingUp size={32} color="var(--text-muted)" /></div>
            <div className="empty-state-title">No registrations yet</div>
            <p className="empty-state-text">Register for a company drive to see your interview progress here.</p>
          </div>
        </motion.div>
      ) : (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {progress.map((item, idx) => {
            const rounds = item.rounds || [];
            const pct = getProgressPct(rounds);
            const isPlaced = item.registration?.status === 'placed';

            return (
              <motion.div variants={itemVariants} key={idx} className="card" style={{ marginBottom: 0, overflow: 'hidden', padding: 0 }}>
                {isPlaced && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: 'var(--success)', zIndex: 1, boxShadow: '0 0 10px rgba(16,185,129,0.5)' }} />}

                <div style={{ padding: 'var(--space-6)' }}>
                  {/* Company Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-6)', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                      <div style={{
                        width: 56, height: 56, borderRadius: 'var(--radius)',
                        background: isPlaced ? 'rgba(16,185,129,0.1)' : 'rgba(108,99,255,0.1)',
                        border: `1px solid ${isPlaced ? 'rgba(16,185,129,0.2)' : 'rgba(108,99,255,0.2)'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: `0 0 20px ${isPlaced ? 'rgba(16,185,129,0.1)' : 'rgba(108,99,255,0.1)'}`
                      }}>
                        <Building2 size={28} color={isPlaced ? 'var(--success)' : 'var(--primary-light)'} />
                      </div>
                      <div>
                        <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
                          {item.registration?.company?.name}
                        </h3>
                        <span className="text-muted" style={{ fontSize: 'var(--text-sm)', fontWeight: 600, letterSpacing: '0.05em' }}>
                          AY {item.registration?.company?.academicYear}
                        </span>
                      </div>
                    </div>
                    <span className={`badge ${isPlaced ? 'badge-success' : 'badge-purple'}`} style={{ fontSize: 'var(--text-sm)', padding: '6px 14px' }}>
                      {item.registration?.status}
                    </span>
                  </div>

                  {/* Animated Progress bar */}
                  {rounds.length > 0 && (
                    <div style={{ marginBottom: 'var(--space-6)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-3)', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-muted)' }}>
                        <span>Round Progress</span>
                        <span style={{ color: isPlaced ? 'var(--success)' : 'var(--text-light)' }}>
                          {rounds.filter(r => r.status === 'cleared').length} / {rounds.length} cleared
                        </span>
                      </div>
                      <div style={{ height: 8, borderRadius: 4, background: 'var(--surface-hover)', overflow: 'hidden', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.5)' }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                          style={{
                            height: '100%', borderRadius: 4,
                            background: pct === 100 ? 'var(--success)' : 'var(--gradient-primary)',
                            boxShadow: `0 0 15px ${pct === 100 ? 'rgba(16,185,129,0.5)' : 'rgba(108,99,255,0.5)'}`
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Rounds Timeline */}
                  {rounds.length > 0 ? (
                    <div style={{ position: 'relative', paddingLeft: 'var(--space-4)' }}>
                      {/* Vertical line connector */}
                      <div style={{ position: 'absolute', top: 16, bottom: 16, left: 23, width: 2, background: 'var(--border-strong)', zIndex: 0 }} />

                      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', position: 'relative', zIndex: 1 }}>
                        {rounds.map((r, i) => {
                          const isCleared = r.status === 'cleared';
                          const isRejected = r.status === 'rejected';
                          const dotColor = isCleared ? 'var(--success)' : isRejected ? 'var(--error)' : 'var(--warning)';
                          const dotBg = isCleared ? 'rgba(16,185,129,0.2)' : isRejected ? 'rgba(239,68,68,0.2)' : 'rgba(245,158,11,0.2)';

                          return (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.4 + (i * 0.1) }}
                              style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}
                            >
                              <div style={{
                                width: 16, height: 16, borderRadius: '50%', background: dotColor,
                                border: `4px solid ${dotBg}`, boxShadow: `0 0 10px ${dotColor}`,
                                flexShrink: 0
                              }} />

                              <div style={{
                                flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-3)',
                                background: 'var(--surface-2)', padding: '12px 16px', borderRadius: 'var(--radius-sm)',
                                border: '1px solid var(--border)', transition: 'all 0.2s'
                              }}>
                                <span style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--text)' }}>
                                  <span style={{ color: 'var(--text-dim)', marginRight: 8, fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Round {i + 1}</span>
                                  {r.roundName}
                                </span>
                                <RoundBadge status={r.status} />
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div style={{ padding: 'var(--space-4)', background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                      <p className="text-muted" style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>No rounds recorded yet.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </>
  );
}
