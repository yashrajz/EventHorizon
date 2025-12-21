import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Image as ImageIcon, 
  Link as LinkIcon,
  DollarSign,
  Tag,
  FileText,
  Globe,
  Send
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import SEO from "@/components/SEO";
import { toast } from "sonner";
import { apiClient } from "@/lib/mongodb";

const categories = [
  "Technology", "Business", "Arts & Culture", "Sports", 
  "Music", "Food & Drink", "Health & Wellness", "Education",
  "Science", "Fashion", "Travel", "Networking", "Other"
];

const locationTypes = [
  { value: "IRL", label: "In-Person" },
  { value: "Online", label: "Online" },
  { value: "Hybrid", label: "Hybrid" }
];

const SubmitEvent = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    startTime: "10:00",
    endTime: "17:00",
    timezone: "UTC",
    locationType: "IRL" as "IRL" | "Online" | "Hybrid",
    venue: "",
    city: "",
    country: "",
    tags: "",
    organizer: user?.name || "",
    eventUrl: "",
    registrationUrl: "",
    coverImage: "",
    category: "",
    price: "Free" as "Free" | "Paid",
    priceAmount: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Redirect if not authenticated
  if (!isAuthenticated) {
    navigate('/signin');
    return null;
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = "Event title is required";
    if (!formData.description.trim()) newErrors.description = "Event description is required";
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (!formData.endDate) newErrors.endDate = "End date is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    
    if (formData.locationType === "IRL" && !formData.venue.trim()) {
      newErrors.venue = "Venue is required for in-person events";
    }

    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      newErrors.endDate = "End date must be after start date";
    }

    if (formData.price === "Paid" && !formData.priceAmount.trim()) {
      newErrors.priceAmount = "Price amount is required for paid events";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);

    try {
      const eventData = {
        title: formData.title,
        description: formData.description,
        startDate: new Date(`${formData.startDate}T${formData.startTime}`),
        endDate: new Date(`${formData.endDate}T${formData.endTime}`),
        startTime: formData.startTime,
        endTime: formData.endTime,
        timezone: formData.timezone,
        locationType: formData.locationType,
        venue: formData.venue,
        city: formData.city,
        country: formData.country,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        organizer: formData.organizer,
        eventUrl: formData.eventUrl,
        registrationUrl: formData.registrationUrl,
        coverImage: formData.coverImage || `https://picsum.photos/seed/${Date.now()}/800/600`,
        category: formData.category,
        price: formData.price,
        priceAmount: formData.price === "Paid" ? formData.priceAmount : undefined,
        views: 0,
        status: 'pending' as const,
      };

      const response = await apiClient.submitEvent(eventData);

      if (response.success) {
        toast.success("Event submitted successfully! It will be reviewed by our team before being published.");
        navigate('/dashboard', { 
          state: { 
            message: "Your event has been submitted for review. We'll notify you once it's approved!" 
          } 
        });
      } else {
        toast.error(response.message || "Failed to submit event");
      }
    } catch (error: any) {
      console.error('Error submitting event:', error);
      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <>
      <SEO 
        title="Submit Event - EventHorizon"
        description="Submit your event to EventHorizon for review and publication."
      />
      <Header />
      
      <div className="min-h-screen bg-background pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-2">Submit Your Event</h1>
              <p className="text-muted-foreground">
                Share your event with the EventHorizon community. All events are reviewed before publication.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information */}
              <div className="glass-card p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <Label htmlFor="title">Event Title *</Label>
                    <Input
                      id="title"
                      placeholder="Enter event title"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      className={errors.title ? "border-red-500" : ""}
                    />
                    {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title}</p>}
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="description">Event Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your event"
                      rows={4}
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      className={errors.description ? "border-red-500" : ""}
                    />
                    {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}
                  </div>

                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                      <SelectTrigger className={errors.category ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.category && <p className="text-sm text-red-500 mt-1">{errors.category}</p>}
                  </div>

                  <div>
                    <Label htmlFor="organizer">Organizer</Label>
                    <Input
                      id="organizer"
                      placeholder="Event organizer"
                      value={formData.organizer}
                      onChange={(e) => handleInputChange("organizer", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Date and Time */}
              <div className="glass-card p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">Date & Time</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <Label htmlFor="startDate">Start Date *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => handleInputChange("startDate", e.target.value)}
                      className={errors.startDate ? "border-red-500" : ""}
                    />
                    {errors.startDate && <p className="text-sm text-red-500 mt-1">{errors.startDate}</p>}
                  </div>

                  <div>
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => handleInputChange("startTime", e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="endDate">End Date *</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => handleInputChange("endDate", e.target.value)}
                      className={errors.endDate ? "border-red-500" : ""}
                    />
                    {errors.endDate && <p className="text-sm text-red-500 mt-1">{errors.endDate}</p>}
                  </div>

                  <div>
                    <Label htmlFor="endTime">End Time</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => handleInputChange("endTime", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="glass-card p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">Location</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="locationType">Event Type</Label>
                    <Select value={formData.locationType} onValueChange={(value: "IRL" | "Online" | "Hybrid") => handleInputChange("locationType", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {locationTypes.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      placeholder="Event city"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      className={errors.city ? "border-red-500" : ""}
                    />
                    {errors.city && <p className="text-sm text-red-500 mt-1">{errors.city}</p>}
                  </div>

                  {formData.locationType !== "Online" && (
                    <div>
                      <Label htmlFor="venue">Venue {formData.locationType === "IRL" ? "*" : ""}</Label>
                      <Input
                        id="venue"
                        placeholder="Venue name or address"
                        value={formData.venue}
                        onChange={(e) => handleInputChange("venue", e.target.value)}
                        className={errors.venue ? "border-red-500" : ""}
                      />
                      {errors.venue && <p className="text-sm text-red-500 mt-1">{errors.venue}</p>}
                    </div>
                  )}

                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      placeholder="Country"
                      value={formData.country}
                      onChange={(e) => handleInputChange("country", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Additional Details */}
              <div className="glass-card p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">Additional Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="price">Pricing</Label>
                    <Select value={formData.price} onValueChange={(value: "Free" | "Paid") => handleInputChange("price", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Free">Free</SelectItem>
                        <SelectItem value="Paid">Paid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.price === "Paid" && (
                    <div>
                      <Label htmlFor="priceAmount">Price Amount *</Label>
                      <Input
                        id="priceAmount"
                        placeholder="e.g., USD 50"
                        value={formData.priceAmount}
                        onChange={(e) => handleInputChange("priceAmount", e.target.value)}
                        className={errors.priceAmount ? "border-red-500" : ""}
                      />
                      {errors.priceAmount && <p className="text-sm text-red-500 mt-1">{errors.priceAmount}</p>}
                    </div>
                  )}

                  <div>
                    <Label htmlFor="eventUrl">Event Website</Label>
                    <Input
                      id="eventUrl"
                      placeholder="https://yourevent.com"
                      value={formData.eventUrl}
                      onChange={(e) => handleInputChange("eventUrl", e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="registrationUrl">Registration URL</Label>
                    <Input
                      id="registrationUrl"
                      placeholder="https://registration-link.com"
                      value={formData.registrationUrl}
                      onChange={(e) => handleInputChange("registrationUrl", e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="coverImage">Cover Image URL</Label>
                    <Input
                      id="coverImage"
                      placeholder="https://image-url.com (optional)"
                      value={formData.coverImage}
                      onChange={(e) => handleInputChange("coverImage", e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="tags">Tags</Label>
                    <Input
                      id="tags"
                      placeholder="e.g., tech, startup, networking (comma separated)"
                      value={formData.tags}
                      onChange={(e) => handleInputChange("tags", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="flex justify-end space-x-4">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => navigate(-1)}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="min-w-[120px]"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </div>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Submit Event
                    </>
                  )}
                </Button>
              </div>

              {/* Info Note */}
              <div className="glass-card p-4 bg-blue-50/50 border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> All events are reviewed by our team before being published. 
                  This process typically takes 1-2 business days. You'll receive an email notification 
                  once your event is approved or if we need additional information.
                </p>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default SubmitEvent;