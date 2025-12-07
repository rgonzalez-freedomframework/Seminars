'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

type Props = {
  triggerText?: string;
  triggerClassName?: string;
};

const GeneralRegistrationForm = ({ triggerText = "Get Started", triggerClassName }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    businessName: '',
    description: '',
  });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Store in localStorage for now (you can enhance this to store in DB)
      localStorage.setItem('attendeeInfo', JSON.stringify(formData));
      
      toast.success('Registration successful! Redirecting...');
      
      setTimeout(() => {
        setIsOpen(false);
        router.push('/home');
      }, 1500);
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className={triggerClassName || "bg-[#CCA43B] hover:bg-[#CCA43B]/90 text-[#1D2A38] font-semibold text-lg px-8 py-6"}
        >
          {triggerText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-white dark:bg-[#1D2A38] border-[#CCA43B]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-4">
            Register for Free Access
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="border-gray-300 dark:border-gray-600"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@lawfirm.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="border-gray-300 dark:border-gray-600"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1 (555) 123-4567"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="border-gray-300 dark:border-gray-600"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="businessName">Law Firm Name</Label>
            <Input
              id="businessName"
              type="text"
              placeholder="Your Law Firm LLC"
              value={formData.businessName}
              onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
              className="border-gray-300 dark:border-gray-600"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">What are you looking to achieve?</Label>
            <Input
              id="description"
              type="text"
              placeholder="Tell us about your goals..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="border-gray-300 dark:border-gray-600"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-[#CCA43B] hover:bg-[#CCA43B]/90 text-[#1D2A38] font-semibold"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin mr-2" />
                Registering...
              </>
            ) : (
              'Complete Registration'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GeneralRegistrationForm;
