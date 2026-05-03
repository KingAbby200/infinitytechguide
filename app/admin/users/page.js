import { connectDB } from '@/lib/mongoose'
import User from '@/models/User'
import UserManager from '@/components/admin/UserManager'

export const metadata = { title: 'Admin — Authors' }

export default async function AdminUsersPage() {
  await connectDB()
  const users = await User.find({ role: 'author' }).select('-password').sort({ createdAt: -1 }).lean()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-bold text-2xl text-white">Authors</h1>
        <p className="text-gray-500 text-sm mt-1">Create and manage author accounts.</p>
      </div>
      <UserManager users={JSON.parse(JSON.stringify(users))} />
    </div>
  )
}