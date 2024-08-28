"use client";
import { Accordion, AccordionItem } from "@nextui-org/accordion";
import { motion } from "framer-motion";

export default function Faq() {
  return (
    <section className="relative max-w-screen-xl mx-auto px-4 py-28 gap-12 md:px-8 flex flex-col justify-center items-center">
      <motion.div
        initial={{ y: 5, opacity: 0 }}
        whileInView={{
          y: 0,
          opacity: 1,
        }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.5 }}
        className="flex flex-col gap-3 justify-center items-center"
      >
        <h4 className="text-2xl font-bold sm:text-3xl bg-gradient-to-b from-foreground to-foreground/70 text-transparent bg-clip-text">
          FAQ
        </h4>
        <p className="max-w-xl text-foreground/80 text-center">
          Here are some of our frequently asked questions. If you have any other
          questions you’d like answered please feel free to email us.
        </p>
      </motion.div>
      <motion.div
        initial={{ y: 5, opacity: 0 }}
        whileInView={{
          y: 0,
          opacity: 1,
        }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 1 }}
        className="max-w-2xl w-full border border-foreground/50 rounded-md p-1"
      >
        <Accordion
          motionProps={{
            variants: {
              enter: {
                y: 0,
                opacity: 1,
                height: "auto",
                transition: {
                  height: {
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                    duration: 1,
                  },
                  opacity: {
                    easings: "ease",
                    duration: 1,
                  },
                },
              },
              exit: {
                y: -10,
                opacity: 0,
                height: 0,
                transition: {
                  height: {
                    easings: "ease",
                    duration: 0.25,
                  },
                  opacity: {
                    easings: "ease",
                    duration: 0.3,
                  },
                },
              },
            },
          }}
        >
          <AccordionItem aria-label="What is TrychAI?" title="What is TrychAI?">
            TrychAI is an AI-powered tool that generates comprehensive market reports for any industry, similar to those created by VC analysts. Users can input industry-specific data, and TrychAI will produce detailed, professional reports.
          </AccordionItem>
          <AccordionItem aria-label="How does the pricing work?" title="How does the pricing work?">
            We offer three plans: the Hobby Plan (free, one report per work email), the Basic Plan ($3 per report, includes advanced options and customizability), and the Enterprise Plan (includes unlimited reports, API access, and more).
          </AccordionItem>
          <AccordionItem aria-label="What features are included in the Enterprise Plan?" title="What features are included in the Enterprise Plan?">
            The Enterprise Plan includes API access, unlimited PDF imports, advanced editing, data statistics, and a &apos;contact sales&apos; button for more personalized service.
          </AccordionItem>
          <AccordionItem aria-label="Can I customize my reports?" title="Can I customize my reports?">
            Yes, with the Basic and Enterprise Plans, you can customize your reports, input your own sources, and use an outline editor to tailor the report to your specific needs.
          </AccordionItem>
          <AccordionItem aria-label="How is TrychAI different from ChatGPT?" title="How is TrychAI different from ChatGPT?">
            TrychAI is specifically fine-tuned on market research reports to provide accurate and relevant information. Unlike ChatGPT, TrychAI avoids hallucinations and always mentions the source of the information provided.
          </AccordionItem>
          <AccordionItem aria-label="How do I contact support?" title="How do I contact support?">
            If you have any questions or need support, please feel free to email us at support@trychai.com. We&apos;re here to help!
          </AccordionItem>
        </Accordion>
      </motion.div>
    </section>
  );
}
