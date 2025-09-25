import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";
import { PhoneCall, Mail } from "lucide-react";
import emailjs from '@emailjs/browser';
import { cn } from "@/lib/utils";

type CtaProps = {
  background?: 'transparent' | 'white';
  className?: string;
};

export default function Cta({ background = 'transparent', className }: CtaProps) {
  const [message, setMessage] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(message || "Hi, I'm interested in building a brand with gravity!");
    window.open(`https://wa.me/2348160891799?text=${encodedMessage}`, '_blank');
  };

  const handleEmailClick = async () => {
    if (!message.trim()) {
      alert("Please enter a brand idea or message before sending.");
      return;
    }

    try {
      // Add timestamp to the form data
      const templateParams = {
        message: message,
        time: new Date().toLocaleString(),
      };

      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_GRAVITY_TEMPLATE_ID,
        templateParams,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      alert("Your message has been sent successfully! We'll get back to you soon.");
      setMessage(""); // Clear the form
    } catch (error) {
      console.error("EmailJS Error:", error);
      alert("Sorry, there was an error sending your message. Please try again or contact us directly.");
    }
  };

  const handleCallClick = () => {
    window.open("tel:+2349137145159", '_self');
  };

  return (
    <section className={cn("container mx-auto py-16", className)}>
      {/* Inner Container - Left aligned on desktop, centered on mobile; adaptive background */}
      <div className={cn(
        "border border-black rounded-[2rem] p-8 max-w-4xl mx-auto lg:mx-0",
        background === 'white' ? 'bg-white' : 'bg-transparent'
      )}>
          {/* Heading and Subtitle */}
          <div className="text-left mb-6">
            <h2 className="font-serif text-2xl md:text-3xl font-medium text-black mb-2">
              READY TO BUILD A BRAND WITH GRAVITY?
            </h2>
            <p className="text-gray-700 text-base font-light">
              Let's turn your vision into a decisive identity.
            </p>
          </div>

          {/* Form for EmailJS */}
          <form ref={formRef} data-emailjs-form className="space-y-6">
            {/* Text Input Field */}
            <div>
              <textarea
                name="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter a brand idea or message..."
                className="w-full h-24 p-4 border border-black rounded-3xl bg-transparent placeholder:text-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-gray-300 text-gray-800"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              {/* Left Side - Direct Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <NavLink to="/onboarding">
                  <Button
                    type="button"
                    className="bg-transparent text-black border border-black rounded-2xl px-6 py-2 hover:bg-transparent transition-colors font-black"
                    style={{ fontFamily: 'Satoshi Variable' }}
                  >
                    Start My Brand
                  </Button>
                </NavLink>
                
                <NavLink to="/contact">
                  <Button
                    type="button"
                    className="border-0 rounded-2xl px-6 py-2 hover:opacity-90 transition-all font-black text-black"
                    style={{ backgroundColor: '#e2a312', fontFamily: 'Satoshi Variable' }}
                  >
                    Contact Us
                  </Button>
                </NavLink>
              </div>

              {/* Right Side - Communication Links */}
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 mr-2 font-black" style={{ fontFamily: 'Satoshi Variable' }}>Send with</span>
                
                {/* WhatsApp Button */}
                <Button
                  type="button"
                  onClick={handleWhatsAppClick}
                  className="border-0 rounded-2xl px-4 py-2 hover:opacity-90 transition-all font-black text-black flex items-center gap-2"
                  style={{ backgroundColor: '#e2a312', fontFamily: 'Satoshi Variable' }}
                >
                  <img 
                    src="/whatsapp-icon.svg" 
                    alt="WhatsApp" 
                    className="w-4 h-4"
                  />
                  WhatsApp
                </Button>

                {/* Email Button */}
                <Button
                  type="button"
                  onClick={handleEmailClick}
                  className="border-0 rounded-2xl px-4 py-2 hover:opacity-90 transition-all font-black text-black flex items-center gap-2"
                  style={{ backgroundColor: '#e2a312', fontFamily: 'Satoshi Variable' }}
                >
                  <Mail className="w-4 h-4" />
                  E-mail
                </Button>

                {/* Call Button */}
                <Button
                  type="button"
                  onClick={handleCallClick}
                  className="border-0 rounded-2xl px-4 py-2 hover:opacity-90 transition-all font-black text-black flex items-center gap-2"
                  style={{ backgroundColor: '#e2a312', fontFamily: 'Satoshi Variable' }}
                >
                  <PhoneCall className="w-4 h-4" />
                  Call now
                </Button>
              </div>
            </div>
          </form>
        </div>
    </section>
  );
}