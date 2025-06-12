import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { navigationRoutes } from './config/routes';

const Layout = () => {
  const location = useLocation();

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <main className="h-full overflow-y-auto bg-surface-50">
          <Outlet />
        </main>
      </div>

      {/* Bottom Navigation */}
      <nav className="flex-shrink-0 bg-white border-t border-surface-200 z-40">
        <div className="flex justify-around items-center h-16 px-2">
          {navigationRoutes.map((route) => {
            const isActive = location.pathname === route.path || 
              (route.path !== '/dashboard' && location.pathname.startsWith(route.path));
            
            return (
              <NavLink
                key={route.id}
                to={route.path}
                className="flex flex-col items-center justify-center flex-1 py-2 relative"
              >
                {({ isActive: navIsActive }) => (
                  <>
                    {(isActive || navIsActive) && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-primary/10 rounded-lg"
                        initial={false}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <motion.div
                      className="relative z-10 flex flex-col items-center"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ApperIcon 
                        name={route.icon} 
                        size={24} 
                        className={`transition-colors duration-200 ${
                          isActive || navIsActive ? 'text-primary' : 'text-surface-600'
                        }`}
                      />
                      <span className={`text-xs font-medium mt-1 transition-colors duration-200 ${
                        isActive || navIsActive ? 'text-primary' : 'text-surface-600'
                      }`}>
                        {route.label}
                      </span>
                    </motion.div>
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Layout;