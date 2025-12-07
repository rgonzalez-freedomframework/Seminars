'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

type Props = {
  triggerText?: string;
  triggerClassName?: string;
};

const GeneralRegistrationForm = ({ triggerText = "Get Started", triggerClassName }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleGetStarted = () => {
    setIsOpen(false);
    router.push('/sign-up');
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
            Welcome to Freedom Framework
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <p className="text-center text-muted-foreground">
            Get instant access to exclusive webinars and resources to transform your law firm
          </p>
          
          <div className="space-y-3">
            <Button
              onClick={handleGetStarted}
              className="w-full bg-[#CCA43B] hover:bg-[#CCA43B]/90 text-[#1D2A38] font-semibold text-lg py-6"
            >
              Continue with Email or Google
            </Button>
            
            <p className="text-xs text-center text-muted-foreground">
              By continuing, you'll be able to:
            </p>
            <ul className="text-sm text-muted-foreground space-y-2 pl-6">
              <li>✓ Access all webinars and recordings</li>
              <li>✓ Download exclusive resources</li>
              <li>✓ Track your progress through the Freedom Framework</li>
              <li>✓ Get personalized recommendations</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GeneralRegistrationForm;
