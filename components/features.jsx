"use client";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

const features = [
  {
    title: "Accurate Market Reports",
    description: "Generate detailed and accurate market reports for any industry based on user input and industry-specific data.",
  },
  {
    title: "API Access",
    description: "Enterprise users get API access for seamless integration with your existing tools and workflows.",
  },
  {
    title: "Export Reports",
    description: "Export our purchased reports to your Email, PDF, Word documents, or directly to Notion for easy sharing and collaboration.",
  },
  {
    title: "Customizable Length and Content",
    description: "Customize the length and content of your reports by providing an outline and specifying the topics to be included.",
  },
  {
    title: "Source Mentions",
    description: "Always know the source of the information provided, ensuring reliability and accuracy.",
  },
  {
    title: "No Hallucinations",
    description: "Unlike general AI models, TrychAI avoids hallucinations by relying on credible sources, providing accurate and relevant information.",
  },
];

export default function Features() {
  return (
    <section className="max-w-screen-xl mx-auto px-6 py-16 md:px-8 flex flex-col items-center bg-background">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="text-center mb-12"
      >
        <h3 className="text-3xl font-bold bg-gradient-to-b from-foreground to-foreground/70 text-transparent bg-clip-text">
          TrychAI Features
        </h3>
        <p className="mt-4 text-lg text-foreground/80">
          Discover the powerful features of TrychAI that make it the perfect tool for generating market reports.
        </p>
      </motion.div>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-4xl w-full">
        {features.map((feature, idx) => (
          <motion.div
            key={idx}
            className="flex flex-col items-start p-6 border border-foreground/50 rounded-lg shadow-md bg-background"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: idx * 0.2 }}
          >
            <Check size={28} className="text-primary mb-4" />
            <h4 className="text-xl font-semibold text-foreground">{feature.title}</h4>
            <p className="mt-2 text-foreground/80">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
