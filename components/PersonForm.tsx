import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Person } from '@/app/types'
import { faker } from '@faker-js/faker'


const personSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  status: z.enum(['Active', 'Inactive']),
  role: z.string().min(1, 'Role is required'),
  email: z.string().email('Invalid email address'),
  teams: z.array(z.string()).min(1, 'At least one team is required'),
  username:z.string().min(1, 'username is required'),
  phone:z.string().min(8, 'phone is required'),
  avatar:z.string().min(1, 'avatar is required'),

})

type PersonFormData = z.infer<typeof personSchema>

interface PersonFormProps {
  initialData?: Person
  onSubmit: (data: PersonFormData) => void
  onCancel: () => void
}

const PersonForm = ({ initialData, onSubmit, onCancel }: PersonFormProps) => {
  const { control, handleSubmit, formState: { errors } } = useForm<PersonFormData>({
    resolver: zodResolver(personSchema),
    defaultValues: initialData || {
      name: '',
      status: 'Active',
      role: '',
      email: '',
      teams: [],
      username:faker.internet.userName(),
      phone: faker.phone.number(),
      avatar: faker.image.avatar(),
    
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="name" className="block mb-1">Name</label>
        <Controller
          name="name"
          control={control}
          render={({ field }) => <input {...field} id="name" className="w-full p-2 border rounded" />}
        />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="status" className="block mb-1">Status</label>
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <select {...field} id="status" className="w-full p-2 border rounded">
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          )}
        />
      </div>

      <div>
        <label htmlFor="role" className="block mb-1">Role</label>
        <Controller
          name="role"
          control={control}
          render={({ field }) => <input {...field} id="role" className="w-full p-2 border rounded" />}
        />
        {errors.role && <p className="text-red-500">{errors.role.message}</p>}
      </div>

      <div>
        <label htmlFor="email" className="block mb-1">Email</label>
        <Controller
          name="email"
          control={control}
          render={({ field }) => <input {...field} id="email" type="email" className="w-full p-2 border rounded" />}
        />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
      </div>

      <div>
        <label className="block mb-1">Teams</label>
        <Controller
          name="teams"
          control={control}
          render={({ field }) => (
            <div>
              {['Design', 'Product', 'Marketing'].map((team) => (
                <label key={team} className="block">
                  <input
                    type="checkbox"
                    value={team}
                    checked={field.value.includes(team)}
                    onChange={(e) => {
                      const updatedTeams = e.target.checked
                        ? [...field.value, team]
                        : field.value.filter((t) => t !== team)
                      field.onChange(updatedTeams)
                    }}
                  />
                  {team}
                </label>
              ))}
            </div>
          )}
        />
        {errors.teams && <p className="text-red-500">{errors.teams.message}</p>}
      </div>

      <div className="flex justify-end space-x-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
        <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded">Save</button>
      </div>
    </form>
  )
}

export default PersonForm