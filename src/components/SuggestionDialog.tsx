import { useEffect, useRef, useState } from 'react'
import type { Strings } from '../i18n'

const NEW_ISSUE_URL = 'https://github.com/troelssn/MathChallenge/issues/new'

type Props = { t: Strings; open: boolean; onClose: () => void }

// A static GitHub Pages site cannot hold a token, so suggestions open a prefilled GitHub issue instead.
export function SuggestionDialog({ t, open, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  function send() {
    const params = new URLSearchParams({ title: title.trim(), body: body.trim(), labels: 'suggestion' })
    window.open(`${NEW_ISSUE_URL}?${params}`, '_blank', 'noopener')
    setTitle('')
    setBody('')
    onClose()
  }

  return (
    <dialog ref={dialogRef} className="suggestion-dialog" onClose={onClose} aria-labelledby="suggest-title">
      <form
        method="dialog"
        onSubmit={(event) => {
          event.preventDefault()
          if (title.trim()) send()
        }}
      >
        <h2 id="suggest-title">💡 {t.suggestTitle}</h2>
        <p className="muted">{t.suggestIntro}</p>
        <label>
          <span>{t.suggestTitleLabel}</span>
          <input value={title} onChange={(event) => setTitle(event.target.value)} required maxLength={120} />
        </label>
        <label>
          <span>{t.suggestBodyLabel}</span>
          <textarea value={body} onChange={(event) => setBody(event.target.value)} rows={5} />
        </label>
        <div className="dialog-actions">
          <button className="secondary" type="button" onClick={onClose}>
            {t.close}
          </button>
          <button className="primary" type="submit" disabled={!title.trim()}>
            {t.suggestSend}
          </button>
        </div>
      </form>
    </dialog>
  )
}
