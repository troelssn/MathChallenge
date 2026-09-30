import type { Strings } from '../i18n'
import { LOOKS, THEMES, type Theme } from '../theme'

type Props = { t: Strings; onPick: (theme: Theme) => void }

export function ThemePicker({ t, onPick }: Props) {
  return (
    <section className="card theme-picker" aria-labelledby="theme-title">
      <h1 id="theme-title">{t.chooseTheme}</h1>
      <div className="theme-options">
        {THEMES.map((theme) => (
          <button key={theme} type="button" className={`theme-option theme-option-${theme}`} onClick={() => onPick(theme)}>
            <span className="theme-option-mascot" aria-hidden="true">
              {LOOKS[theme].mascot}
            </span>
            <span className="theme-option-name">{t.themeNames[theme]}</span>
            <span className="theme-option-tagline">{t.themed[theme].tagline}</span>
          </button>
        ))}
      </div>
      <p className="muted">{t.chooseThemeIntro}</p>
    </section>
  )
}
