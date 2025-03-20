import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Shield, Clock, Users, Star, ArrowRight, Phone, Mail, MapPin } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">

      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted/30">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  Connecting Care, <span className="text-primary">Enhancing Lives</span>
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  CareLink bridges the gap between patients and healthcare providers, ensuring seamless, personalized
                  care when you need it most.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button size="lg" className="px-8">
                  Get Started
                </Button>
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Shield className="h-4 w-4 text-primary" />
                  <span>HIPAA Compliant</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>24/7 Support</span>
                </div>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <img
                src="/placeholder.svg?height=550&width=550"
                alt="CareLink Platform"
                className="rounded-lg object-cover shadow-xl"
                width={550}
                height={550}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">Features</div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Comprehensive Healthcare Solutions</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                CareLink offers a suite of features designed to improve patient care and streamline healthcare delivery.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
            {[
              {
                icon: <Users className="h-10 w-10 text-primary" />,
                title: "Patient Portal",
                description: "Secure access to medical records, appointments, and communication with your care team.",
              },
              {
                icon: <Clock className="h-10 w-10 text-primary" />,
                title: "24/7 Telehealth",
                description: "Connect with healthcare providers anytime, anywhere through secure video consultations.",
              },
              {
                icon: <Shield className="h-10 w-10 text-primary" />,
                title: "Secure Messaging",
                description: "HIPAA-compliant messaging between patients and healthcare providers.",
              },
              {
                icon: <Heart className="h-10 w-10 text-primary" />,
                title: "Health Monitoring",
                description: "Track vital signs and health metrics with seamless device integration.",
              },
              {
                icon: <Mail className="h-10 w-10 text-primary" />,
                title: "Appointment Reminders",
                description: "Automated notifications to ensure you never miss an important appointment.",
              },
              {
                icon: <ArrowRight className="h-10 w-10 text-primary" />,
                title: "Care Coordination",
                description: "Streamlined communication between specialists for comprehensive care.",
              },
            ].map((feature, index) => (
              <Card key={index} className="flex flex-col items-center text-center p-2">
                <CardContent className="flex flex-col items-center space-y-4 p-6">
                  <div className="rounded-full bg-primary/10 p-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">Testimonials</div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Trusted by Patients and Providers</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Hear what our users have to say about their experience with CareLink.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
            {[
              {
                quote:
                  "CareLink has transformed how I manage my chronic condition. The ability to message my doctor and track my health metrics in one place is invaluable.",
                name: "Sarah Johnson",
                role: "Patient",
                rating: 5,
              },
              {
                quote:
                  "As a healthcare provider, CareLink has streamlined my workflow and improved patient communication. The secure messaging feature saves time for both me and my patients.",
                name: "Dr. Michael Chen",
                role: "Cardiologist",
                rating: 5,
              },
              {
                quote:
                  "The telehealth feature has been a game-changer for our rural community. Access to specialists without the long drive has made a huge difference.",
                name: "Robert Williams",
                role: "Patient",
                rating: 4,
              },
            ].map((testimonial, index) => (
              <Card key={index} className="flex flex-col justify-between">
                <CardContent className="flex flex-col space-y-4 p-6">
                  <div className="flex space-x-1">
                    {Array(testimonial.rating)
                      .fill(0)
                      .map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                      ))}
                  </div>
                  <p className="flex-1 text-muted-foreground">&quot;{testimonial.quote}&quot;</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex justify-center lg:justify-start">
              <img
                src="/placeholder.svg?height=500&width=500"
                alt="CareLink Team"
                className="rounded-lg object-cover shadow-xl"
                width={500}
                height={500}
              />
            </div>
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">About Us</div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Our Mission and Vision</h2>
                <p className="text-muted-foreground md:text-xl/relaxed">
                  Founded in 2018, CareLink was born from a simple idea: healthcare should be accessible, coordinated,
                  and patient-centered. Our team of healthcare professionals and technology experts work together to
                  create solutions that bridge gaps in care delivery.
                </p>
                <p className="text-muted-foreground md:text-xl/relaxed">
                  We believe in a future where technology enhances the human connection in healthcare, rather than
                  replacing it. Our platform is designed to give providers more time with patients and give patients
                  more control over their health journey.
                </p>
              </div>
              <div>
                <Button variant="outline" className="flex items-center gap-2">
                  Learn More About Our Story <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact/CTA Section */}
      <section id="contact" className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Ready to Transform Your Healthcare Experience?
              </h2>
              <p className="max-w-[900px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join thousands of patients and providers who are already benefiting from CareLink.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
            <Link href="sign-up">
              <Button size="lg" variant="secondary" className="px-8">
                Get Started
              </Button>
            </Link>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 mt-12">
            <div className="flex flex-col items-center space-y-2 text-center">
              <Phone className="h-8 w-8" />
              <h3 className="text-xl font-bold">Call Us</h3>
              <p>(800) 123-4567</p>
              <p className="text-sm">Mon-Fri: 8am-8pm EST</p>
            </div>
            <div className="flex flex-col items-center space-y-2 text-center">
              <Mail className="h-8 w-8" />
              <h3 className="text-xl font-bold">Email Us</h3>
              <p>support@carelink.com</p>
              <p className="text-sm">We respond within 24 hours</p>
            </div>
            <div className="flex flex-col items-center space-y-2 text-center">
              <MapPin className="h-8 w-8" />
              <h3 className="text-xl font-bold">Visit Us</h3>
              <p>123 Health Avenue</p>
              <p className="text-sm">Boston, MA 02110</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

