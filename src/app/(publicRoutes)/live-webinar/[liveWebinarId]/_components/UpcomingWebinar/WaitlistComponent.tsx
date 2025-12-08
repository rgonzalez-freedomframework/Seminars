'use client';

import { registerAttendee } from '@/actions/attendance';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useAttendeeStore } from '@/store/useAttendeeStore';
import { WebinarStatusEnum } from '@prisma/client';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'sonner';

type Props = {
  webinarId: string;
  webinarStatus: WebinarStatusEnum;
  onRegistered?: () => void;
};

const WaitlistComponent = ({
  webinarId,
  webinarStatus,
  onRegistered,
}: Props) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [description, setDescription] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { setAttendee } = useAttendeeStore();
  const router=useRouter()
    const buttonText = () => {
    switch (webinarStatus) {
        case WebinarStatusEnum.SCHEDULED:
        return 'Get Reminder';
        case WebinarStatusEnum.WAITING_ROOM:
        return 'Get Reminder';
        case WebinarStatusEnum.LIVE:
        return 'Join Webinar';
        default:
        return 'Register';
    }
    };
    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await registerAttendee({
        email,
        name,
        phone,
        businessName,
        description,
        webinarId,
      });

      if (!res.success) {
        throw new Error(res.message || 'Something went wrong!');
      }

      if (res.data?.user) {
        setAttendee({
          id: res.data.user.id,
          name: res.data.user.name,
          email: res.data.user.email,
          phone: res.data.user.phone,
          businessName: res.data.user.businessName,
          description: res.data.user.description,
          createdAt: new Date(),
          updatedAt: new Date(),
          callStatus: 'PENDING',
        })
      }
      toast.success(
      webinarStatus === WebinarStatusEnum.LIVE
        ? 'Successfully joined the webinar!'
        : 'Successfully registered for webinar'
    );
    setEmail('');
    setName('');
    setPhone('');
    setBusinessName('');
    setDescription('');
    setSubmitted(true);
    setTimeout(() => {
    setIsOpen(false);
    // If webinar is live, refresh the page to enter the livestream
    if (webinarStatus === WebinarStatusEnum.LIVE) {
      router.refresh();
    }
    if (onRegistered) {
      onRegistered();
    }
  }, 1500);
  } catch (error) {
    console.error('Error submitting waitlist form:', error);
    toast.error(error instanceof Error ? error.message : 'Something went wrong!');
  } finally {
    setIsSubmitting(false);
  }
}
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
    <DialogTrigger asChild>
        <Button
        className={`${
            webinarStatus === WebinarStatusEnum.LIVE
            ? 'bg-red-600 hover:bg-red-700 text-white'
            : 'bg-gradient-to-r from-[#CCA43B] to-[#B8932F] hover:from-[#B8932F] hover:to-[#CCA43B] text-[#1D2A38] border-2 border-[#CCA43B]'
        } rounded-xl px-6 py-3 text-sm font-bold shadow-lg`}
        >
        {webinarStatus === WebinarStatusEnum.LIVE && (
            <span className="mr-2 h-2 w-2 bg-white rounded-full animate-pulse"></span>
        )}
        {buttonText()}
        </Button>
    </DialogTrigger>
    <DialogContent  className="border-0 bg-transparent" isHideCloseButton={true}>
       <DialogHeader className="justify-center items-center border-2 border-[#CCA43B] rounded-xl p-6 bg-white shadow-xl">
      <DialogTitle className="text-center text-xl font-bold text-[#1D2A38] mb-4">
        {webinarStatus === WebinarStatusEnum.LIVE ? 'Join the Webinar' : 'Join the Waitlist'}
      </DialogTitle>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4 w-full'>
        {!submitted && (
        <React.Fragment>
          <Input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="tel"
            placeholder="Phone Number (Optional)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Business Name (Optional)"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Tell us about your needs (Optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </React.Fragment>
        
      )}
      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-[#CCA43B] to-[#B8932F] hover:from-[#B8932F] hover:to-[#CCA43B] text-[#1D2A38] font-bold border-2 border-[#CCA43B] rounded-xl"
        disabled={isSubmitting || submitted}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="animate-spin mr-2" />
            {webinarStatus === WebinarStatusEnum.LIVE ? 'Joining...' : 'Registering...'}
          </>
        ) : submitted ? (
          webinarStatus === WebinarStatusEnum.LIVE ? (
            "You're all set to join!"
          ) : (
            "You've successfully joined the waitlist!"
          )
        ) : webinarStatus === WebinarStatusEnum.LIVE ? (
          'Join Now'
        ) : (
          'Join Waitlist'
        )}
      </Button>
      </form>
    </DialogHeader>
    </DialogContent>
    </Dialog>
  );
};

export default WaitlistComponent;