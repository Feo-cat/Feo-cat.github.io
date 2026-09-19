/* Progressive enhancement: article links and the first cover work without JS. */
(() => {
  'use strict'

  const initialized = new WeakSet()

  function initializeArticleHubs () {
    document.querySelectorAll('.articles-hub').forEach(hub => {
      if (initialized.has(hub)) return

      const rows = [...hub.querySelectorAll('[data-article-cover]')]
      const preview = hub.querySelector('.article-cover-preview')
      const image = preview && preview.querySelector('.article-preview-image')
      const caption = preview && preview.querySelector('.article-preview-caption')
      if (!rows.length || !image || !caption) return
      initialized.add(hub)

      let activeRow = null
      const selectRow = row => {
        if (row === activeRow) return
        const link = row.querySelector('.article-row-link')
        if (!link) return

        const title = link.textContent.trim()
        const cover = row.dataset.articleCover || preview.dataset.fallbackCover
        rows.forEach(item => item.classList.toggle('is-preview-active', item === row))
        // The browser cancels stale image requests on a rapid selection change.
        if (image.getAttribute('src') !== cover) image.setAttribute('src', cover)
        image.alt = `《${title}》的封面`
        caption.textContent = title
        activeRow = row
      }

      image.addEventListener('error', () => {
        const fallback = preview.dataset.fallbackCover
        if (fallback && image.getAttribute('src') !== fallback) image.setAttribute('src', fallback)
      })

      rows.forEach(row => {
        row.addEventListener('pointerenter', event => {
          if (event.pointerType !== 'touch') selectRow(row)
        })
        row.addEventListener('focusin', () => selectRow(row))
      })
      selectRow(rows[0])
      // Also cover failures that finished before this deferred script ran.
      if (image.complete && !image.naturalWidth) {
        image.setAttribute('src', preview.dataset.fallbackCover)
      }
    })
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeArticleHubs, { once: true })
  } else {
    initializeArticleHubs()
  }
  document.addEventListener('pjax:complete', initializeArticleHubs)
})()
