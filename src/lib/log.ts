export const log = (...args: any[]) => {
  const date = new Date()
  const formattedDate = date.toISOString().replace('T', ' ').split('.')[0]
  const formattedArgs = args.map((arg) => {
    if (typeof arg === 'object') {
      return JSON.stringify(arg, null, 2)
    }
    return arg
  })
  console.log(`[${formattedDate}]`, ...formattedArgs)
}
