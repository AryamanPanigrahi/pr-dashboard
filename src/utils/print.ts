// "Download PDF" uses the browser's own print-to-PDF. The tab title becomes the
// suggested file name, so set a meaningful one for the duration of the dialog.
export function printWithTitle(title: string): void {
  const original = document.title
  document.title = title
  window.addEventListener('afterprint', () => (document.title = original), { once: true })
  window.print()
}
