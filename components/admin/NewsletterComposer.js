'use client'
import { useState } from 'react'
import dynamic from 'next/dynamic'
import { format } from 'date-fns'
import { HiMail, HiPaperAirplane, HiSave, HiEye, HiX, HiCheck } from 'react-icons/hi'

const TiptapEditor = dynamic(() => import('@/components/editor/TiptapEditor'), {
  ssr:     false,
  loading: () => <div className="h-64 border border-dark-border rounded-xl flex items-center justify-center text-gray-600 text-sm">Loading editor…</div>,
})

export default function NewsletterComposer({ campaigns: initCampaigns }) {
  const [campaigns, setCampaigns] = useState(initCampaigns)
  const [subject,   setSubject]   = useState('')
  const [content,   setContent]   = useState('')
  const [campaignId, setCampaignId] = useState(null)
  const [saving,    setSaving]    = useState(false)
  const [sending,   setSending]   = useState(false)
  const [result,    setResult]    = useState(null)
  const [preview,   setPreview]   = useState(false)
  const [tab,       setTab]       = useState('compose')  // compose | history

  async function handleSaveDraft() {
    if (!subject.trim() || !content) return
    setSaving(true)
    try {
      const res  = await fetch('/api/newsletter/send', {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ id: campaignId, subject, htmlContent: content }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setCampaignId(data._id)
      setCampaigns(prev => {
        const existing = prev.find(c => c._id === data._id)
        if (existing) return prev.map(c => c._id === data._id ? data : c)
        return [data, ...prev]
      })
      setResult({ type: 'success', message: 'Draft saved!' })
      setTimeout(() => setResult(null), 3000)
    } catch (err) {
      setResult({ type: 'error', message: err.message })
    } finally {
      setSaving(false)
    }
  }

  async function handleSend() {
    if (!subject.trim() || !content) {
      setResult({ type: 'error', message: 'Subject and content are required' })
      return
    }
    if (!confirm(`Send this newsletter to all active subscribers?`)) return

    setSending(true)
    setResult(null)
    try {
      const res  = await fetch('/api/newsletter/send', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ subject, htmlContent: content, campaignId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setResult({ type: 'success', message: `✓ Sent to ${data.sent} subscribers${data.failed ? ` (${data.failed} failed)` : ''}` })
      // Reload campaigns
      const cRes = await fetch('/api/newsletter/send')
      const cData = await cRes.json()
      setCampaigns(cData)
    } catch (err) {
      setResult({ type: 'error', message: err.message })
    } finally {
      setSending(false)
    }
  }

  function loadCampaign(c) {
    setSubject(c.subject)
    setContent(c.htmlContent)
    setCampaignId(c._id)
    setTab('compose')
  }

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { value: 'compose', label: 'Compose', icon: HiMail },
          { value: 'history', label: 'Past Campaigns', icon: HiPaperAirplane },
        ].map(t => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              tab === t.value ? 'bg-primary text-black' : 'bg-dark-card border border-dark-border text-gray-400 hover:text-white'
            }`}
          >
            <t.icon size={15} /> {t.label}
          </button>
        ))}
      </div>

      {tab === 'compose' && (
        <div className="space-y-5">
          {/* Subject */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Subject Line</label>
            <input
              type="text"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="Your newsletter subject…"
              className="w-full px-4 py-3 rounded-xl bg-dark-card border border-dark-border text-white placeholder-gray-600 text-base focus:outline-none focus:border-primary/50"
            />
          </div>

          {/* Body */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Newsletter Body</label>
            <TiptapEditor
              content={content}
              onChange={setContent}
              placeholder="Write your newsletter here…"
            />
          </div>

          {/* Result message */}
          {result && (
            <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm ${
              result.type === 'success'
                ? 'bg-primary/10 border border-primary/20 text-primary'
                : 'bg-red-500/10 border border-red-500/20 text-red-400'
            }`}>
              {result.type === 'success' ? <HiCheck size={16} /> : <HiX size={16} />}
              {result.message}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setPreview(true)}
              className="px-5 py-2.5 rounded-xl text-sm border border-dark-border text-gray-300 hover:text-white hover:border-primary/30 flex items-center gap-2 transition-all"
            >
              <HiEye size={15} /> Preview
            </button>
            <button
              onClick={handleSaveDraft}
              disabled={saving || !subject || !content}
              className="px-5 py-2.5 rounded-xl text-sm border border-dark-border text-gray-300 hover:text-white flex items-center gap-2 transition-all disabled:opacity-50"
            >
              <HiSave size={15} /> {saving ? 'Saving…' : 'Save Draft'}
            </button>
            <button
              onClick={handleSend}
              disabled={sending || !subject || !content}
              className="btn-primary px-7 py-2.5 rounded-xl text-sm flex items-center gap-2 shadow-glow-sm disabled:opacity-50"
            >
              <HiPaperAirplane size={15} /> {sending ? 'Sending…' : 'Send to All Subscribers'}
            </button>
          </div>
        </div>
      )}

      {tab === 'history' && (
        <div className="space-y-3">
          {campaigns.length === 0 ? (
            <div className="text-center py-16 bg-dark-card border border-dark-border rounded-xl text-gray-600">
              No campaigns sent yet.
            </div>
          ) : (
            campaigns.map(c => (
              <div key={c._id} className="flex items-center gap-4 p-4 bg-dark-card border border-dark-border rounded-xl hover:border-dark-muted transition-all">
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm line-clamp-1">{c.subject}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-600">
                    <span className={`px-2 py-0.5 rounded-full ${c.status === 'sent' ? 'badge-published' : 'badge-draft'}`}>
                      {c.status}
                    </span>
                    {c.sentAt && <span>{format(new Date(c.sentAt), 'MMM d, yyyy h:mm a')}</span>}
                    {c.recipientCount > 0 && <span>{c.recipientCount} sent</span>}
                    {c.failedCount  > 0 && <span className="text-red-400">{c.failedCount} failed</span>}
                  </div>
                </div>
                {c.status === 'draft' && (
                  <button
                    onClick={() => loadCampaign(c)}
                    className="px-4 py-1.5 rounded-lg bg-dark border border-dark-border text-gray-400 hover:text-primary hover:border-primary/30 text-xs transition-all flex-shrink-0"
                  >
                    Edit & Send
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Preview modal */}
      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <div>
                <p className="text-xs text-gray-500">Subject</p>
                <p className="font-semibold text-gray-900">{subject || '(no subject)'}</p>
              </div>
              <button onClick={() => setPreview(false)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200">
                <HiX size={18} />
              </button>
            </div>
            <div
              className="px-6 py-6 prose prose-sm max-w-none text-gray-800"
              dangerouslySetInnerHTML={{ __html: content || '<p style="color:#999">No content yet.</p>' }}
            />
            <div className="px-6 py-4 border-t text-xs text-center text-gray-400">
              Unsubscribe link will be appended automatically.
            </div>
          </div>
        </div>
      )}
    </div>
  )
}