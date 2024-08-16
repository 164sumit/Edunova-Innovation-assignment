// import { Person } from '../types'

import { Person } from "@/app/types"

interface PersonDetailsProps {
  person: Person
  onClose: () => void
}

const PersonDetails: React.FC<PersonDetailsProps> = ({ person, onClose }) => {
  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-lg p-4 overflow-y-auto">
      <button onClick={onClose} className="absolute top-4 right-4 text-2xl">&times;</button>
      <h2 className="text-2xl font-bold mb-4">{person.name}</h2>
      <div className="space-y-2">
        <p><strong>Status:</strong> {person.status}</p>
        <p><strong>Role:</strong> {person.role}</p>
        <p><strong>Email:</strong> {person.email}</p>
        <p><strong>Teams:</strong> {person.teams.join(', ')}</p>
      </div>
    </div>
  )
}

export default PersonDetails