import { useState, useEffect } from 'react';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import SEO from "@/components/SEO";
import { motion } from "framer-motion";
import { User, Mail, MapPin, Globe, Camera, Save, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

const Profile = () => {
  const { user, isAuthenticated } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    full_name: '',
    bio: '',
    location: '',
    website: '',
    avatar_url: '',
  });

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  // Initialize form data when user loads
  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.name || '',
        bio: '',
        location: '',
        website: '',
        avatar_url: user.avatar || '',
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Mock profile update - replace with actual API call later
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Profile updated successfully!");
      setIsEditing(false);
      setIsEditing(false);
    } catch {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    // Reset form data to original values
    if (user) {
      setFormData({
        full_name: user.name || '',
        bio: '',
        location: '',
        website: '',
        avatar_url: user.avatar || '',
      });
    }
    setIsEditing(false);
  };

  return (
    <>
      <SEO 
        title="Profile - EventHorizon"
        description="Manage your EventHorizon profile"
      />
      
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="pt-24 pb-12">
          <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card>
                <CardHeader className="text-center pb-6">
                  <div className="flex justify-center mb-4">
                    <Avatar className="w-24 h-24">
                      <AvatarImage 
                        src={formData.avatar_url || user?.avatar} 
                        alt={user?.name}
                      />
                      <AvatarFallback className="text-2xl">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <CardTitle className="text-2xl">{user?.name}</CardTitle>
                  <CardDescription>{user?.email}</CardDescription>
                  <div className="flex justify-center mt-4">
                    <Button
                      onClick={() => setIsEditing(!isEditing)}
                      variant={isEditing ? "outline" : "default"}
                      className="flex items-center gap-2"
                    >
                      <Edit3 size={16} />
                      {isEditing ? "Cancel" : "Edit Profile"}
                    </Button>
                  </div>
                </CardHeader>

                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Full Name */}
                    <div className="space-y-2">
                      <Label htmlFor="full_name" className="flex items-center gap-2">
                        <User size={16} />
                        Full Name
                      </Label>
                      <Input
                        id="full_name"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder="Enter your full name"
                      />
                    </div>

                    {/* Email (read-only) */}
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Mail size={16} />
                        Email
                      </Label>
                      <Input
                        value={user?.email || ''}
                        disabled
                        className="bg-muted"
                      />
                      <p className="text-sm text-muted-foreground">
                        Email cannot be changed from this page
                      </p>
                    </div>

                    {/* Bio */}
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder="Tell us about yourself..."
                        rows={3}
                      />
                    </div>

                    {/* Location */}
                    <div className="space-y-2">
                      <Label htmlFor="location" className="flex items-center gap-2">
                        <MapPin size={16} />
                        Location
                      </Label>
                      <Input
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder="City, Country"
                      />
                    </div>

                    {/* Website */}
                    <div className="space-y-2">
                      <Label htmlFor="website" className="flex items-center gap-2">
                        <Globe size={16} />
                        Website
                      </Label>
                      <Input
                        id="website"
                        name="website"
                        type="url"
                        value={formData.website}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder="https://yourwebsite.com"
                      />
                    </div>

                    {/* Avatar URL */}
                    <div className="space-y-2">
                      <Label htmlFor="avatar_url" className="flex items-center gap-2">
                        <Camera size={16} />
                        Avatar URL
                      </Label>
                      <Input
                        id="avatar_url"
                        name="avatar_url"
                        type="url"
                        value={formData.avatar_url}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder="https://example.com/avatar.jpg"
                      />
                    </div>

                    {isEditing && (
                      <div className="flex gap-4 pt-4">
                        <Button
                          type="submit"
                          disabled={isLoading}
                          className="flex items-center gap-2"
                        >
                          <Save size={16} />
                          {isLoading ? "Saving..." : "Save Changes"}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleCancel}
                          disabled={isLoading}
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Profile;
