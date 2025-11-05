import { useAuth } from '../contexts/AuthContext';
import { Header } from './Header';
import { LogOut, FileText, Mail, Users, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardCard {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
  buttonText: string;
}

export function AdminDashboard() {
  const { signOut } = useAuth();

  const dashboardCards: DashboardCard[] = [
    {
      title: 'Blog Posts',
      description: 'Create, edit, and manage blog content',
      icon: <FileText className="w-8 h-8 text-teal-600" />,
      link: '/admin/blog-posts',
      buttonText: 'Manage Blog Posts'
    },
    {
      title: 'Guest Profiles',
      description: 'Manage podcast guest profiles and episodes',
      icon: <Users className="w-8 h-8 text-teal-600" />,
      link: '/admin/guest-profiles',
      buttonText: 'Manage Guests'
    },
    {
      title: 'Email Templates',
      description: 'Customize automated email content',
      icon: <Mail className="w-8 h-8 text-teal-600" />,
      link: '/admin/email-templates',
      buttonText: 'Edit Email Templates'
    },
    {
      title: 'Vision Analytics',
      description: 'View Vision Builder submissions and completion data',
      icon: <BarChart3 className="w-8 h-8 text-teal-600" />,
      link: '/admin/vision-analytics',
      buttonText: 'View Analytics'
    }
  ];

  async function handleLogout() {
    await signOut();
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-5xl font-bold text-stone-900 mb-3">Admin Portal</h1>
            <p className="text-xl text-stone-600">Manage your Inner Edge website</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-3 bg-stone-200 text-stone-900 rounded-lg hover:bg-stone-300 font-semibold transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl">
          {dashboardCards.map((card) => (
            <Link
              key={card.link}
              to={card.link}
              className="block bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden group"
            >
              <div className="p-8">
                <div className="mb-4 p-3 bg-teal-50 rounded-lg inline-block group-hover:bg-teal-100 transition-colors">
                  {card.icon}
                </div>
                <h2 className="text-2xl font-bold text-stone-900 mb-3">
                  {card.title}
                </h2>
                <p className="text-stone-600 mb-6">
                  {card.description}
                </p>
                <div className="flex items-center gap-2 text-teal-600 font-semibold group-hover:text-teal-700 transition-colors">
                  <span>{card.buttonText}</span>
                  <svg
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
