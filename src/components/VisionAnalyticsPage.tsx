import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Header } from './Header';
import { supabase } from '../lib/supabase';
import {
  ArrowLeft,
  TrendingUp,
  CheckCircle,
  Clock,
  Target,
  Search,
  X,
  Calendar,
  Mail,
  User
} from 'lucide-react';

interface VisionSubmission {
  id: string;
  name: string;
  email: string;
  area_of_life: string | null;
  current_reality: string | null;
  why_important: string | null;
  being_words: string[];
  doing_actions: string[];
  having_outcomes: string[];
  current_step: number;
  status: string;
  created_at: string;
  completed_at: string | null;
}

interface AreaCount {
  area: string;
  count: number;
}

export function VisionAnalyticsPage() {
  const [submissions, setSubmissions] = useState<VisionSubmission[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<VisionSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<VisionSubmission | null>(null);
  const [filterTab, setFilterTab] = useState<'all' | 'completed' | 'in_progress'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [areaFilter, setAreaFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'status' | 'area'>('date');

  const lifeAreas = [
    'health-fitness',
    'career-business',
    'finances',
    'romantic-relationship',
    'friendships-community',
    'personal-development',
    'family-relationships',
    'spirituality',
    'fun-recreation',
  ];

  const getAreaTitle = (areaId: string | null): string => {
    if (!areaId) return 'Not selected';

    const areaMap: Record<string, string> = {
      'health-fitness': 'Health & Fitness',
      'career-business': 'Career & Business',
      'finances': 'Finances',
      'romantic-relationship': 'Romantic Relationship',
      'friendships-community': 'Friendships & Community',
      'personal-development': 'Personal Development',
      'family-relationships': 'Family Relationships',
      'spirituality': 'Spirituality',
      'fun-recreation': 'Fun & Recreation',
    };

    return areaMap[areaId] || areaId;
  };

  const getStatusLabel = (submission: VisionSubmission): string => {
    if (submission.status === 'completed') return 'Completed';
    if (submission.current_step === 1) return 'Started';
    return `Step ${submission.current_step}`;
  };

  useEffect(() => {
    loadSubmissions();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [submissions, filterTab, searchQuery, areaFilter, sortBy]);

  const loadSubmissions = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('vision_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setSubmissions(data || []);
    } catch (error) {
      console.error('Error loading submissions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...submissions];

    if (filterTab === 'completed') {
      filtered = filtered.filter(s => s.status === 'completed');
    } else if (filterTab === 'in_progress') {
      filtered = filtered.filter(s => s.status !== 'completed');
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        s => s.name.toLowerCase().includes(query) || s.email.toLowerCase().includes(query)
      );
    }

    if (areaFilter !== 'all') {
      filtered = filtered.filter(s => s.area_of_life === areaFilter);
    }

    if (sortBy === 'date') {
      filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (sortBy === 'status') {
      filtered.sort((a, b) => {
        if (a.status === 'completed' && b.status !== 'completed') return -1;
        if (a.status !== 'completed' && b.status === 'completed') return 1;
        return b.current_step - a.current_step;
      });
    } else if (sortBy === 'area') {
      filtered.sort((a, b) => {
        const areaA = getAreaTitle(a.area_of_life);
        const areaB = getAreaTitle(b.area_of_life);
        return areaA.localeCompare(areaB);
      });
    }

    setFilteredSubmissions(filtered);
  };

  const totalSubmissions = submissions.length;
  const completedSubmissions = submissions.filter(s => s.status === 'completed').length;
  const inProgressSubmissions = totalSubmissions - completedSubmissions;
  const completionRate = totalSubmissions > 0 ? Math.round((completedSubmissions / totalSubmissions) * 100) : 0;

  const areaCounts: AreaCount[] = lifeAreas.map(area => ({
    area: getAreaTitle(area),
    count: submissions.filter(s => s.area_of_life === area).length,
  })).sort((a, b) => b.count - a.count);

  const topAreas = areaCounts.slice(0, 3);

  const recentActivity = submissions
    .slice(0, 10)
    .map(s => ({
      name: s.name,
      area: getAreaTitle(s.area_of_life),
      action: s.status === 'completed' ? 'completed' : 'started',
      date: s.status === 'completed' ? s.completed_at : s.created_at,
    }));

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatRelativeTime = (dateString: string | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Less than an hour ago';
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    return formatDate(dateString);
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link
            to="/admin"
            className="inline-flex items-center gap-2 text-stone-600 hover:text-teal-600 transition-colors mb-4"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Admin</span>
          </Link>
          <h1 className="text-4xl font-bold text-stone-900 mb-2">Vision Builder Analytics</h1>
          <p className="text-lg text-stone-600">Track submissions and completion data</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-stone-600 uppercase">Total Submissions</h3>
                  <TrendingUp className="text-teal-600" size={24} />
                </div>
                <p className="text-4xl font-bold text-stone-900">{totalSubmissions}</p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-stone-600 uppercase">Completed</h3>
                  <CheckCircle className="text-green-600" size={24} />
                </div>
                <p className="text-4xl font-bold text-stone-900">{completedSubmissions}</p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-stone-600 uppercase">In Progress</h3>
                  <Clock className="text-orange-600" size={24} />
                </div>
                <p className="text-4xl font-bold text-stone-900">{inProgressSubmissions}</p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-stone-600 uppercase">Completion Rate</h3>
                  <Target className="text-blue-600" size={24} />
                </div>
                <p className="text-4xl font-bold text-stone-900">{completionRate}%</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {topAreas.map((area, index) => (
                <div key={area.area} className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-stone-600 uppercase">
                      {index === 0 ? 'Most Popular Area' : `#${index + 1} Popular Area`}
                    </h3>
                    <span className="text-2xl">{index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}</span>
                  </div>
                  <p className="text-xl font-bold text-stone-900 mb-1">{area.area}</p>
                  <p className="text-stone-600">{area.count} submission{area.count !== 1 ? 's' : ''}</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold text-stone-900 mb-6">Submissions</h2>

              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border-2 border-stone-200 rounded-lg focus:outline-none focus:border-teal-600"
                  />
                </div>

                <select
                  value={areaFilter}
                  onChange={(e) => setAreaFilter(e.target.value)}
                  className="px-4 py-2 border-2 border-stone-200 rounded-lg focus:outline-none focus:border-teal-600"
                >
                  <option value="all">All Areas</option>
                  {lifeAreas.map(area => (
                    <option key={area} value={area}>{getAreaTitle(area)}</option>
                  ))}
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'date' | 'status' | 'area')}
                  className="px-4 py-2 border-2 border-stone-200 rounded-lg focus:outline-none focus:border-teal-600"
                >
                  <option value="date">Sort by Date</option>
                  <option value="status">Sort by Status</option>
                  <option value="area">Sort by Area</option>
                </select>
              </div>

              <div className="flex gap-2 mb-6 border-b border-stone-200">
                <button
                  onClick={() => setFilterTab('all')}
                  className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
                    filterTab === 'all'
                      ? 'border-teal-600 text-teal-600'
                      : 'border-transparent text-stone-600 hover:text-stone-900'
                  }`}
                >
                  All ({submissions.length})
                </button>
                <button
                  onClick={() => setFilterTab('completed')}
                  className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
                    filterTab === 'completed'
                      ? 'border-teal-600 text-teal-600'
                      : 'border-transparent text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Completed ({completedSubmissions})
                </button>
                <button
                  onClick={() => setFilterTab('in_progress')}
                  className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
                    filterTab === 'in_progress'
                      ? 'border-teal-600 text-teal-600'
                      : 'border-transparent text-stone-600 hover:text-stone-900'
                  }`}
                >
                  In Progress ({inProgressSubmissions})
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-stone-200">
                      <th className="text-left py-3 px-4 font-semibold text-stone-900">Name</th>
                      <th className="text-left py-3 px-4 font-semibold text-stone-900">Email</th>
                      <th className="text-left py-3 px-4 font-semibold text-stone-900">Area of Life</th>
                      <th className="text-left py-3 px-4 font-semibold text-stone-900">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-stone-900">Created</th>
                      <th className="text-left py-3 px-4 font-semibold text-stone-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSubmissions.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-stone-500">
                          No submissions found
                        </td>
                      </tr>
                    ) : (
                      filteredSubmissions.map((submission) => (
                        <tr key={submission.id} className="border-b border-stone-100 hover:bg-stone-50">
                          <td className="py-3 px-4 text-stone-900">{submission.name}</td>
                          <td className="py-3 px-4 text-stone-600">{submission.email}</td>
                          <td className="py-3 px-4 text-stone-900">{getAreaTitle(submission.area_of_life)}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                                submission.status === 'completed'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-orange-100 text-orange-800'
                              }`}
                            >
                              {getStatusLabel(submission)}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-stone-600">{formatDate(submission.created_at)}</td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => setSelectedSubmission(submission)}
                              className="text-teal-600 hover:text-teal-700 font-semibold transition-colors"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-bold text-stone-900 mb-6">Area Breakdown</h2>
                <div className="space-y-4">
                  {areaCounts.map((area) => (
                    <div key={area.area}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-stone-700">{area.area}</span>
                        <span className="text-sm text-stone-600">{area.count}</span>
                      </div>
                      <div className="w-full bg-stone-200 rounded-full h-2">
                        <div
                          className="bg-teal-600 h-2 rounded-full transition-all"
                          style={{ width: `${totalSubmissions > 0 ? (area.count / totalSubmissions) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-bold text-stone-900 mb-6">Recent Activity</h2>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3 pb-4 border-b border-stone-100 last:border-0">
                      <div className={`mt-1 p-2 rounded-full ${
                        activity.action === 'completed' ? 'bg-green-100' : 'bg-blue-100'
                      }`}>
                        {activity.action === 'completed' ? (
                          <CheckCircle className="text-green-600" size={16} />
                        ) : (
                          <Clock className="text-blue-600" size={16} />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-stone-900">
                          <span className="font-semibold">{activity.name}</span> {activity.action} their vision for{' '}
                          <span className="font-semibold">{activity.area}</span>
                        </p>
                        <p className="text-sm text-stone-500">{formatRelativeTime(activity.date)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-stone-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-stone-900">Submission Details</h2>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4 p-4 bg-stone-50 rounded-lg">
                <User className="text-teal-600" size={24} />
                <div>
                  <p className="text-sm text-stone-600">Name</p>
                  <p className="text-lg font-semibold text-stone-900">{selectedSubmission.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-stone-50 rounded-lg">
                <Mail className="text-teal-600" size={24} />
                <div>
                  <p className="text-sm text-stone-600">Email</p>
                  <p className="text-lg font-semibold text-stone-900">{selectedSubmission.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-stone-50 rounded-lg">
                <Target className="text-teal-600" size={24} />
                <div>
                  <p className="text-sm text-stone-600">Area of Life</p>
                  <p className="text-lg font-semibold text-stone-900">
                    {getAreaTitle(selectedSubmission.area_of_life)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-stone-50 rounded-lg">
                <Calendar className="text-teal-600" size={24} />
                <div className="flex-1">
                  <p className="text-sm text-stone-600">Status</p>
                  <p className="text-lg font-semibold text-stone-900">{getStatusLabel(selectedSubmission)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-stone-600">Started</p>
                  <p className="text-sm font-semibold text-stone-900">{formatDate(selectedSubmission.created_at)}</p>
                </div>
              </div>

              {selectedSubmission.current_reality && (
                <div>
                  <h3 className="text-lg font-bold text-stone-900 mb-2">Current Reality</h3>
                  <p className="text-stone-700 bg-stone-50 p-4 rounded-lg">{selectedSubmission.current_reality}</p>
                </div>
              )}

              {selectedSubmission.why_important && (
                <div>
                  <h3 className="text-lg font-bold text-stone-900 mb-2">Why Important</h3>
                  <p className="text-stone-700 bg-stone-50 p-4 rounded-lg">{selectedSubmission.why_important}</p>
                </div>
              )}

              {selectedSubmission.being_words && selectedSubmission.being_words.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-stone-900 mb-3">Being Words</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedSubmission.being_words.map((word, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-teal-100 text-teal-800 rounded-full font-semibold"
                      >
                        {word}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedSubmission.doing_actions && selectedSubmission.doing_actions.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-stone-900 mb-3">Doing Actions</h3>
                  <ul className="space-y-2">
                    {selectedSubmission.doing_actions.map((action, index) => (
                      <li key={index} className="flex items-start gap-2 text-stone-700">
                        <CheckCircle className="text-teal-600 flex-shrink-0 mt-0.5" size={20} />
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedSubmission.having_outcomes && selectedSubmission.having_outcomes.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-stone-900 mb-3">Having Outcomes</h3>
                  <ul className="space-y-2">
                    {selectedSubmission.having_outcomes.map((outcome, index) => (
                      <li key={index} className="flex items-start gap-2 text-stone-700">
                        <Target className="text-teal-600 flex-shrink-0 mt-0.5" size={20} />
                        <span>{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="sticky bottom-0 bg-white border-t border-stone-200 p-6">
              <button
                onClick={() => setSelectedSubmission(null)}
                className="w-full px-6 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
