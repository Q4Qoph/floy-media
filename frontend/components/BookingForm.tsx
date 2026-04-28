'use client';

import { useState } from 'react';
import { useCreateBooking } from '@/lib/hooks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
interface BookingFormProps {
  onSuccess?: () => void;
}

export default function BookingForm({ onSuccess }: BookingFormProps) {
  const createBooking = useCreateBooking();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    serviceType: '',
    message: '',
    budget: '',
    timeline: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      // Validate required fields
      if (!formData.name || !formData.email || !formData.phone || !formData.serviceType) {
        throw new Error('Please fill in all required fields');
      }

      const response = await createBooking.mutateAsync({
        fullName: formData.name,
        phoneNumber: formData.phone,
        email: formData.email,
        serviceRequired: formData.serviceType,
        budgetRange: formData.budget || undefined,
        message: formData.message || undefined,
      });

      if (response.success) {
        setSuccess(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          serviceType: '',
          message: '',
          budget: '',
          timeline: '',
        });

        if (onSuccess) {
          setTimeout(onSuccess, 2000);
        }
      } else {
        throw new Error(response.message || 'Booking failed');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit booking';
      setError(errorMessage);
      console.error('[v0] Booking error:', err);
    }
  };

  if (success) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-center">
        <h3 className="font-semibold text-green-900 mb-2">Booking Submitted!</h3>
        <p className="text-sm text-green-700">
          Thank you for your interest. We&apos;ll be in touch within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium">
            Full Name *
          </label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Your name"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={createBooking.isPending}
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium">
            Email Address *
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="your@email.com"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={createBooking.isPending}
          />
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <label htmlFor="phone" className="block text-sm font-medium">
            Phone Number *
          </label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="+1 (000) 000-0000"
            value={formData.phone}
            onChange={handleChange}
            required
            disabled={createBooking.isPending}
          />
        </div>

        {/* Service Type */}
        <div className="space-y-2">
          <label htmlFor="serviceType" className="block text-sm font-medium">
            Service Type *
          </label>
          <Select
            value={formData.serviceType}
            onValueChange={(value) => handleSelectChange('serviceType', value)}
            disabled={createBooking.isPending}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a service" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="photography">Photography</SelectItem>
              <SelectItem value="videography">Videography</SelectItem>
              <SelectItem value="editing">Video Editing</SelectItem>
              <SelectItem value="drone">Drone Services</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Budget */}
        <div className="space-y-2">
          <label htmlFor="budget" className="block text-sm font-medium">
            Budget Range
          </label>
          <Select
            value={formData.budget}
            onValueChange={(value) => handleSelectChange('budget', value)}
            disabled={createBooking.isPending}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select budget range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="under-5k">Under $5,000</SelectItem>
              <SelectItem value="5k-10k">$5,000 - $10,000</SelectItem>
              <SelectItem value="10k-25k">$10,000 - $25,000</SelectItem>
              <SelectItem value="25k-plus">$25,000+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Timeline */}
        <div className="space-y-2">
          <label htmlFor="timeline" className="block text-sm font-medium">
            Project Timeline
          </label>
          <Select
            value={formData.timeline}
            onValueChange={(value) => handleSelectChange('timeline', value)}
            disabled={createBooking.isPending}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select timeline" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="urgent">Urgent (1-2 weeks)</SelectItem>
              <SelectItem value="soon">Soon (2-4 weeks)</SelectItem>
              <SelectItem value="flexible">Flexible (1-3 months)</SelectItem>
              <SelectItem value="planning">Planning (3+ months)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Message */}
      <div className="space-y-2">
        <label htmlFor="message" className="block text-sm font-medium">
          Project Details
        </label>
        <Textarea
          id="message"
          name="message"
          placeholder="Tell us about your project, vision, and any specific requirements..."
          value={formData.message}
          onChange={handleChange}
          disabled={createBooking.isPending}
          className="min-h-32"
        />
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={createBooking.isPending}
        className="w-full"
        size="lg"
      >
        {createBooking.isPending ? 'Submitting...' : 'Submit Booking Request'}
      </Button>

      <p className="text-xs text-foreground/60 text-center">
        * Required fields. We&apos;ll respond to your inquiry within 24 hours.
      </p>
    </form>
  );
}
