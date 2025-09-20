let lastCall = 0
const delay = 5000 // 5s between calls (adjust for your demo)

export async function throttledFetch(url: string, options?: RequestInit) {
  const now = Date.now()
  if (now - lastCall < delay) {
    throw new Error("Too many requests, slow down!")
  }
  lastCall = now

  return fetch(url, options)
}
