import PeopleDirectory from '@/components/PeopleComponent'
import React from 'react'
import { Person } from '../types'
import { faker } from '@faker-js/faker'

const page = () => {
    const generateFakeData = (count: number): Person[] => {
        return Array.from({ length: count }, () => ({
          id: faker.string.uuid(),
          name: faker.person.fullName(),
          username: faker.internet.userName(),
          status: faker.helpers.arrayElement(['Active', 'Inactive']),
          role: faker.helpers.arrayElement(['Product Designer', 'Frontend Developer', 'Backend Developer']),
          email: faker.internet.email(),
          teams: faker.helpers.arrayElements(['Design', 'Product', 'Marketing'], { min: 1, max: 3 }),
          avatar: faker.image.avatar(),
          phone: faker.phone.number(),
          
        }))
      }
      const data=generateFakeData(100);
  return (
    <div><PeopleDirectory pdata={data}/></div>
  )
}

export default page