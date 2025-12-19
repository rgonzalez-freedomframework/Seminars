"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { WebinarStatusEnum } from "@prisma/client";
import { registerAttendee } from "@/actions/attendance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Calendar, Clock, PlayCircle, Loader2 } from "lucide-react";
import { WebinarCardDate, WebinarCardTime } from "./WebinarCardDateTimeClient";
import { toast } from "sonner";

type AvailableWebinarCardProps = {
  webinar: {
    id: string;
    title: string;
    description: string | null;
    startTime: string | Date;
    duration: number | null;
    thumbnail: string | null;
    webinarStatus: WebinarStatusEnum;
    zoomJoinUrl: string | null;
    _count: {
      attendances: number;
    };
    isRegistered: boolean;
    seatsRemaining: number | null;
    seatsTotal: number | null;
  };
  currentUserId: string;
  defaultName?: string | null;
  defaultEmail?: string | null;
};

const AvailableWebinarCard: React.FC<AvailableWebinarCardProps> = ({
  webinar,
  currentUserId,
  defaultName,
  defaultEmail,
}) => {
  const router = useRouter();
  const isEnded = webinar.webinarStatus === WebinarStatusEnum.ENDED;
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(defaultName || "");
  const [email, setEmail] = useState(defaultEmail || "");
  const [phone, setPhone] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const isSoldOut =
    !webinar.isRegistered &&
    typeof webinar.seatsRemaining === "number" &&
    webinar.seatsRemaining <= 0 &&
    typeof webinar.seatsTotal === "number";

  // If the user is already registered for this webinar, show a simple
  // "View Webinar" card that navigates directly without reopening the modal.
  if (webinar.isRegistered) {
    return (
      <Card
        className={`h-full hover:shadow-lg transition-shadow cursor-pointer border-2 border-[#CCA43B] bg-white ${
          isEnded ? "opacity-90 hover:opacity-100" : ""
        }`}
        onClick={() => router.push(`/live-webinar/${webinar.id}`)}
      >
        {webinar.thumbnail && (
          <div className="w-full h-48 overflow-hidden rounded-t-lg relative">
            <img
              src={webinar.thumbnail}
              alt={webinar.title}
              className="w-full h-full object-cover"
            />
            {isEnded && (
              <div className="absolute top-4 left-4">
                <Badge className="bg-black/70 text-white">Past Webinar</Badge>
              </div>
            )}
            {webinar.webinarStatus === WebinarStatusEnum.LIVE && (
              <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
                <Badge className="bg-red-600 text-white">
                  <span className="mr-1 h-2 w-2 bg-white rounded-full animate-pulse"></span>
                  LIVE NOW
                </Badge>
                <Badge variant="outline" className="bg-white/90 text-[#1D2A38] border-[#CCA43B]">
                  Registered
                </Badge>
              </div>
            )}
            {webinar.webinarStatus !== WebinarStatusEnum.LIVE && (
              <div className="absolute top-4 right-4">
                <Badge variant="outline" className="bg-white/90 text-[#1D2A38] border-[#CCA43B]">
                  Registered
                </Badge>
              </div>
            )}
          </div>
        )}
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <Badge
              variant={
                webinar.webinarStatus === WebinarStatusEnum.LIVE
                  ? "destructive"
                  : "secondary"
              }
            >
              {isEnded ? "Completed" : webinar.webinarStatus}
            </Badge>
            {typeof webinar.seatsRemaining === "number" &&
              typeof webinar.seatsTotal === "number" &&
              webinar.seatsTotal > 0 && (
                <div className="px-3 py-1 rounded-full text-xs font-semibold bg-[#1D2A38] text-white">
                  {webinar.seatsRemaining} seats left
                </div>
              )}
          </div>
          <CardTitle className="line-clamp-2 text-[#1D2A38]">
            {webinar.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4 line-clamp-2">
            {webinar.description || "Join this exclusive webinar"}
          </p>
          <div className="space-y-2 text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <WebinarCardDate startTime={webinar.startTime} />
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <WebinarCardTime
                startTime={webinar.startTime}
                duration={webinar.duration || undefined}
              />
            </div>
          </div>
          <Button className="w-full bg-[#1D2A38] hover:bg-[#1D2A38]/90 text-white font-semibold transition-all" variant="default">
            <PlayCircle className="w-4 h-4 mr-2" />
            {isEnded ? 'View Replay' : 'View Webinar'}
          </Button>
        </CardContent>
      </Card>
    );
  }

  // If not registered and sold out, show a non-clickable Sold Out card
  if (isSoldOut) {
    return (
      <Card className="h-full hover:shadow-lg transition-shadow border-2 border-red-300 bg-white relative">
        {webinar.thumbnail && (
          <div className="w-full h-48 overflow-hidden rounded-t-lg relative">
            <img
              src={webinar.thumbnail}
              alt={webinar.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="px-4 py-1 rounded-full bg-red-600 text-white text-xs font-semibold uppercase tracking-wide">
                Sold Out
              </span>
            </div>
          </div>
        )}
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <Badge
              variant={
                webinar.webinarStatus === WebinarStatusEnum.LIVE
                  ? "destructive"
                  : "secondary"
              }
            >
              {webinar.webinarStatus}
            </Badge>
            {typeof webinar.seatsRemaining === "number" &&
              typeof webinar.seatsTotal === "number" &&
              webinar.seatsTotal > 0 && (
                <div className="px-3 py-1 rounded-full text-xs font-semibold bg-[#1D2A38] text-white">
                  {webinar.seatsRemaining} seats left
                </div>
              )}
          </div>
          <CardTitle className="line-clamp-2 text-[#1D2A38]">
            {webinar.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4 line-clamp-2">
            {webinar.description || "Join this exclusive webinar"}
          </p>
          <div className="space-y-2 text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <WebinarCardDate startTime={webinar.startTime} />
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <WebinarCardTime
                startTime={webinar.startTime}
                duration={webinar.duration || undefined}
              />
            </div>
          </div>
          <Button
            className="w-full bg-gray-300 text-gray-600 font-semibold cursor-not-allowed"
            variant="default"
            disabled
          >
            Sold Out
          </Button>
        </CardContent>
      </Card>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error("Name and email are required");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await registerAttendee({
        webinarId: webinar.id,
        email,
        name,
        phone,
        businessName,
        description,
        userId: currentUserId,
      });

      if (!res.success) {
        if (res.status === 409) {
          toast.error(res.message || "This webinar is sold out.");
          setSubmitted(false);
          setIsOpen(false);
          router.refresh();
          return;
        }

        throw new Error(res.message || "Something went wrong!");
      }

      toast.success(res.message || "Successfully registered for webinar");

      setSubmitted(true);

      // Instead of relying on a transient confirmation popup that can be
      // interrupted by page refreshes, send the user directly to the
      // webinar page where all details and the Zoom link are always
      // available and can be revisited.
      setIsOpen(false);
      router.push(`/live-webinar/${webinar.id}`);
    } catch (error) {
      console.error("Error submitting registration form:", error);
      toast.error(error instanceof Error ? error.message : "Something went wrong!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer border-2 border-gray-300 bg-white hover:border-[#CCA43B]">
          {webinar.thumbnail && (
            <div className="w-full h-48 overflow-hidden rounded-t-lg relative">
              <img
                src={webinar.thumbnail}
                alt={webinar.title}
                className="w-full h-full object-cover"
              />
              {webinar.webinarStatus === WebinarStatusEnum.LIVE && (
                <div className="absolute top-4 right-4">
                  <Badge className="bg-red-600 text-white">
                    <span className="mr-1 h-2 w-2 bg-white rounded-full animate-pulse"></span>
                    LIVE NOW
                  </Badge>
                </div>
              )}
            </div>
          )}
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <Badge
                variant={
                  webinar.webinarStatus === WebinarStatusEnum.LIVE
                    ? "destructive"
                    : "secondary"
                }
              >
                {webinar.webinarStatus}
              </Badge>
              {typeof webinar.seatsRemaining === "number" &&
                typeof webinar.seatsTotal === "number" &&
                webinar.seatsTotal > 0 && (
                  <div className="px-3 py-1 rounded-full text-xs font-semibold bg-[#1D2A38] text-white">
                    {webinar.seatsRemaining} seats left
                  </div>
                )}
            </div>
            <CardTitle className="line-clamp-2 text-[#1D2A38]">
              {webinar.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4 line-clamp-2">
              {webinar.description || "Join this exclusive webinar"}
            </p>
            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <WebinarCardDate startTime={webinar.startTime} />
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <WebinarCardTime
                  startTime={webinar.startTime}
                  duration={webinar.duration || undefined}
                />
              </div>
            </div>
            <Button className="w-full bg-[#CCA43B] hover:bg-[#CCA43B]/90 text-[#1D2A38] font-semibold transition-all" variant="default">
              <PlayCircle className="w-4 h-4 mr-2" />
              Register
            </Button>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="border-0 bg-transparent" isHideCloseButton={true}>
        <DialogHeader className="justify-center items-center border-2 border-[#CCA43B] rounded-xl p-6 bg-white shadow-xl text-[#1D2A38] max-w-lg mx-auto">
          <DialogTitle className="text-center text-xl font-bold text-[#1D2A38] mb-4">
            {showConfirmation ? "You're registered for this webinar" : "Register for this webinar"}
          </DialogTitle>

          {showConfirmation ? (
            <div className="w-full space-y-5 text-center">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-[#1D2A38]/80 uppercase tracking-[0.18em]">
                  Your seat is confirmed
                </p>
                <p className="text-lg font-semibold text-[#1D2A38]">
                  {webinar.title}
                </p>
              </div>

              <div className="rounded-2xl bg-[#F6F7F4] border border-[#1D2A38]/15 px-4 py-3 text-sm text-[#1D2A38]/90 flex flex-col gap-2 items-center">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <WebinarCardDate startTime={webinar.startTime} />
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <WebinarCardTime
                    startTime={webinar.startTime}
                    duration={webinar.duration || undefined}
                  />
                </div>
              </div>

              {webinar.zoomJoinUrl ? (
                <div className="space-y-2 text-sm text-[#1D2A38]/90">
                  <p>
                    We've also registered you with Zoom. You can join directly
                    using the link below or from the email Zoom sends you.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                      className="flex-1 bg-gradient-to-r from-[#CCA43B] to-[#B8932F] hover:from-[#B8932F] hover:to-[#CCA43B] text-[#1D2A38] font-semibold border-2 border-[#CCA43B] rounded-xl"
                      onClick={() => {
                        window.open(webinar.zoomJoinUrl as string, "_blank");
                      }}
                    >
                      Open Zoom Link
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 !border-2 !border-[#1D2A38]/40 !bg-[#F6F7F4] !text-[#1D2A38] hover:!bg-[#1D2A38]/5"
                      onClick={() => {
                        navigator.clipboard.writeText(webinar.zoomJoinUrl as string).catch(() => {});
                      }}
                    >
                      Copy Join Link
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-[#1D2A38]/80">
                  We've registered you for this session. You'll receive an email
                  with your calendar invite and join details.
                </p>
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button
                  className="flex-1 bg-[#1D2A38] hover:bg-[#1D2A38]/90 text-white font-semibold rounded-xl"
                  onClick={() => {
                    setIsOpen(false);
                    router.push(`/live-webinar/${webinar.id}`);
                  }}
                >
                  View Webinar Page
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 !border-2 !border-[#1D2A38]/40 !bg-[#F6F7F4] !text-[#1D2A38] hover:!bg-[#1D2A38]/5"
                  onClick={() => {
                    setIsOpen(false);
                    router.push("/home");
                  }}
                >
                  Go to Dashboard
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
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
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#CCA43B] to-[#B8932F] hover:from-[#B8932F] hover:to-[#CCA43B] text-[#1D2A38] font-bold border-2 border-[#CCA43B] rounded-xl"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin mr-2" />
                    Registering...
                  </>
                ) : (
                  "Register"
                )}
              </Button>
            </form>
          )}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default AvailableWebinarCard;
