import { useCallback, useEffect, useState } from 'react'

export function useNotifications() {
  const [permission, setPermission] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'denied'
  )

  useEffect(() => {
    if (typeof Notification !== 'undefined') {
      setPermission(Notification.permission)
    }
  }, [])

  const requestPermission = useCallback(async () => {
    if (typeof Notification === 'undefined') return 'denied'
    if (Notification.permission === 'default') {
      const result = await Notification.requestPermission()
      setPermission(result)
      return result
    }
    return Notification.permission
  }, [])

  const sendNotification = useCallback(async (title, body) => {
    if (typeof Notification === 'undefined') return
    let perm = Notification.permission
    if (perm === 'default') {
      perm = await requestPermission()
    }
    if (perm === 'granted') {
      try {
        new Notification(title, { body, icon: '/timer-icon.svg' })
      } catch (e) {
        console.warn('Notification failed:', e)
      }
    }
  }, [requestPermission])

  return { permission, requestPermission, sendNotification }
}
