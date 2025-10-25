import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import { supabase, ContactInquiry, Booking, TourPackage } from '../lib/supabase';

type ContactPageProps = {
  selectedPackageId?: string;
};

export default function ContactPage({ selectedPackageId }: ContactPageProps) {
  const [formType, setFormType] = useState<'inquiry' | 'booking'>('inquiry');
  const [selectedPackage, setSelectedPackage] = useState<TourPackage | null>(null);
  const [packages, setPackages] = useState<TourPackage[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [inquiryForm, setInquiryForm] = useState<ContactInquiry>({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const [bookingForm, setBookingForm] = useState<Booking>({
    package_id: '',
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    travel_date: '',
    num_travelers: 1,
    special_requests: '',
  });

  useEffect(() => {
    loadPackages();
  }, []);

  useEffect(() => {
    if (selectedPackageId) {
      setFormType('booking');
      setBookingForm((prev) => ({ ...prev, package_id: selectedPackageId }));
      const pkg = packages.find((p) => p.id === selectedPackageId);
      if (pkg) setSelectedPackage(pkg);
    }
  }, [selectedPackageId, packages]);

  const loadPackages = async () => {
    const { data } = await supabase.from('tour_packages').select('*').order('title');
    setPackages(data || []);
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from('contact_inquiries').insert([inquiryForm]);

      if (error) throw error;

      setSuccess(true);
      setInquiryForm({ name: '', email: '', phone: '', message: '' });
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      alert('Failed to submit inquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from('bookings').insert([bookingForm]);

      if (error) throw error;

      setSuccess(true);
      setBookingForm({
        package_id: '',
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        travel_date: '',
        num_travelers: 1,
        special_requests: '',
      });
      setSelectedPackage(null);
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      console.error('Error submitting booking:', error);
      alert('Failed to submit booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-emerald-900 to-slate-900 pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-white drop-shadow-2xl">
            Get in{' '}
            <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 bg-clip-text text-transparent">
              Touch
            </span>
          </h1>
          <p className="text-xl text-amber-100/80 max-w-3xl mx-auto font-light">
            Start planning your dream Kerala journey today
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-gradient-to-br from-slate-800/50 to-emerald-900/30 backdrop-blur-sm rounded-2xl p-8 border border-amber-500/20 hover:border-amber-400/40 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
              <Phone className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Call Us</h3>
            <p className="text-amber-200">+91 98765 43210</p>
            <p className="text-gray-400 text-sm mt-2">Mon-Sat, 9 AM - 7 PM IST</p>
          </div>

          <div className="bg-gradient-to-br from-slate-800/50 to-emerald-900/30 backdrop-blur-sm rounded-2xl p-8 border border-amber-500/20 hover:border-amber-400/40 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Email Us</h3>
            <p className="text-amber-200">info@ahfatravels.com</p>
            <p className="text-gray-400 text-sm mt-2">We reply within 24 hours</p>
          </div>

          <div className="bg-gradient-to-br from-slate-800/50 to-emerald-900/30 backdrop-blur-sm rounded-2xl p-8 border border-amber-500/20 hover:border-amber-400/40 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Visit Us</h3>
            <p className="text-amber-200">Kochi, Kerala</p>
            <p className="text-gray-400 text-sm mt-2">India, 682001</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-slate-800/50 to-emerald-900/30 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-amber-500/30 shadow-2xl">
            <div className="flex gap-4 mb-8">
              <button
                onClick={() => setFormType('inquiry')}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                  formType === 'inquiry'
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-white shadow-lg'
                    : 'bg-slate-700/50 text-gray-300 hover:bg-slate-700'
                }`}
              >
                General Inquiry
              </button>
              <button
                onClick={() => setFormType('booking')}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                  formType === 'booking'
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-white shadow-lg'
                    : 'bg-slate-700/50 text-gray-300 hover:bg-slate-700'
                }`}
              >
                Book a Tour
              </button>
            </div>

            {success && (
              <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg flex items-center gap-3 text-green-300">
                <CheckCircle className="w-5 h-5" />
                <p>
                  {formType === 'inquiry'
                    ? 'Thank you for your inquiry! We will contact you soon.'
                    : 'Booking request submitted successfully! We will confirm shortly.'}
                </p>
              </div>
            )}

            {formType === 'inquiry' ? (
              <form onSubmit={handleInquirySubmit} className="space-y-6">
                <div>
                  <label className="block text-amber-200 font-medium mb-2">Your Name</label>
                  <input
                    type="text"
                    required
                    value={inquiryForm.name}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-amber-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-amber-200 font-medium mb-2">Email</label>
                    <input
                      type="email"
                      required
                      value={inquiryForm.email}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-amber-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-amber-200 font-medium mb-2">Phone</label>
                    <input
                      type="tel"
                      value={inquiryForm.phone}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-amber-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-amber-200 font-medium mb-2">Message</label>
                  <textarea
                    required
                    rows={6}
                    value={inquiryForm.message}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-amber-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all resize-none"
                    placeholder="Tell us about your travel plans..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-amber-500 to-yellow-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-amber-500/50 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-6">
                <div>
                  <label className="block text-amber-200 font-medium mb-2">Select Tour Package</label>
                  <select
                    required
                    value={bookingForm.package_id}
                    onChange={(e) => {
                      setBookingForm({ ...bookingForm, package_id: e.target.value });
                      const pkg = packages.find((p) => p.id === e.target.value);
                      setSelectedPackage(pkg || null);
                    }}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-amber-500/30 rounded-lg text-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                  >
                    <option value="">Choose a package</option>
                    {packages.map((pkg) => (
                      <option key={pkg.id} value={pkg.id}>
                        {pkg.title} - {pkg.duration_days} Days - ₹{pkg.price.toLocaleString()}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedPackage && (
                  <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                    <p className="text-amber-200 text-sm">
                      <strong>{selectedPackage.title}</strong> - {selectedPackage.duration_days} Days
                    </p>
                    <p className="text-2xl font-bold text-amber-400 mt-1">
                      ₹{selectedPackage.price.toLocaleString()}
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-amber-200 font-medium mb-2">Your Name</label>
                  <input
                    type="text"
                    required
                    value={bookingForm.customer_name}
                    onChange={(e) =>
                      setBookingForm({ ...bookingForm, customer_name: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-slate-900/50 border border-amber-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-amber-200 font-medium mb-2">Email</label>
                    <input
                      type="email"
                      required
                      value={bookingForm.customer_email}
                      onChange={(e) =>
                        setBookingForm({ ...bookingForm, customer_email: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-slate-900/50 border border-amber-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-amber-200 font-medium mb-2">Phone</label>
                    <input
                      type="tel"
                      required
                      value={bookingForm.customer_phone}
                      onChange={(e) =>
                        setBookingForm({ ...bookingForm, customer_phone: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-slate-900/50 border border-amber-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-amber-200 font-medium mb-2">Travel Date</label>
                    <input
                      type="date"
                      required
                      value={bookingForm.travel_date}
                      onChange={(e) =>
                        setBookingForm({ ...bookingForm, travel_date: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-slate-900/50 border border-amber-500/30 rounded-lg text-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-amber-200 font-medium mb-2">Number of Travelers</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={bookingForm.num_travelers}
                      onChange={(e) =>
                        setBookingForm({ ...bookingForm, num_travelers: parseInt(e.target.value) })
                      }
                      className="w-full px-4 py-3 bg-slate-900/50 border border-amber-500/30 rounded-lg text-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-amber-200 font-medium mb-2">
                    Special Requests (Optional)
                  </label>
                  <textarea
                    rows={4}
                    value={bookingForm.special_requests}
                    onChange={(e) =>
                      setBookingForm({ ...bookingForm, special_requests: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-slate-900/50 border border-amber-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all resize-none"
                    placeholder="Any special requirements or preferences..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-amber-500 to-yellow-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-amber-500/50 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                  {loading ? 'Submitting...' : 'Submit Booking Request'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
