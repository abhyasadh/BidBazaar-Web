import { ArrowUp2, ArrowDown2 } from "iconsax-react";
import React, { useState, useRef, useEffect } from "react";

const FAQList = [
  {
    question: "What is BidBazaar?",
    answer:
      "BidBazaar is a mobile application designed to host and participate in auctions, allowing users to buy and sell a wide range of products through a competitive bidding process.",
  },
  {
    question: "How does the bidding process work?",
    answer:
      "To place a bid, simply find an auction you're interested in, enter your bid amount, and confirm. The highest bid at the end of the auction period wins the item.",
  },
  {
    question: "Can I retract my bid once it has been placed?",
    answer:
      "No, once a bid is placed, it cannot be retracted. But the final decision to buy the product after winning the bid is up to the user.",
  },
  {
    question: "How do I know if I've won an auction?",
    answer:
      "You will receive a notification in the app and an email if you have provided one, informing you that you've won the auction. You can also check the status of your bids in the 'My Bids' section of the app.",
  },
  {
    question: "Is my personal information secure on BidBazaar?",
    answer:
      "Yes, BidBazaar adheres to secure data storage practices and strict data protection policies to ensure your personal information is safe.",
  },
  {
    question: "Can I sell items on BidBazaar?",
    answer:
      "Yes, you can list items for auction by following the steps to add an item, including providing a description, setting a starting bid, and adding photos.",
  },
  {
    question: "How do I contact customer support?",
    answer:
      "You can contact customer support through the Settings Page in the app, where you can find FAQs, guides, and an option to send a message to our support team.",
  },
  {
    question: "What should I do if I encounter a problem with the app?",
    answer:
      "If you experience any issues, you can report them via the in-app messaging system in the 'Help' section, and our support team will assist you as soon as possible.",
  },
  {
    question: "How do I report an item that violates the terms of service?",
    answer:
      "You can report items directly from the item's listing by clicking the three dots and selecting the 'Report' option and providing a reason for the report.",
  },
  {
    question: "Are there any fees for using BidBazaar?",
    answer:
      "Currently, BidBazaar does not charge any fees for registering, bidding, or listing items. However, any changes to the fee structure will be communicated in advance.",
  },
];

const FAQs = () => {
  const [openIndex, setOpenIndex] = useState(null);
  return (
    <>
      <h1 className="label">Frequently Asked Questions (FAQs)</h1>
      {FAQList.map((faq, index) => (
        <FAQItem
          key={index}
          index={index}
          question={faq.question}
          answer={faq.answer}
          open={openIndex}
          setOpen={setOpenIndex}
        />
      ))}
    </>
  );
};

const FAQItem = ({ index, question, answer, open, setOpen }) => {
  const contentRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (open === index) {
      setHeight(contentRef.current.scrollHeight);
    } else {
      setHeight(0);
    }
  }, [open, index]);

  return (
    <div style={{ marginBottom: "24px" }}>
      <button
        onClick={() => (open === index ? setOpen(null) : setOpen(index))}
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          backgroundColor:
            open === index
              ? "var(--primary-color)"
              : "var(--color-scheme-primary)",
          border: "none",
          outline: "none",
          padding: "12px 16px",
          cursor: "pointer",
          fontFamily: "Blinker",
          fontSize: "18px",
          color: "var(--text-color)",
          borderRadius: `10px 10px ${open === index ? "0 0" : "10px 10px"}`,
          transition: "all 0.2s ease",
        }}
      >
        {question}
        {open === index ? (
          <ArrowUp2 size={24} color="var(--text-color)" />
        ) : (
          <ArrowDown2 size={24} color="var(--text-color)" />
        )}
      </button>
      <div
        ref={contentRef}
        style={{
          height: `${height}px`,
          overflow: "hidden",
          transition: "height 0.2s ease-in-out",
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "0 0 10px 10px",
            padding: "14px 16px",
            border: "1px solid var(--primary-color)",
          }}
        >
          <span style={{ color: "black" }}>{answer}</span>
        </div>
      </div>
    </div>
  );
};

export default FAQs;
