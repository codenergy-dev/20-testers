type AppType = 'app' | 'game'

interface App {
  id: string
  applicationName: string
  packageName: string
  type: AppType
  category: string
  icon: string
  screenshots: string[]
  description: string
  created: Date | string
}