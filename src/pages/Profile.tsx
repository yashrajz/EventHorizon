import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  User, 
  Mail, 
  MapPin, 
  Globe, 
  Edit3, 
  Save, 
  X, 
  Camera,
  Calendar,
  Award,
  Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import SEO from "@/components/SEO";
import { toast } from "sonner";
import { apiClient, type MongoProfile, type MongoEvent } from "@/lib/mongodb";
import { Navigate, useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<MongoProfile | null>(null);
  const [userEvents, setUserEvents] = useState<MongoEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    full_name: '',
    bio: '',
    location: '',
    website: '',
    avatar_url: ''
  });

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      const [profileResponse, eventsResponse] = await Promise.all([
        apiClient.getProfile(),
        apiClient.getUserEvents()
      ]);

      if (profileResponse.success && profileResponse.data) {
        setProfile(profileResponse.data);
        setFormData({
          full_name: profileResponse.data.full_name || user?.name || '',
          bio: profileResponse.data.bio || '',
          location: profileResponse.data.location || '',
          website: profileResponse.data.website || '',
          avatar_url: profileResponse.data.avatar_url || user?.avatar || ''
        });
      } else {
        // Create profile if it doesn't exist
        setFormData({
          full_name: user?.name || '',
          bio: '',
          location: '',
          website: '',
          avatar_url: user?.avatar || ''
        });
      }

      if (eventsResponse.success) {
        setUserEvents(eventsResponse.data || []);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await apiClient.updateProfile(formData);
      if (response.success) {
        setProfile(response.data);
        setEditing(false);
        toast.success("Profile updated successfully!");
      } else {
        toast.error(response.message || "Failed to update profile");
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || user?.name || '',
        bio: profile.bio || '',
        location: profile.location || '',
        website: profile.website || '',
        avatar_url: profile.avatar_url || user?.avatar || ''
      });
    }
    setEditing(false);
  };

  const getEventStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStats = () => {
    const totalEvents = userEvents.length;
    const approvedEvents = userEvents.filter(e => e.status === 'approved').length;
    const totalViews = userEvents.reduce((sum, event) => sum + (event.views || 0), 0);
    
    return { totalEvents, approvedEvents, totalViews };
  };

  const { totalEvents, approvedEvents, totalViews } = getStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title={`${user?.name}'s Profile | EventHorizon`}
        description={`View and edit ${user?.name}'s profile on EventHorizon.`}
      />
      <Header />
      
      <div className="min-h-screen bg-background pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Profile Header */}
            <div className="glass-card p-8">
              <div className="flex flex-col md:flex-row items-start gap-8">
                {/* Avatar Section */}
                <div className="flex-shrink-0">
                  <Avatar className="w-24 h-24">
                    {formData.avatar_url ? (
                      <img 
                        src={formData.avatar_url} 
                        alt={formData.full_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center">
                        <User className="w-8 h-8 text-foreground/60" />
                      </div>
                    )}
                  </Avatar>
                </div>

                {/* Profile Info */}
                <div className="flex-1 space-y-4">
                  {editing ? (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="full_name">Full Name</Label>
                        <Input
                          id="full_name"
                          value={formData.full_name}
                          onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                          placeholder="Your full name"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          value={formData.bio}
                          onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                          placeholder="Tell us about yourself..."
                          rows={3}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            value={formData.location}
                            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                            placeholder="City, Country"
                          />
                        </div>
                        <div>
                          <Label htmlFor="website">Website</Label>
                          <Input
                            id="website"
                            value={formData.website}
                            onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                            placeholder="https://yourwebsite.com"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-bold text-foreground">
                          {profile?.full_name || user?.name}
                        </h1>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditing(true)}
                          className="flex items-center gap-2"
                        >
                          <Edit3 className="w-4 h-4" />
                          Edit Profile
                        </Button>
                      </div>
                      
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="w-4 h-4" />
                        {user?.email}
                        {user?.isEmailVerified && (
                          <Badge variant="default" className="text-xs">Verified</Badge>
                        )}
                      </div>
                      
                      {profile?.bio && (
                        <p className="text-muted-foreground">{profile.bio}</p>
                      )}
                      
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        {profile?.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {profile.location}
                          </div>
                        )}
                        {profile?.website && (
                          <div className="flex items-center gap-1">
                            <Globe className="w-4 h-4" />
                            <a 
                              href={profile.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-accent hover:text-accent/80"
                            >
                              Website
                            </a>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Joined {formatDate(profile?.createdAt || new Date())}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {editing && (
                    <div className="flex gap-3 pt-4">
                      <Button 
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2"
                      >
                        {saving ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <Save className="w-4 h-4" />
                        )}
                        Save Changes
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={handleCancel}
                        className="flex items-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{totalEvents}</p>
                    <p className="text-sm text-muted-foreground">Events Submitted</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Award className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{approvedEvents}</p>
                    <p className="text-sm text-muted-foreground">Events Approved</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Eye className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{totalViews}</p>
                    <p className="text-sm text-muted-foreground">Total Views</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* User Events */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">My Events</h2>
                <Button onClick={() => navigate('/submit-event')}>
                  Submit New Event
                </Button>
              </div>
              
              {userEvents.length === 0 ? (
                <Card className="p-12 text-center">
                  <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No Events Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    You haven't submitted any events yet. Start sharing your events with the community!
                  </p>
                  <Button onClick={() => navigate('/submit-event')}>
                    Submit Your First Event
                  </Button>
                </Card>
              ) : (
                <div className="grid gap-6">
                  {userEvents.map((event) => (
                    <Card key={event._id} className="p-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="md:w-48 h-32">
                          <img 
                            src={event.coverImage} 
                            alt={event.title}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-xl font-semibold text-foreground">{event.title}</h3>
                            <Badge className={getEventStatusColor(event.status)}>
                              {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                            </Badge>
                          </div>
                          
                          <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                            {event.description}
                          </p>
                          
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {formatDate(event.startDate)}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {event.city}
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              {event.views || 0} views
                            </div>
                          </div>
                          
                          {event.status === 'rejected' && event.adminNotes && (
                            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                              <p className="text-sm text-red-800">
                                <strong>Rejection reason:</strong> {event.adminNotes}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default Profile;