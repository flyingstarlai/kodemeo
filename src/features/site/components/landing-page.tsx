import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button.tsx";
import { cn } from "@/lib/utils.ts";
import { Card, CardContent } from "@/components/ui/card.tsx";
import heroKitten from "@/assets/hero-kitten.png";
import featureInteractive from "@/assets/feature-interactive.png";
import featureFeedback from "@/assets/feature-feedback.png";
import featureCommunity from "@/assets/feature-community.png";
import { ModeToggle } from "@/components/mode-toggle.tsx";
import React from "react";

const LandingPage: React.FC = () => {
  return (
    <div
      className={cn(
        "min-h-screen bg-gradient-to-b from-green-100 to-zinc-100",
        "dark:from-green-900 dark:to-zinc-900",
        "transition-colors duration-200",
      )}
    >
      {/* Navbar */}
      <header
        className={cn(
          "container mx-auto flex items-center justify-between py-6 px-4",
          "transition-colors duration-200",
        )}
      >
        <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
          Junior Coder
        </h1>
        <nav className="space-x-6">
          <Link
            to="/"
            hash="features"
            className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
          >
            Features
          </Link>
          <Link
            to="/"
            hash="pricing"
            className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
          >
            Pricing
          </Link>
          <Link
            to="/"
            hash="contact"
            className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
          >
            Contact
          </Link>
        </nav>

        <div className="space-x-6 flex items-center">
          <Button asChild>
            <Link to="/register">Get Started</Link>
          </Button>
          <ModeToggle />
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto py-20 text-center px-4">
        <h2
          className={cn(
            "text-5xl font-extrabold leading-tight",
            "text-gray-900 dark:text-gray-100",
          )}
        >
          A playful platform for coding learning <br /> that sparks creativity
          in kids
        </h2>
        <p
          className={cn(
            "mt-6 text-lg max-w-2xl mx-auto",
            "text-gray-600 dark:text-gray-300",
          )}
        >
          Say goodbye to boring lessons. With Junior Coder, your child learns
          through fun games, interactive tutorials, and real-time feedback — all
          in a perfectly engaging environment.
        </p>
        <div className="mt-10 flex justify-center space-x-4">
          <Button asChild size="lg">
            <Link to="/register">Get Started</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link to="/" hash="features">
              Learn More
            </Link>
          </Button>
        </div>
        <div className="mt-16">
          <img
            src={heroKitten}
            alt="Kodemeo hero"
            className="mx-auto w-full max-w-md rounded-4xl shadow-lg"
          />
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className={cn(
          "container mx-auto py-20 px-4",
          "transition-colors duration-200",
        )}
      >
        <h3
          className={cn(
            "text-3xl font-bold text-center",
            "text-gray-900 dark:text-gray-100",
          )}
        >
          Features
        </h3>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Interactive Games",
              description:
                "Learn coding concepts through fun puzzles and challenges tailored for young minds.",
              icon: featureInteractive,
            },
            {
              title: "Real-time Feedback",
              description:
                "Instant hints and tips keep kids motivated and on track to success.",
              icon: featureFeedback,
            },
            {
              title: "Community & Support",
              description:
                "Join a friendly community of budding coders and share your creations.",
              icon: featureCommunity,
            },
          ].map((feature) => (
            <Card
              key={feature.title}
              className={cn(
                "border-0 shadow-sm",
                "bg-green-100/80 dark:bg-green-950",
                "transition-colors duration-200",
              )}
            >
              <CardContent className="text-center space-y-4">
                <div className="mx-auto">
                  <img
                    src={feature.icon}
                    alt={feature.title}
                    className="w-[240px] rounded-4xl mx-auto"
                  />
                </div>
                <h4
                  className={cn(
                    "text-xl font-semibold",
                    "text-gray-900 dark:text-gray-100",
                  )}
                >
                  {feature.title}
                </h4>
                <p className={cn("text-gray-600 dark:text-gray-300")}>
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section
        id="pricing"
        className={cn(
          "container mx-auto py-20 rounded-xl shadow-lg px-4",
          "bg-green-100/80 dark:bg-green-950",
          "transition-colors duration-200",
        )}
      >
        <div className="text-center">
          <h3
            className={cn(
              "text-3xl font-bold",
              "text-gray-900 dark:text-gray-100",
            )}
          >
            Simple, Affordable Pricing
          </h3>
          <p
            className={cn(
              "mt-4 max-w-xl mx-auto",
              "text-gray-600 dark:text-gray-300",
            )}
          >
            Plans that grow with your child — cancel anytime.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: "Free Plan",
              price: "IDR 0",
              features: ["Access to basic games", "Community forums"],
            },
            {
              name: "Pro Plan",
              price: "IDR 79.000",
              features: [
                "All Free features",
                "Premium tutorials",
                "Progress reports",
              ],
            },
            {
              name: "Ultimate",
              price: "IDR 149.000",
              features: [
                "All Pro features",
                "1-on-1 mentoring",
                "Exclusive events",
              ],
            },
          ].map((plan) => (
            <Card
              key={plan.name}
              className={cn(
                "border-0 shadow-none",
                "bg-green-100/80 dark:bg-green-950",
                "transition-colors duration-200",
              )}
            >
              <CardContent className="space-y-6 text-center">
                <h4
                  className={cn(
                    "text-2xl font-semibold",
                    "text-gray-900 dark:text-gray-100",
                  )}
                >
                  {plan.name}
                </h4>
                <p
                  className={cn(
                    "text-4xl font-bold",
                    "text-gray-900 dark:text-gray-100",
                  )}
                >
                  {plan.price}
                </p>
                <ul className="space-y-2">
                  {plan.features.map((f) => (
                    <li
                      key={f}
                      className={cn("text-gray-600 dark:text-gray-300")}
                    >
                      {f}
                    </li>
                  ))}
                </ul>
                <Button asChild size="lg">
                  <Link to="/register">Choose {plan.name}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer
        id="contact"
        className={cn(
          "container mx-auto py-12 text-center px-4",
          "text-gray-600 dark:text-gray-400",
          "transition-colors duration-200",
        )}
      >
        <p>
          &copy; {new Date().getFullYear()} Junior Coder. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
