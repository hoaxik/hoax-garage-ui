export const fetchNui = async <T = any>(
  eventName: string,
  data?: any,
  mockData?: T
): Promise<T> => {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify(data),
  }

  if (import.meta.env.DEV && mockData !== undefined) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockData), 100)
    })
  }

  const resourceName = (window as any).GetParentResourceName
    ? (window as any).GetParentResourceName()
    : 'nui-frame-app'

  const resp = await fetch(`https://${resourceName}/${eventName}`, options)
  return await resp.json()
}