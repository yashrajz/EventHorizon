import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import SEO from "@/components/SEO";
import { motion } from "framer-motion";
import { Calendar, MapPin, Clock, Users, Link as LinkIcon, DollarSign, FileText } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import ClickSpark from "@/components/ClickSpark";
import { useAdminData } from "@/contexts/AdminDataContext";
import { ScrollToTopButton } from "@/components/ScrollToTopButton";
import { ScrollToBottomButton } from "@/components/ScrollToBottomButton";
// Select component for dropdowns
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SubmitEvent = () => {
  const navigate = useNavigate();
  const { createEvent } = useAdminData();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    date: "",
    startTime: "",
    endTime: "",
    timezone: "IST",
    locationType: "",
    venue: "",
    city: "",
    country: "",
    price: "",
    priceAmount: "",
    registrationUrl: "",
    coverImageUrl: "",
    organizer: "",
    estimatedAttendees: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Create event with draft status for admin review
    // Don't include id, createdAt, updatedAt - createEvent generates these
    const eventData = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
      timezone: formData.timezone,
      locationType: formData.locationType as "online" | "offline" | "hybrid",
      venue: formData.venue || undefined,
      city: formData.city || undefined,
      country: formData.country || undefined,
      bannerImage: formData.coverImageUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
      status: "draft" as const, // Submitted events start as draft for admin review
      organizer: formData.organizer,
      tags: formData.category ? [formData.category] : [],
      ticketTypes: formData.price === "free" ? [
        {
          id: "free-1",
          name: "Free Entry",
          price: 0,
          type: "free" as const,
          available: parseInt(formData.estimatedAttendees) || 100,
          total: parseInt(formData.estimatedAttendees) || 100,
        }
      ] : [
        {
          id: "paid-1",
          name: "General Admission",
          price: parseFloat(formData.priceAmount) || 0,
          type: "paid" as const,
          available: parseInt(formData.estimatedAttendees) || 100,
          total: parseInt(formData.estimatedAttendees) || 100,
        }
      ],
      views: 0,
      registrationUrl: formData.registrationUrl || undefined,
    };

    // Save to admin data context (id, createdAt, updatedAt, registrations auto-generated)
    createEvent(eventData);
    
    toast.success("Event submitted successfully! Admins will review it shortly.", {
      description: "You'll be notified once your event is published."
    });
    
    navigate("/");
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <ClickSpark 
      sparkColor="#6b7280" 
      sparkSize={12} 
      sparkRadius={20} 
      sparkCount={10} 
      duration={500}
    >
      <SEO 
        title="Submit Event"
        description="Submit your startup event to EventHorizon and reach thousands of founders, investors, and builders worldwide."
        url={`${window.location.origin}/submit-event`}
      />
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1 pt-32 pb-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">
                Submit Your <span className="text-accent">Event</span>
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Share your event with our community of founders, investors, and builders. 
                We'll review your submission and publish it within 24 hours.
              </p>
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="glass rounded-3xl p-8 sm:p-12"
            >
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Information */}
                <div className="space-y-6">
                  <h2 className="font-display text-2xl font-bold flex items-center gap-2">
                    <FileText className="h-6 w-6 text-accent" />
                    Basic Information
                  </h2>

                  <div className="space-y-2">
                    <Label htmlFor="title">Event Title *</Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="e.g., TechCrunch Disrupt 2025"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      className="bg-muted/50 border-glass-border"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Tell us about your event..."
                      value={formData.description}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="bg-muted/50 border-glass-border resize-none"
                    />
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => handleSelectChange("category", value)}
                        required
                      >
                        <SelectTrigger className="bg-muted/50 border-glass-border">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Conference">Conference</SelectItem>
                          <SelectItem value="Meetup">Meetup</SelectItem>
                          <SelectItem value="Workshop">Workshop</SelectItem>
                          <SelectItem value="Pitch Competition">Pitch Competition</SelectItem>
                          <SelectItem value="Networking">Networking</SelectItem>
                          <SelectItem value="Hackathon">Hackathon</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="organizer">Organizer *</Label>
                      <Input
                        id="organizer"
                        name="organizer"
                        placeholder="Your company/organization"
                        value={formData.organizer}
                        onChange={handleChange}
                        required
                        className="bg-muted/50 border-glass-border"
                      />
                    </div>
                  </div>
                </div>

                {/* Date & Time */}
                <div className="space-y-6">
                  <h2 className="font-display text-2xl font-bold flex items-center gap-2">
                    <Calendar className="h-6 w-6 text-accent" />
                    Date & Time
                  </h2>

                  <div className="grid gap-6 sm:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="date">Date *</Label>
                      <Input
                        id="date"
                        name="date"
                        type="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                        className="bg-muted/50 border-glass-border"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="startTime">Start Time *</Label>
                      <Input
                        id="startTime"
                        name="startTime"
                        type="time"
                        value={formData.startTime}
                        onChange={handleChange}
                        required
                        className="bg-muted/50 border-glass-border"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="endTime">End Time *</Label>
                      <Input
                        id="endTime"
                        name="endTime"
                        type="time"
                        value={formData.endTime}
                        onChange={handleChange}
                        required
                        className="bg-muted/50 border-glass-border"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select
                      value={formData.timezone}
                      onValueChange={(value) => handleSelectChange("timezone", value)}
                    >
                      <SelectTrigger className="bg-muted/50 border-glass-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="IST">IST (Indian Standard Time)</SelectItem>
                        <SelectItem value="PST">PST (Pacific Standard Time)</SelectItem>
                        <SelectItem value="EST">EST (Eastern Standard Time)</SelectItem>
                        <SelectItem value="GMT">GMT (Greenwich Mean Time)</SelectItem>
                        <SelectItem value="CET">CET (Central European Time)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-6">
                  <h2 className="font-display text-2xl font-bold flex items-center gap-2">
                    <MapPin className="h-6 w-6 text-accent" />
                    Location
                  </h2>

                  <div className="space-y-2">
                    <Label htmlFor="locationType">Location Type *</Label>
                    <Select
                      value={formData.locationType}
                      onValueChange={(value) => handleSelectChange("locationType", value)}
                      required
                    >
                      <SelectTrigger className="bg-muted/50 border-glass-border">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="In-Person">In-Person</SelectItem>
                        <SelectItem value="Online">Online</SelectItem>
                        <SelectItem value="Hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {(formData.locationType === "In-Person" || formData.locationType === "Hybrid") && (
                    <div className="grid gap-6 sm:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor="venue">Venue</Label>
                        <Input
                          id="venue"
                          name="venue"
                          placeholder="Venue name"
                          value={formData.venue}
                          onChange={handleChange}
                          className="bg-muted/50 border-glass-border"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          name="city"
                          placeholder="e.g., Bangalore"
                          value={formData.city}
                          onChange={handleChange}
                          required
                          className="bg-muted/50 border-glass-border"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="country">Country *</Label>
                        <Input
                          id="country"
                          name="country"
                          placeholder="e.g., India"
                          value={formData.country}
                          onChange={handleChange}
                          required
                          className="bg-muted/50 border-glass-border"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Pricing & Registration */}
                <div className="space-y-6">
                  <h2 className="font-display text-2xl font-bold flex items-center gap-2">
                    <DollarSign className="h-6 w-6 text-accent" />
                    Pricing & Registration
                  </h2>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="price">Price Type *</Label>
                      <Select
                        value={formData.price}
                        onValueChange={(value) => handleSelectChange("price", value)}
                        required
                      >
                        <SelectTrigger className="bg-muted/50 border-glass-border">
                          <SelectValue placeholder="Select price type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Free">Free</SelectItem>
                          <SelectItem value="Paid">Paid</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {formData.price === "Paid" && (
                      <div className="space-y-2">
                        <Label htmlFor="priceAmount">Price Amount</Label>
                        <Input
                          id="priceAmount"
                          name="priceAmount"
                          placeholder="e.g., ₹500 or $50"
                          value={formData.priceAmount}
                          onChange={handleChange}
                          className="bg-muted/50 border-glass-border"
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="registrationUrl">Registration URL *</Label>
                    <div className="relative">
                      <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="registrationUrl"
                        name="registrationUrl"
                        type="url"
                        placeholder="https://your-event-registration-link.com"
                        value={formData.registrationUrl}
                        onChange={handleChange}
                        required
                        className="pl-11 bg-muted/50 border-glass-border"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="coverImageUrl">Cover Image URL</Label>
                    <Input
                      id="coverImageUrl"
                      name="coverImageUrl"
                      type="url"
                      placeholder="https://your-event-image.com/image.jpg"
                      value={formData.coverImageUrl}
                      onChange={handleChange}
                      className="bg-muted/50 border-glass-border"
                    />
                    <p className="text-xs text-muted-foreground">
                      Recommended size: 1200x630px. Use Unsplash or upload to Imgur.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="estimatedAttendees">Expected Attendees</Label>
                    <Input
                      id="estimatedAttendees"
                      name="estimatedAttendees"
                      type="number"
                      placeholder="e.g., 500"
                      value={formData.estimatedAttendees}
                      onChange={handleChange}
                      className="bg-muted/50 border-glass-border"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-12 py-6 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold rounded-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Event for Review"}
                  </Button>
                  <p className="mt-4 text-sm text-muted-foreground">
                    * Required fields. We'll review your submission within 24 hours.
                  </p>
                </div>
              </form>
            </motion.div>
          </div>
        </main>

        <Footer />
        <ScrollToTopButton />
        <ScrollToBottomButton />
      </div>
    </ClickSpark>
  );
};

export default SubmitEvent;
