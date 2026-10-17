import { APP_VERSION, BUILD_DATE, BUILD_SHA, changelogByLocale, changelogTextByLocale, splitBold } from './changelog.ts'
import { localePaths, type Locale } from './locale.ts'

function Item({ text }: { text: string }) {
  return (
    <li>
      {splitBold(text).map((part, index) => (index % 2 === 1 ? <strong key={index}>{part}</strong> : part))}
    </li>
  )
}

// /changelog/ and /en/changelog/: what changed in each version, read from CHANGELOG.md / CHANGELOG.en.md
function Changelog({ locale }: { locale: Locale }) {
  const text = changelogTextByLocale[locale]
  const buildInfo = [`${text.currentVersion} v${APP_VERSION}`, BUILD_SHA && `${text.build} ${BUILD_SHA}`, BUILD_DATE]
    .filter(Boolean)
    .join(' · ')

  return (
    <main id="main-content">
      <section className="changelog">
        <div className="container changelog-container">
          <h1>{text.title}</h1>
          <p className="changelog-build">{buildInfo}</p>

          <ol className="changelog-releases">
            {changelogByLocale[locale].map((section) => (
              <li key={section.version ?? 'unreleased'} className="changelog-release">
                <div className="changelog-release-head">
                  <h2>{section.version ? `v${section.version}` : text.unreleased}</h2>
                  {section.date ? <time dateTime={section.date}>{section.date}</time> : null}
                  {section.version === null ? <span>{text.unreleasedNote}</span> : null}
                  {section.version === APP_VERSION ? <span>{text.currentVersion}</span> : null}
                </div>
                <ul className="changelog-items">
                  {section.items.map((item) => (
                    <Item key={item} text={item} />
                  ))}
                </ul>
              </li>
            ))}
          </ol>

          <a className="changelog-back" href={localePaths[locale]}>
            {text.backHome}
          </a>
        </div>
      </section>
    </main>
  )
}

export default Changelog
