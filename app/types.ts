export interface Person {
    id: string
    name: string
    username?:string,
    status: 'Active' | 'Inactive'
    role: string
    email: string
    teams: string[]
    phone?:string,
    avatar?:string
  }