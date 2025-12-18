import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, X, CheckCircle2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ApplicationData {
  timestamp: number;
  count: number;
}

const STORAGE_KEY = "career_applications";
const MAX_APPLICATIONS = 3;
const TIME_WINDOW = 72 * 60 * 60 * 1000; // 72 hours in milliseconds
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
];

interface JobApplicationFormProps {
  selectedPosition?: string;
}

export const JobApplicationForm = ({ selectedPosition = "" }: JobApplicationFormProps) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    age: "",
    designation: selectedPosition,
    experience: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Update designation when selectedPosition changes
  useEffect(() => {
    if (selectedPosition) {
      setFormData(prev => ({ ...prev, designation: selectedPosition }));
    }
  }, [selectedPosition]);

  const getApplicationData = (): ApplicationData => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      return { timestamp: Date.now(), count: 0 };
    }
    return JSON.parse(data);
  };

  const checkApplicationLimit = (): { canApply: boolean; remaining: number; resetTime?: string } => {
    const data = getApplicationData();
    const now = Date.now();
    const timeSinceFirst = now - data.timestamp;

    // If 72 hours have passed, reset the counter
    if (timeSinceFirst > TIME_WINDOW) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ timestamp: now, count: 0 }));
      return { canApply: true, remaining: MAX_APPLICATIONS };
    }

    // Check if user has reached the limit
    if (data.count >= MAX_APPLICATIONS) {
      const resetTime = new Date(data.timestamp + TIME_WINDOW);
      return {
        canApply: false,
        remaining: 0,
        resetTime: resetTime.toLocaleString(),
      };
    }

    return {
      canApply: true,
      remaining: MAX_APPLICATIONS - data.count,
    };
  };

  const incrementApplicationCount = () => {
    const data = getApplicationData();
    const now = Date.now();
    const timeSinceFirst = now - data.timestamp;

    if (timeSinceFirst > TIME_WINDOW) {
      // Reset if 72 hours have passed
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ timestamp: now, count: 1 }));
    } else {
      // Increment count
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ ...data, count: data.count + 1 })
      );
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.age.trim()) {
      newErrors.age = "Age is required";
    } else {
      const age = parseInt(formData.age);
      if (isNaN(age) || age < 11 || age > 70) {
        newErrors.age = "Please enter a valid age (11-70)";
      }
    }

    if (!formData.designation.trim()) {
      newErrors.designation = "Designation is required";
    }

    if (!formData.experience) {
      newErrors.experience = "Please select your experience level";
    }

    if (!selectedFile) {
      newErrors.file = "Please upload your resume";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF or Word document (.pdf, .doc, .docx)",
        variant: "destructive",
      });
      return;
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
    setErrors((prev) => ({ ...prev, file: "" }));
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check application limit
    const limitCheck = checkApplicationLimit();
    if (!limitCheck.canApply) {
      toast({
        title: "Application limit reached",
        description: `You've reached the maximum of ${MAX_APPLICATIONS} applications. You can apply again after ${limitCheck.resetTime}`,
        variant: "destructive",
      });
      return;
    }

    // Validate form
    if (!validateForm()) {
      toast({
        title: "Please fix the errors",
        description: "Check all required fields and try again",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      // Increment application count
      incrementApplicationCount();

      toast({
        title: "Application submitted successfully!",
        description: `Thank you for applying! We'll review your application and get back to you soon. You have ${limitCheck.remaining - 1} application(s) remaining in the next 72 hours.`,
      });

      // Reset form
      setFormData({
        fullName: "",
        email: "",
        age: "",
        designation: "",
        experience: "",
      });
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setIsSubmitting(false);
    }, 1500);
  };

  const limitCheck = checkApplicationLimit();
  const fileExtension = selectedFile?.name.split(".").pop()?.toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="glass-card p-8"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Application Form</h2>
        <p className="text-muted-foreground">
          Fill out the form below to apply. {limitCheck.canApply && (
            <span className="text-primary font-medium">
              {limitCheck.remaining} application(s) remaining in the next 72 hours.
            </span>
          )}
        </p>
      </div>

      {!limitCheck.canApply && (
        <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-destructive">Application Limit Reached</p>
            <p className="text-sm text-muted-foreground mt-1">
              You've submitted {MAX_APPLICATIONS} applications. You can apply again after {limitCheck.resetTime}
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="fullName">
            Full Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="fullName"
            type="text"
            placeholder="John Doe"
            value={formData.fullName}
            onChange={(e) =>
              setFormData({ ...formData, fullName: e.target.value })
            }
            className={errors.fullName ? "border-destructive" : ""}
            disabled={!limitCheck.canApply}
          />
          {errors.fullName && (
            <p className="text-sm text-destructive">{errors.fullName}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">
            Email Address <span className="text-destructive">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="john.doe@example.com"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className={errors.email ? "border-destructive" : ""}
            disabled={!limitCheck.canApply}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email}</p>
          )}
        </div>

        {/* Age */}
        <div className="space-y-2">
          <Label htmlFor="age">
            Age <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <Input
              id="age"
              type="number"
              placeholder="25"
              min="11"
              max="70"
              value={formData.age}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '' || (parseInt(value) >= 11 && parseInt(value) <= 70)) {
                  setFormData({ ...formData, age: value });
                }
              }}
              className={`${errors.age ? "border-destructive" : ""} [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
              disabled={!limitCheck.canApply}
              style={{
                MozAppearance: 'textfield'
              } as React.CSSProperties}
            />
            <div className="absolute right-1 top-1/2 -translate-y-1/2 flex flex-col">
              <button
                type="button"
                onClick={() => {
                  const currentAge = parseInt(formData.age) || 11;
                  if (currentAge < 70) {
                    setFormData({ ...formData, age: (currentAge + 1).toString() });
                  }
                }}
                disabled={!limitCheck.canApply || parseInt(formData.age) >= 70}
                className="px-2 py-0.5 text-xs hover:bg-accent rounded-t transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ▲
              </button>
              <button
                type="button"
                onClick={() => {
                  const currentAge = parseInt(formData.age) || 11;
                  if (currentAge > 11) {
                    setFormData({ ...formData, age: (currentAge - 1).toString() });
                  }
                }}
                disabled={!limitCheck.canApply || parseInt(formData.age) <= 11}
                className="px-2 py-0.5 text-xs hover:bg-accent rounded-b transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ▼
              </button>
            </div>
          </div>
          {errors.age && (
            <p className="text-sm text-destructive">{errors.age}</p>
          )}
        </div>

        {/* Designation */}
        <div className="space-y-2">
          <Label htmlFor="designation">
            Designation/Position <span className="text-destructive">*</span>
          </Label>
          <Input
            id="designation"
            type="text"
            placeholder="e.g., Senior Full Stack Engineer"
            value={formData.designation}
            onChange={(e) =>
              setFormData({ ...formData, designation: e.target.value })
            }
            className={errors.designation ? "border-destructive" : ""}
            disabled={!limitCheck.canApply}
          />
          {errors.designation && (
            <p className="text-sm text-destructive">{errors.designation}</p>
          )}
          {selectedPosition && (
            <p className="text-xs text-muted-foreground">
              Applying for: <span className="text-primary font-medium">{selectedPosition}</span>
            </p>
          )}
        </div>

        {/* Experience */}
        <div className="space-y-2">
          <Label htmlFor="experience">
            Years of Experience <span className="text-destructive">*</span>
          </Label>
          <Select
            value={formData.experience}
            onValueChange={(value) =>
              setFormData({ ...formData, experience: value })
            }
            disabled={!limitCheck.canApply}
          >
            <SelectTrigger className={errors.experience ? "border-destructive" : ""}>
              <SelectValue placeholder="Select your experience level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="no-experience">No Experience</SelectItem>
              <SelectItem value="1-3-years">1-3 Years</SelectItem>
              <SelectItem value="3-5-years">3-5 Years</SelectItem>
              <SelectItem value="5-plus-years">More than 5 Years</SelectItem>
            </SelectContent>
          </Select>
          {errors.experience && (
            <p className="text-sm text-destructive">{errors.experience}</p>
          )}
        </div>

        {/* Resume Upload */}
        <div className="space-y-2">
          <Label htmlFor="resume">
            Upload Resume <span className="text-destructive">*</span>
          </Label>
          <div className="space-y-3">
            <div
              className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
                errors.file
                  ? "border-destructive"
                  : "border-glass-border hover:border-primary/50"
              } ${!limitCheck.canApply ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
              onClick={() => limitCheck.canApply && fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                id="resume"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
                disabled={!limitCheck.canApply}
              />
              <div className="flex flex-col items-center text-center">
                <Upload className="w-10 h-10 text-muted-foreground mb-3" />
                <p className="text-sm font-medium mb-1">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">
                  PDF or Word document (Max 5MB)
                </p>
              </div>
            </div>

            {/* Selected File Display */}
            <AnimatePresence>
              {selectedFile && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center justify-between p-4 rounded-lg bg-primary/10 border border-primary/20"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {fileExtension} • {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFile();
                    }}
                    className="flex-shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            {errors.file && (
              <p className="text-sm text-destructive">{errors.file}</p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={isSubmitting || !limitCheck.canApply}
        >
          {isSubmitting ? "Submitting..." : "Submit Application"}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          By submitting this form, you agree to our privacy policy and terms of service.
        </p>
      </form>
    </motion.div>
  );
};
