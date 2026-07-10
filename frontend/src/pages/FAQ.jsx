import FAQItem from '../components/FAQItem';
import { HelpCircle } from 'lucide-react';

const FAQ = () => {
    const faqs = [
        { q: "How do I add funds to my wallet?", a: "Go to your Profile page, click on the 'Digital Wallet' tab, enter the amount, and click 'Add Funds'." },
        { q: "How can I apply a promo code?", a: "When you are in the Cart, you will see a 'Got a promo code?' box. Enter your code there and click Apply to see the discount on your total." },
        { q: "Is my payment information secure?", a: "Yes, we use industry-standard encryption to ensure all payment methods are handled securely." },
        { q: "How do I track my orders?", a: "Visit the 'Order History' tab in your Profile to view the status of all your current and past orders." }
    ];

    return (
        <div className="max-w-3xl mx-auto px-4 py-12">
            <h1 className="text-4xl font-black text-gray-900 mb-8 flex items-center gap-3">
                <HelpCircle className="text-blue-600" size={36} /> Frequently Asked Questions
            </h1>
            <div className="bg-white rounded-3xl border shadow-sm p-8">
                {faqs.map((item, index) => (
                    <FAQItem key={index} question={item.q} answer={item.a} />
                ))}
            </div>
        </div>
    );
};

export default FAQ;