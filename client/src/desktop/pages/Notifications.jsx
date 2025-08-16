import { useState, useEffect } from 'react';
import { MessageCircle, MapPin, AlertTriangle, User, Clock, CheckCircle, Heart } from 'lucide-react';
import Sidebar from '../components/Sidebar';

function Notifications() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'like',
      user: 'Sarah Johnson',
      action: 'liked your post',
      content: 'Beautiful sunset at Marina Beach!',
      time: '2 minutes ago',
      isRead: false,
      icon: Heart,
      iconColor: 'text-red-500'
    },
    {
      id: 2,
      type: 'comment',
      user: 'Alex Chen',
      action: 'commented on your post',
      content: 'Love this view! Which camera did you use?',
      time: '15 minutes ago',
      isRead: false,
      icon: MessageCircle,
      iconColor: 'text-blue-500'
    },
    {
      id: 3,
      type: 'issue',
      user: null,
      action: 'Your locality has 34 new issues reported',
      content: 'Including 12 road maintenance, 8 water supply, 14 waste management issues',
      time: '1 hour ago',
      isRead: true,
      icon: AlertTriangle,
      iconColor: 'text-orange-500'
    },
    {
      id: 4,
      type: 'like',
      user: 'Priya Sharma',
      action: 'liked your post',
      content: 'Street art discovery in Bandra',
      time: '2 hours ago',
      isRead: true,
      icon: Heart,
      iconColor: 'text-red-500'
    },
    {
      id: 5,
      type: 'update',
      user: null,
      action: 'The issue you posted needs to be updated',
      content: 'Broken streetlight on MG Road - More details required from local authorities',
      time: '3 hours ago',
      isRead: false,
      icon: CheckCircle,
      iconColor: 'text-green-500'
    },
    {
      id: 6,
      type: 'comment',
      user: 'Raj Patel',
      action: 'commented on your post',
      content: 'This place looks amazing! Adding to my bucket list 📍',
      time: '4 hours ago',
      isRead: true,
      icon: MessageCircle,
      iconColor: 'text-blue-500'
    },
    {
      id: 7,
      type: 'issue',
      user: null,
      action: 'New issue reported in your area',
      content: 'Water logging at Junction Road - reported by 5 residents',
      time: '6 hours ago',
      isRead: true,
      icon: MapPin,
      iconColor: 'text-purple-500'
    },
    {
      id: 8,
      type: 'update',
      user: null,
      action: 'Issue status updated',
      content: 'Pothole repair on Church Street - Marked as "In Progress" by Municipal Corporation',
      time: '1 day ago',
      isRead: true,
      icon: CheckCircle,
      iconColor: 'text-green-500'
    },
    {
      id: 9,
      type: 'comment',
      user: 'Arjun Kumar',
      action: 'commented on your post',
      content: 'Great capture! This is exactly why I love our city 🌆',
      time: '1 day ago',
      isRead: true,
      icon: MessageCircle,
      iconColor: 'text-blue-500'
    }
  ]);

  // Auto-mark all notifications as read when component mounts
  useEffect(() => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => ({
        ...notification,
        isRead: true
      }))
    );
  }, []);

  const formatTime = (timeString) => {
    return timeString;
  };

  return (
    <>
      <Sidebar />
      <div className="min-h-screen bg-black text-white">
        {/* Header */}
        <div className="bg-neutral-900/50 backdrop-blur-md border-b border-neutral-800 sticky top-0 z-10">
          <div className="px-6 py-4">
            <h1 className="text-2xl font-bold text-white text-left">Notifications</h1>
            <p className="text-sm text-neutral-400 mt-1 text-left">
              Stay updated with your community
            </p>
          </div>
        </div>

        {/* Notifications List */}
        <div className="px-6 py-6">
          {notifications.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={24} className="text-neutral-600" />
              </div>
              <h3 className="text-lg font-medium text-neutral-300 mb-2">No notifications</h3>
              <p className="text-neutral-500">You're all caught up!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => {
                const IconComponent = notification.icon;
                
                return (
                  <div
                    key={notification.id}
                    className="p-4 rounded-xl border transition-all duration-200 bg-neutral-900/40 border-neutral-800 hover:border-neutral-600"
                  >
                    <div className="flex items-start gap-3">
                      {/* Main Icon */}
                      <div className="flex-shrink-0">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          notification.type === 'like' ? 'bg-red-500/20' :
                          notification.type === 'comment' ? 'bg-blue-500/20' :
                          notification.type === 'issue' ? 'bg-orange-500/20' :
                          notification.type === 'update' ? 'bg-green-500/20' : 'bg-purple-500/20'
                        }`}>
                          <IconComponent size={20} className={notification.iconColor} />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="text-left">
                          <p className="text-sm text-neutral-300">
                            {notification.user && (
                              <span className="font-medium text-white">{notification.user} </span>
                            )}
                            <span className="text-neutral-200">
                              {notification.action}
                            </span>
                          </p>
                          
                          {notification.content && (
                            <p className="text-sm mt-1 text-neutral-400 text-left">
                              {notification.content}
                            </p>
                          )}

                          {/* Time */}
                          <div className="flex items-center gap-1 mt-2">
                            <Clock size={12} className="text-neutral-600" />
                            <span className="text-xs text-neutral-600">
                              {formatTime(notification.time)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}export default Notifications;
