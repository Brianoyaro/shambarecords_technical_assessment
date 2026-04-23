import { useAuthStore } from '../stores/authStore';
import { AdminDashboard } from '../components/AdminDashboard';
import { AgentDashboard } from '../components/AgentDashboard';

export function DashboardPage() {
  const { user } = useAuthStore();
    console.log('User role in DashboardPage:', user?.role); // Debugging line
  return user?.role === 'admin' ? <AdminDashboard /> : <AgentDashboard />;
}
