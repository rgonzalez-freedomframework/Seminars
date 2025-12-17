import * as React from 'react'
import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'

type Props = {
  attendeeName: string
  webinarTitle: string
  startTimeFormatted: string
  timeZoneLabel?: string
  zoomJoinUrl?: string | null
  zoomPassword?: string | null
}

export const WebinarRegistrationConfirmation: React.FC<Props> = ({
  attendeeName,
  webinarTitle,
  startTimeFormatted,
  timeZoneLabel,
  zoomJoinUrl,
  zoomPassword,
}) => {
  const subtitle = startTimeFormatted

  return (
    <Html>
      <Head />
      <Preview>Your registration is confirmed: {webinarTitle}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={headerSection}>
            <Text style={eyebrow}>Freedom Framework™</Text>
            <Text style={h1}>You&apos;re registered</Text>
          </Section>

          <Section style={contentSection}>
            <Text style={paragraph}>Hi {attendeeName || 'there'},</Text>
            <Text style={paragraph}>
              Thanks for registering for <strong>{webinarTitle}</strong>. Your spot is confirmed. Below are the details to
              join the session.
            </Text>

            <Section style={infoCard}>
              <Text style={cardTitle}>Webinar details</Text>
              <Text style={cardItem}><strong>Title:</strong> {webinarTitle}</Text>
              <Text style={cardItem}><strong>Date &amp; time:</strong> {subtitle}</Text>
              {zoomJoinUrl && (
                <Text style={cardItem}>
                  <strong>Join link:</strong>{' '}
                  <Link href={zoomJoinUrl} style={link}>
                    {zoomJoinUrl}
                  </Link>
                </Text>
              )}
              {zoomPassword && (
                <Text style={cardItem}><strong>Passcode:</strong> {zoomPassword}</Text>
              )}
            </Section>

            {zoomJoinUrl && (
              <Section style={buttonSection}>
                <Button style={primaryButton} href={zoomJoinUrl}>
                  Join on Zoom
                </Button>
              </Section>
            )}

            <Text style={paragraph}>
              We recommend joining a few minutes early to make sure your audio and video are working smoothly.
            </Text>

            <Text style={paragraph}>
              If you have any questions before the session, just reply to this email.
            </Text>
          </Section>

          <Section style={footerSection}>
            <Text style={footerText}>
              You&apos;re receiving this email because you registered for a Freedom Framework webinar.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const body: React.CSSProperties = {
  backgroundColor: '#f5f5f7',
  fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
}

const container: React.CSSProperties = {
  maxWidth: '600px',
  margin: '0 auto',
  padding: '24px 16px',
}

const headerSection: React.CSSProperties = {
  textAlign: 'left',
  marginBottom: '8px',
}

const contentSection: React.CSSProperties = {
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  padding: '24px',
  boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)',
}

const footerSection: React.CSSProperties = {
  marginTop: '16px',
}

const eyebrow: React.CSSProperties = {
  fontSize: '11px',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  color: '#6b7280',
  marginBottom: '4px',
}

const h1: React.CSSProperties = {
  fontSize: '24px',
  fontWeight: 700,
  color: '#111827',
}

const paragraph: React.CSSProperties = {
  fontSize: '14px',
  lineHeight: 1.6,
  color: '#374151',
}

const infoCard: React.CSSProperties = {
  margin: '16px 0',
  padding: '12px 14px',
  borderRadius: '10px',
  backgroundColor: '#F6F7F4',
  border: '1px solid rgba(17, 24, 39, 0.06)',
}

const cardTitle: React.CSSProperties = {
  fontSize: '13px',
  fontWeight: 600,
  color: '#111827',
  marginBottom: '6px',
}

const cardItem: React.CSSProperties = {
  fontSize: '13px',
  color: '#374151',
  margin: '2px 0',
}

const buttonSection: React.CSSProperties = {
  textAlign: 'center',
  margin: '16px 0 8px',
}

const primaryButton: React.CSSProperties = {
  background: 'linear-gradient(to right, #CCA43B, #B8932F)',
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: 600,
  padding: '10px 20px',
  borderRadius: '999px',
  textDecoration: 'none',
  display: 'inline-block',
}

const link: React.CSSProperties = {
  color: '#2563eb',
  textDecoration: 'underline',
}

const footerText: React.CSSProperties = {
  fontSize: '11px',
  color: '#9ca3af',
  textAlign: 'center',
}

export default WebinarRegistrationConfirmation
