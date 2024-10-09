"use client";
import { useState } from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import { Divider } from "@nextui-org/divider";
import { Input } from "@nextui-org/input";
import { Modal } from "@nextui-org/modal";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

export default function Pricing() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const plans = [
    {
      name: "Hobby Plan",
      desc: "Enjoy limited access to all our features",
      price: '$0',
      isMostPop: false,
      features: [
        "Generate one report for free per work email",
      ],
    },
    {
      name: "Basic Plan",
      desc: "Advanced options and customizability for your reports",
      price: '$10',
      isMostPop: true,
      features: [
        "Generate reports with advanced options",
        "Customizable reports",
        "Input your own sources",
        "Outline editor",
      ],
    },
    {
      name: "Enterprise Plan",
      desc: "Unlimited access and advanced features for your team",
      price: "Contact Us",
      isMostPop: false,
      features: [
        "API access",
        "Unlimited PDF imports",
        "Advanced editing",
        "Data stats",
        "Contact sales for more details",
      ],
    },
  ];

  const handleReachUsOut = async () => {
    try {
      const response = await fetch('/api/interestedUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_email: userEmail,
        }),
      });

      if (response.ok) {
        alert('Successfully submitted! We will contact you soon.');
        setUserEmail('');
        setIsModalOpen(false);
      } else {
        alert('Failed to submit. Please try again.');
      }
    } catch (error) {
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <section className="max-w-screen-xl w-full mx-auto px-4 py-28 gap-12 md:px-8 flex flex-col justify-center items-center">
      <motion.div
        initial={{ y: 5, opacity: 0 }}
        whileInView={{
          y: 0,
          opacity: 1,
        }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.5 }}
        className="max-w-screen-xl mx-auto px-4 md:px-8"
      >
        <div className="relative max-w-xl mx-auto sm:text-center">
          <h3 className="text-2xl font-light tracking-tighter sm:text-3xl bg-gradient-to-b from-foreground to-foreground/70 text-transparent bg-clip-text text-pretty">
            Pricing Plans for your business
          </h3>
          <div className="mt-3 max-w-xl text-foreground/80 text-balance">
            <p>Select the plan that best suits your needs.</p>
          </div>
        </div>
        <div className="mt-16 gap-10 grid lg:grid-cols-3 place-content-center">
          {plans.map((item, idx) => (
            <Card
              key={idx}
              className={
                item.isMostPop ? "border-2 border-primary sm:scale-110" : ""
              }
            >
              <CardHeader>
                <span className="font-medium">{item.name}</span>
              </CardHeader>
              <Divider />
              <CardBody className="gap-3">
                <div className="text-3xl font-semibold">
                  {idx !== 2 ? item.price : item.price} <span className="text-xl font-normal">{idx !== 2 ? '/report' : null}</span>
                </div>
                <p>{item.desc}</p>
                <ul className="p-8 space-y-3">
                  <li className="font-medium">
                    <p>Features</p>
                  </li>
                  {item.features.map((featureItem, idx) => (
                    <li key={idx} className="flex items-center gap-5">
                      <Check size={20} />
                      {featureItem}
                    </li>
                  ))}
                </ul>
              </CardBody>
              <CardFooter>
                {item.name === "Enterprise Plan" ? (
                  <Button
                    className="w-full"
                    variant="solid"
                    color="primary"
                    onClick={() => setIsModalOpen(true)}
                  >
                    Reach us out
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    variant="solid"
                    color={item.isMostPop ? "primary" : "default"}
                  >
                    Get Started
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </motion.div>

      {isModalOpen && (
        <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <Modal.Header>
            <h2>Contact Us</h2>
          </Modal.Header>
          <Modal.Body>
            <Input
              fullWidth
              type="email"
              placeholder="Enter your email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
            />
            <Button onClick={handleReachUsOut}>Submit</Button>
          </Modal.Body>
        </Modal>
      )}
    </section>
  );
}