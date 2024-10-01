import React, { useState } from 'react';

const ContactSection = () => {
  const [status, setStatus] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://formspree.io/f/xyyrjedq', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="relative overflow-hidden pb-32">
      <div className="absolute inset-0 -z-10">
        <div className="w-full h-full bg-gradient-to-br from-purple-900 via-blue-900 to-black"></div>
        <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-opacity-20 bg-blue-700 rounded-full transform -translate-x-1/4 -translate-y-1/4"></div>
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-opacity-20 bg-purple-800 rounded-full transform translate-x-1/4 translate-y-1/4"></div>
      </div>
      {/* Smooth Inverted Squiggle Boundary */}
      <div
        className="absolute top-0 left-0 w-full h-24 bg-[rgb(06,08,21)] -z-10"
        style={{
          clipPath: 'polygon(0 0, 100% 0, 100% 60%, 85% 50%, 70% 60%, 55% 50%, 40% 60%, 25% 50%, 10% 60%, 0 50%)',
          transform: 'translateY(-10px)'
        }}
      />
      <div className="relative max-w-5xl mx-auto px-6 pt-24">
        <h2 className="text-4xl lg:text-5xl font-bold mb-12 text-center text-white relative z-10">
          Get in Touch
        </h2>
        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                required
                className="w-full p-4 bg-[#121212] border border-[#0a0a0a] rounded-lg shadow-[inset_0px_2px_4px_rgba(0,0,0,0.5)] focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500"
                aria-describedby="name-description"
              />
            </div>
            <div>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                required
                className="w-full p-4 bg-[#121212] border border-[#0a0a0a] rounded-lg shadow-[inset_0px_2px_4px_rgba(0,0,0,0.5)] focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500"
                aria-describedby="email-description"
              />
            </div>
          </div>
          <div>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Subject"
              required
              className="w-full p-4 bg-[#121212] border border-[#0a0a0a] rounded-lg shadow-[inset_0px_2px_4px_rgba(0,0,0,0.5)] focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500"
            />
          </div>
          <div>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your message here..."
              rows="6"
              required
              className="w-full p-4 bg-[#121212] border border-[#0a0a0a] rounded-lg shadow-[inset_0px_2px_4px_rgba(0,0,0,0.5)] focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500"
              aria-describedby="message-description"
            ></textarea>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4">
            <button
              type="submit"
              className="w-full md:w-auto bg-blue-600 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition-colors duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[rgb(06,08,21)]"
            >
              Send Message
            </button>
            <a
              href="/CV.pdf" 
              download
              className="w-full md:w-auto bg-purple-600 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-purple-700 transition-colors duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-[rgb(06,08,21)] text-center"
            >
              Download Resume
            </a>
          </div>
          {status === 'success' && (
            <div className="bg-green-900 border border-green-700 text-white p-4 rounded-md">
              <p className="font-bold">Success!</p>
              <p>Thanks for your message! I'll get back to you soon.</p>
            </div>
          )}
          {status === 'error' && (
            <div className="bg-red-900 border border-red-700 text-white p-4 rounded-md">
              <p className="font-bold">Error</p>
              <p>Oops! There was a problem sending your message. Please try again.
                <br></br>
                If this problem persists, contact MMillward2012@gmail.com.
              </p>
            </div>
          )}
        </form>
      </div>
    </section>
  );
};

export default ContactSection;