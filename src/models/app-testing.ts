interface AppTesting {
  id: string
  uid: string
  appId: string
  packageName: string
  status: 'optin' | 'testing' | 'done'
  optin: Date | string
  created: Date | string
}