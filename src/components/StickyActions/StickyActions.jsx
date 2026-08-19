import { Link } from "react-router-dom";
import { FaWhatsapp, FaEnvelope } from "react-icons/fa";
import "./StickyActions.css";

// Same business WhatsApp number used across the Footer, Contact and
// BookDetails pages — keep in sync with those.
const WHATSAPP_NUMBER = "919871569192";

const WA_MESSAGE = encodeURIComponent(
  "Hello, I would like to enquire about publishing my book with Yellowish Publication."
);

export default function StickyActions() {
  return (
    <div className="sticky-actions">
      <Link
        to="/contact"
        className="sticky-enquiry"
        aria-label="Open enquiry form"
        title="Enquiry"
      >
        <FaEnvelope aria-hidden="true" />
        <span>Enquiry</span>
      </Link>
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WA_MESSAGE}`}
        target="_blank"
        rel="noreferrer"
        className="sticky-wa"
        aria-label="Chat with us on WhatsApp"
        title="Chat on WhatsApp"
      >
        <FaWhatsapp aria-hidden="true" />
      </a>
    </div>
  );
}