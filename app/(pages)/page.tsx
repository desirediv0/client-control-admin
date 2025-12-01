"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle,
  Database,
  Globe,
  Lock,
  Shield,
  Users,
  Star,
  BarChart,
  PhoneCall,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

export default function EnhancedLandingPage() {
  return (
    <div className="min-h-screen bg-white text-black">
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Shield className="h-8 w-8 text-black" />
              <span className="text-2xl font-bold text-black">ClientGuard</span>
            </div>
            <Link href={"/authenticate"}>
              <Button className="bg-black text-white hover:bg-gray-800">
                Join
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      <main>
        <section className="container mx-auto px-6 py-16 text-center">
          <motion.h1
            className="text-4xl md:text-6xl font-bold mb-6 text-black"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Revolutionize Your Agency&apos;s Client Management
          </motion.h1>
          <motion.p
            className="text-xl mb-8 text-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            ClientGuard empowers agencies to effortlessly manage multiple client
            websites, control access, track payments, and access databases - all
            from one intuitive dashboard.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-black text-white hover:bg-gray-800"
              >
                Start Free Trial
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto text-black border-black hover:bg-gray-100"
              >
                Schedule Demo
              </Button>
            </div>
          </motion.div>
        </section>

        <section id="features" className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12">
              Powerful Features for Modern Agencies
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Globe,
                  title: "Multi-Site Management",
                  description:
                    "Effortlessly manage multiple client websites from a single, intuitive dashboard.",
                },
                {
                  icon: Lock,
                  title: "Advanced Access Control",
                  description:
                    "Grant or revoke client site access with just a click, ensuring tight security.",
                },
                {
                  icon: BarChart,
                  title: "Automated Payment Tracking",
                  description:
                    "Monitor client payments, set up reminders, and automate invoicing processes.",
                },
                {
                  icon: Database,
                  title: "Secure Database Access",
                  description:
                    "Safely access and manage both MongoDB and PostgreSQL databases for all your clients.",
                },
                {
                  icon: Users,
                  title: "Comprehensive User Management",
                  description:
                    "Create and manage multiple user accounts with customizable permission levels.",
                },
                {
                  icon: CheckCircle,
                  title: "Real-time Site Health Monitoring",
                  description:
                    "Keep a constant eye on your clients' site performance, uptime, and security.",
                },
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full">
                    <CardHeader>
                      <feature.icon className="h-10 w-10 text-black mb-4" />
                      <CardTitle className="text-xl font-semibold">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-gray-700">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="py-16">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12">
              How ClientGuard Transforms Your Agency
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: 1,
                  title: "Seamless Integration",
                  description:
                    "Quickly connect your clients' websites to our secure dashboard with our easy-to-use API.",
                },
                {
                  step: 2,
                  title: "Centralized Management",
                  description:
                    "Monitor performance, manage access, handle payments, and access databases - all from one place.",
                },
                {
                  step: 3,
                  title: "Scale with Confidence",
                  description:
                    "Focus on growing your agency while ClientGuard handles the technical complexities of client management.",
                },
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                >
                  <div className="bg-black text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-700">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12">
              Flexible Pricing for Growing Agencies
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[
                {
                  name: "Free",
                  price: "₹0",
                  period: "forever",
                  features: [
                    "Up to 10 client sites",
                    "Basic access control",
                    "Payment tracking",
                    "Email support",
                  ],
                  cta: "Start Free",
                },
                {
                  name: "Pro",
                  price: "₹3,000",
                  period: "per month",
                  features: [
                    "Up to 50 client sites",
                    "Advanced access control",
                    "Automated payment system",
                    "Database access",
                    "Priority support",
                  ],
                  cta: "Upgrade to Pro",
                },
                {
                  name: "Custom",
                  price: "Custom",
                  period: "",
                  features: [
                    "Unlimited client sites",
                    "Custom integrations",
                    "Dedicated account manager",
                    "24/7 premium support",
                    "Tailored solutions",
                  ],
                  cta: "Contact Sales",
                },
              ].map((plan, index) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full flex flex-col border-2 border-black relative overflow-hidden">
                    {plan.name === "Pro" && (
                      <div className="absolute top-0 right-0 bg-black text-white px-3 py-1 text-sm font-semibold">
                        Most Popular
                      </div>
                    )}
                    <CardHeader className="text-center">
                      <CardTitle className="text-3xl font-bold">
                        {plan.name}
                      </CardTitle>
                      <CardDescription>
                        <span className="text-4xl font-bold text-black">
                          {plan.price}
                        </span>
                        {plan.period && (
                          <span className="text-gray-600">/{plan.period}</span>
                        )}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <ul className="space-y-4">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-center">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                            <span className="text-lg">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <div className="p-6 mt-auto">
                      <Button
                        className={`w-full text-lg py-6 ${
                          plan.name === "Pro"
                            ? "bg-black text-white hover:bg-gray-800"
                            : "bg-white text-black border-2 border-black hover:bg-gray-100"
                        }`}
                      >
                        {plan.cta}
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="testimonials" className="py-16">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12">
              What Our Clients Say
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: "Rajesh Kumar",
                  role: "CEO, TechSolutions India",
                  quote:
                    "ClientGuard has completely transformed our client management. It's a game-changer for any growing agency.",
                },
                {
                  name: "Priya Patel",
                  role: "Founder, WebWizards Mumbai",
                  quote:
                    "The ability to manage multiple client sites and databases from a single dashboard has saved us countless hours.",
                },
                {
                  name: "Amit Sharma",
                  role: "Operations Manager, DigitalDynamics Bangalore",
                  quote:
                    "ClientGuard's payment tracking feature has significantly improved our cash flow and client relationships.",
                },
              ].map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full">
                    <CardContent className="pt-6">
                      <div className="flex items-center mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="h-5 w-5 text-yellow-400 fill-current"
                          />
                        ))}
                      </div>
                      <p className="text-gray-700 mb-4">
                        &quot;{testimonial.quote}&quot;
                      </p>
                      <div>
                        <p className="font-semibold">{testimonial.name}</p>
                        <p className="text-sm text-gray-600">
                          {testimonial.role}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12">
              Frequently Asked Questions
            </h2>
            <Tabs defaultValue="general" className="w-full max-w-3xl mx-auto">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="technical">Technical</TabsTrigger>
                <TabsTrigger value="billing">Billing</TabsTrigger>
              </TabsList>
              <TabsContent value="general">
                <Card>
                  <CardHeader>
                    <CardTitle>General Questions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-semibold">What is ClientGuard?</h3>
                      <p className="text-gray-700">
                        ClientGuard is a comprehensive client management
                        platform designed specifically for agencies to manage
                        multiple client websites, control access, track
                        payments, and access databases from a single dashboard.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold">
                        How can ClientGuard benefit my agency?
                      </h3>
                      <p className="text-gray-700">
                        ClientGuard streamlines your agency&apos;s operations by
                        centralizing client management, automating payment
                        tracking, and providing secure access to client sites
                        and databases. This allows you to focus on growing your
                        business and delivering value to your clients.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="technical">
                <Card>
                  <CardHeader>
                    <CardTitle>Technical Questions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-semibold">
                        Is ClientGuar compatible with all types of websites?
                      </h3>
                      <p className="text-gray-700">
                        ClientGuard is designed to work with most modern web
                        technologies. It&apos;s compatible with websites built
                        on popular platforms like WordPress, Shopify, and custom
                        solutions using frameworks like React, Vue, or Angular.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold">
                        How secure is the database access feature?
                      </h3>
                      <p className="text-gray-700">
                        We implement industry-standard security measures,
                        including end-to-end encryption and multi-factor
                        authentication, to ensure that your clients&apos; data
                        remains secure. Our system also provides detailed access
                        logs for auditing purposes.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="billing">
                <Card>
                  <CardHeader>
                    <CardTitle>Billing Questions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-semibold">
                        How does the pricing work?
                      </h3>
                      <p className="text-gray-700">
                        Our pricing is based on the number of client sites you
                        manage and the features you need. We offer flexible
                        plans that can grow with your agency, from our Free plan
                        for small agencies to our customizable Enterprise
                        solutions.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold">
                        Is there a free trial available?
                      </h3>
                      <p className="text-gray-700">
                        Yes, we offer a 14-day free trial for our Pro plan. This
                        allows you to experience the full range of ClientGuard
                        features and see how it can benefit your agency before
                        committing to a subscription.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        <section className="py-16 bg-black text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Transform Your Agency&apos;s Operations?
            </h2>
            <p className="mb-8 text-xl">
              Join thousands of successful agencies already using ClientGuard to
              streamline their client management.
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-black hover:bg-gray-100"
            >
              Start Your Free Trial <ArrowRight className="ml-2" />
            </Button>
          </div>
        </section>
      </main>

      <footer className="bg-black text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">ClientGuard</h3>
              <p className="text-gray-400">
                Empowering agencies with comprehensive client management
                solutions.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#features"
                    className="text-gray-400 hover:text-white"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="text-gray-400 hover:text-white">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Security
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Connect</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Facebook
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center">
            <p>&copy; 2024 ClientGuard. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
