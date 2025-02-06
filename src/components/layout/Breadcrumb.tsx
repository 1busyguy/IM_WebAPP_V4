import { Link, useLocation, useParams } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { usePartnerStore } from '../../store/partnerStore';
import { useUserStore } from '../../store/userStore';
import { useEffect } from 'react';

export function Breadcrumb() {
  const location = useLocation();
  const { partnerId, userId } = useParams();
  const { partners, fetchPartners } = usePartnerStore();
  const { users, fetchUsers } = useUserStore();

  useEffect(() => {
    fetchPartners();
    if (partnerId) {
      fetchUsers(partnerId);
    }
  }, [fetchPartners, fetchUsers, partnerId]);

  const currentPartner = partners.find(p => p.id === partnerId);
  const currentUser = users.find(u => u.id === userId);

  const pathSegments = location.pathname.split('/').filter(Boolean);
  const breadcrumbs = [];

  // Always add home
  breadcrumbs.push({
    id: 'home',
    name: 'Dashboard',
    path: '/',
    icon: <Home className="h-4 w-4" />
  });

  // Add partner if we're in a partner context
  if (partnerId && currentPartner) {
    breadcrumbs.push({
      id: `partner-${partnerId}`,
      name: currentPartner.company_name,
      path: `/partners/${partnerId}`
    });
  }

  // Add user if we're in a user context
  if (userId && currentUser) {
    const userPath = `/partners/${currentUser.partner_id}`;
    breadcrumbs.push({
      id: `user-${userId}`,
      name: `${currentUser.first_name} ${currentUser.last_name}`,
      path: userPath
    });
  }

  // Add current section (collections/activations)
  const currentSection = pathSegments[pathSegments.length - 1];
  if (currentSection === 'collections' || currentSection === 'activations') {
    breadcrumbs.push({
      id: `${currentSection}-${userId}`,
      name: currentSection.charAt(0).toUpperCase() + currentSection.slice(1),
      path: `/users/${userId}/${currentSection}`
    });
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
      {breadcrumbs.map((crumb, index) => (
        <div key={crumb.id} className="flex items-center">
          {index > 0 && <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />}
          <Link
            to={crumb.path}
            className="flex items-center hover:text-gray-700 transition-colors"
          >
            {crumb.icon && <span className="mr-1">{crumb.icon}</span>}
            <span className={index === breadcrumbs.length - 1 ? 'font-medium text-gray-900' : ''}>
              {crumb.name}
            </span>
          </Link>
        </div>
      ))}
    </nav>
  );
}