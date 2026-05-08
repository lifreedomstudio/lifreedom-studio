'use client'

import { useState } from 'react'
import { updateProfile } from './actions'

const DAWS = ['Logic Pro', 'Ableton Live', 'FL Studio', 'Pro Tools', 'Cubase', 'Studio One', 'Other']
const INSTRUMENTS = ['Vocals', 'Acoustic Guitar', 'Electric Guitar', 'Bass', 'Drums', 'Synths', 'Piano', 'Strings']

export default function ProfileForm({ initialDaw, initialInstruments }: { initialDaw: string, initialInstruments: string[] }) {
  const [daw, setDaw] = useState(initialDaw || '')
  const [instruments, setInstruments] = useState<string[]>(initialInstruments || [])
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle')

  const toggleInstrument = (inst: string) => {
    setInstruments(prev => 
      prev.includes(inst) ? prev.filter(i => i !== inst) : [...prev, inst]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('saving')
    try {
      const formData = new FormData()
      formData.append('daw', daw)
      formData.append('instruments', JSON.stringify(instruments))
      
      const result = await updateProfile(formData)
      if (result.error) throw new Error(result.error)
      
      setStatus('success')
      setTimeout(() => setStatus('idle'), 3000)
    } catch (err) {
      setStatus('error')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Your Studio Setup</h2>
      
      <div className="form-group">
        <label className="label">Primary DAW</label>
        <select 
          className="input-field" 
          value={daw} 
          onChange={(e) => setDaw(e.target.value)}
          required
        >
          <option value="" disabled>Select your DAW</option>
          {DAWS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      <div className="form-group" style={{ marginTop: '2rem' }}>
        <label className="label">Frequently Mixed Instruments</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem' }}>
          {INSTRUMENTS.map(inst => {
            const isSelected = instruments.includes(inst)
            return (
              <button
                key={inst}
                type="button"
                onClick={() => toggleInstrument(inst)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  border: `1px solid ${isSelected ? 'var(--primary-color)' : 'var(--glass-border)'}`,
                  background: isSelected ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                  color: isSelected ? 'var(--primary-color)' : 'var(--text-color)',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
              >
                {inst}
              </button>
            )
          })}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '2rem' }}>
        <button 
          type="submit" 
          className="btn-primary" 
          disabled={status === 'saving'}
        >
          {status === 'saving' ? 'Saving...' : 'Save Settings'}
        </button>
        {status === 'success' && <span style={{ color: 'var(--success-color)' }}>Saved successfully!</span>}
        {status === 'error' && <span style={{ color: 'var(--error-color)' }}>Error saving settings.</span>}
      </div>
    </form>
  )
}
