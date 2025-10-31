import React, { useState, useEffect } from 'react';
import './LandingPage.css';
import axios from 'axios';

const SERVER_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:3000';

export default function LandingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    communityName: '',
    communityType: '',
    groupSize: '',
    useCase: '',
    timeline: ''
  });

  const openModal = () => {
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'auto';
    setError("");
    setSuccess(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    // Basic validation
    if (!formData.name || !formData.email || !formData.phone || !formData.communityName || 
        !formData.communityType || !formData.groupSize || !formData.useCase || !formData.timeline) {
      setError('Please fill in all required fields.');
      return;
    }
  
    setLoading(true);
    setSuccess(false);
    setError("");
  
    const apiUrl = `${SERVER_URL}/api/joint-beta`;
    console.log('🚀 Making request to:', apiUrl);
  
    try {
      const response = await axios.post(
        apiUrl,
        formData,
        {
          headers: { "Content-Type": "application/json" }
        }
      );
      
      const result = response.data;
      
      if (result.success) {
        setSuccess(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          communityName: '',
          communityType: '',
          groupSize: '',
          useCase: '',
          timeline: ''
        });
        setTimeout(() => {
          closeModal();
          setSuccess(false);
        }, 2500);
      } else {
        setError(result.message || "⚠️ Something went wrong. Please try again later.");
      }
    } catch (err) {
      console.error("❌ Error submitting form:", err);
      console.error("❌ Full error:", err.response?.data);
      
      if (err.response) {
        setError(err.response.data?.message || "⚠️ Something went wrong. Please try again later.");
      } else if (err.request) {
        setError("⚠️ Network error. Please check your connection and try again.");
      } else {
        setError("⚠️ An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleModalClick = (e) => {
    if (e.target.classList.contains('modal')) {
      closeModal();
    }
  };

  return (
    <>
      <nav>
        <div className="container">
          <div className="logo">Connectbees</div>
          <ul className="nav-links">
            <li><a href="#features">Features</a></li>
            <li><a href="#use-cases">Use Cases</a></li>
            <li><a href="#testimonials">Testimonials</a></li>
            <li><a href="#" className="nav-cta" onClick={(e) => { e.preventDefault(); openModal(); }}>Join Beta</a></li>
          </ul>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-content">
          <h1>Turn Your WhatsApp Into a <span className="highlight">Smart Business Directory</span></h1>
          <p className="subtitle">AI-powered assistant built for senior entrepreneurs and business communities. Connect with trusted members instantly—no apps, no hassle.</p>
          <div className="hero-buttons">
            <a href="#" className="btn btn-primary" onClick={(e) => { e.preventDefault(); openModal(); }}>
              Join Beta for FREE <span className="beta-badge">Limited Spots</span>
            </a>
            <a href="#features" className="btn btn-secondary">See How It Works</a>
          </div>
        </div>
      </section>

      <section className="trust-bar">
        <p>Trusted by Business Leaders & Professional Networks</p>
        <div className="trust-logos">
          <span className="trust-logo">💼</span>
          <span className="trust-logo">🤝</span>
          <span className="trust-logo">🎓</span>
          <span className="trust-logo">👔</span>
          <span className="trust-logo">📈</span>
          <span className="trust-logo">🏢</span>
        </div>
      </section>

      <section className="problem-section">
        <div className="container">
          <div className="problem-header">
            <h2>Sound Familiar?</h2>
            <p>You've built valuable networks over decades. Your business community is full of experienced professionals. But connecting them efficiently? That's still a challenge.</p>
          </div>
          <div className="problem-grid">
            <div className="problem-card">
              <span className="icon">💬</span>
              <h3>"I remember someone mentioning tax consulting..."</h3>
              <p>You've spent 30 years building relationships, but finding who offers what requires scrolling through endless messages. You end up calling the same few people you already know.</p>
            </div>
            <div className="problem-card">
              <span className="icon">🤝</span>
              <h3>"There's so much expertise here we're not tapping"</h3>
              <p>Your network includes consultants and advisors with decades of experience. But most members only know a fraction of what's available within the group.</p>
            </div>
            <div className="problem-card">
              <span className="icon">😓</span>
              <h3>"I spend more time connecting people than running my business"</h3>
              <p>As a community leader, you're constantly making introductions. Your network is valuable, but managing it shouldn't be a full-time job.</p>
            </div>
            <div className="problem-card">
              <span className="icon">📱</span>
              <h3>"I prefer simple tools that just work"</h3>
              <p>You don't need another app to learn or platform to manage. WhatsApp works perfectly—why can't finding services be just as simple?</p>
            </div>
            <div className="problem-card">
              <span className="icon">🔇</span>
              <h3>"I keep my phone on silent during business hours"</h3>
              <p>Important announcements get lost in the noise. You miss opportunities not because you're not interested, but because you can't monitor constantly.</p>
            </div>
            <div className="problem-card">
              <span className="icon">💼</span>
              <h3>"I've built my reputation over years, not posts"</h3>
              <p>You're established in your field, but if you're not actively posting, younger members don't know about your expertise. Your experience deserves visibility.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="feature-section" id="features">
        <div className="container">
          <div className="feature-grid">
            <div className="feature-content">
              <h2>Ask Naturally, Get Results Instantly</h2>
              <p>No complex searches or scrolling through chat history. Just ask your question like you're talking to a colleague.</p>
              <ul>
                <li>Natural language queries: "Who handles corporate law?"</li>
                <li>Get vetted recommendations with contact details</li>
                <li>Works directly in WhatsApp—no new apps</li>
                <li>Instant responses, 24/7 availability</li>
              </ul>
              <a href="#" className="btn btn-primary" onClick={(e) => { e.preventDefault(); openModal(); }}>Try It Free</a>
            </div>
            <div className="feature-image">💬</div>
          </div>
        </div>
      </section>

      <section className="feature-section">
        <div className="container">
          <div className="feature-grid reverse">
            <div className="feature-content">
              <h2>Manage Your Professional Profile</h2>
              <p>Update your services and expertise through simple chat commands. Stay visible to quality referrals without constant posting.</p>
              <ul>
                <li>Self-service profile management</li>
                <li>Update anytime via WhatsApp</li>
                <li>Showcase your expertise and credentials</li>
                <li>No admin approval needed for updates</li>
              </ul>
              <a href="#" className="btn btn-secondary" onClick={(e) => { e.preventDefault(); openModal(); }}>Learn More</a>
            </div>
            <div className="feature-image">👤</div>
          </div>
        </div>
      </section>

      <section className="feature-section">
        <div className="container">
          <div className="feature-grid">
            <div className="feature-content">
              <h2>Secure & Members-Only</h2>
              <p>Your network is valuable. Connectbees ensures only verified group members can access your community directory.</p>
              <ul>
                <li>Automated member verification</li>
                <li>Protected community data</li>
                <li>Privacy-first approach</li>
                <li>Admin controls for member approval</li>
              </ul>
              <a href="#" className="btn btn-primary" onClick={(e) => { e.preventDefault(); openModal(); }}>Get Started</a>
            </div>
            <div className="feature-image">🔒</div>
          </div>
        </div>
      </section>

      <section className="use-cases" id="use-cases">
        <div className="container">
          <h2>Perfect For</h2>
          <p>Established business communities and professional networks where trust and experience matter</p>
          <div className="use-cases-grid">
            <span className="use-case-tag">💼 Executive Networks</span>
            <span className="use-case-tag">🤝 Business Associations</span>
            <span className="use-case-tag">🎓 Alumni Communities</span>
            <span className="use-case-tag">👔 CEO Forums</span>
            <span className="use-case-tag">📈 Industry Associations</span>
            <span className="use-case-tag">🏢 Chamber of Commerce</span>
            <span className="use-case-tag">⚖️ Professional Services</span>
            <span className="use-case-tag">🎯 Mastermind Groups</span>
          </div>
        </div>
      </section>

      <section className="testimonials" id="testimonials">
        <div className="container">
          <h2>What Business Leaders Say</h2>
          <div className="testimonial-grid">
            <div className="testimonial-card">
              <p className="testimonial-text">Finally, a solution that respects our time. No new app to learn, just WhatsApp working smarter. Our executive network has never been more connected.</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">RS</div>
                <div className="testimonial-info">
                  <h4>Robert Sullivan</h4>
                  <p>CEO Forum Leader</p>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <p className="testimonial-text">We've been trying spreadsheets and directories for years. Connectbees made it effortless. Members are actually finding and using the services within our community.</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">MK</div>
                <div className="testimonial-info">
                  <h4>Margaret Kim</h4>
                  <p>Business Association Director</p>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <p className="testimonial-text">As someone who built my practice over 35 years, I appreciate tools that work without complexity. This keeps me visible to the right people without constant effort.</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">DP</div>
                <div className="testimonial-info">
                  <h4>David Patterson</h4>
                  <p>Tax Consultant</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Transform Your Network?</h2>
          <p>Join our beta program and get free access. Help shape the future of professional networking.</p>
          <a href="#" className="btn btn-primary" onClick={(e) => { e.preventDefault(); openModal(); }}>Apply for Beta Access</a>
        </div>
      </section>

      <footer>
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="footer-logo">Connectbees</div>
              <p>Turning WhatsApp groups into smart business directories for professional communities.</p>
            </div>
            <div className="footer-links">
              <h4>Product</h4>
              <ul>
                <li><a href="#features">Features</a></li>
                <li><a href="#use-cases">Use Cases</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); openModal(); }}>Beta Program</a></li>
              </ul>
            </div>
            <div className="footer-links">
              <h4>Company</h4>
              <ul>
                <li><a href="#">About Us</a></li>
                <li><a href="#">Contact</a></li>
                <li><a href="#">Privacy Policy</a></li>
              </ul>
            </div>
            <div className="footer-links">
              <h4>Connect</h4>
              <ul>
                <li><a href="#">LinkedIn</a></li>
                <li><a href="#">Twitter</a></li>
                <li><a href="#">Email</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 Connectbees. Built with ❤️ for professional communities.</p>
          </div>
        </div>
      </footer>

      <div className={`modal ${isModalOpen ? 'active' : ''}`} onClick={handleModalClick}>
        <div className="modal-content">
          <div className="modal-header">
            <button className="modal-close" onClick={closeModal}>&times;</button>
            <h2>Join Beta Program</h2>
            <span className="beta-badge">100% Free</span>
            <p>Be among the first communities to experience Connectbees</p>
          </div>
          <div className="modal-body">
            <div className="benefits-box">
              <h4>What You Get:</h4>
              <ul>
                <li>Free access during entire beta period</li>
                <li>Priority feature requests</li>
                <li>Direct support from our team</li>
                <li>Lifetime discount on premium plans</li>
              </ul>
            </div>

            {success && (
              <div className="success-message">
                ✅ Thank you! We'll review your application and get back to you within 48 hours.
              </div>
            )}

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <div>
              <div className="form-group">
                <label htmlFor="name">Your Name *</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  required 
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  required 
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">WhatsApp Number *</label>
                <input 
                  type="tel" 
                  id="phone" 
                  name="phone" 
                  required 
                  placeholder="+1 234 567 8900"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
                <small>Include country code</small>
              </div>

              <div className="form-group">
                <label htmlFor="communityName">Community Name *</label>
                <input 
                  type="text" 
                  id="communityName" 
                  name="communityName" 
                  required 
                  placeholder="Your Business Network"
                  value={formData.communityName}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="communityType">Community Type *</label>
                <select 
                  id="communityType" 
                  name="communityType" 
                  required
                  value={formData.communityType}
                  onChange={handleInputChange}
                >
                  <option value="">Select type...</option>
                  <option value="executive">Executive Network</option>
                  <option value="business-association">Business Association</option>
                  <option value="alumni">Alumni Community</option>
                  <option value="ceo-forum">CEO Forum</option>
                  <option value="industry">Industry Association</option>
                  <option value="chamber">Chamber of Commerce</option>
                  <option value="professional">Professional Services Network</option>
                  <option value="mastermind">Mastermind Group</option>
                  <option value="other">Other Professional Network</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="groupSize">Approximate Group Size *</label>
                <select 
                  id="groupSize" 
                  name="groupSize" 
                  required
                  value={formData.groupSize}
                  onChange={handleInputChange}
                >
                  <option value="">Select size...</option>
                  <option value="50-100">50-100 members</option>
                  <option value="100-250">100-250 members</option>
                  <option value="250-500">250-500 members</option>
                  <option value="500+">500+ members</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="useCase">How will you use Connectbees? *</label>
                <textarea 
                  id="useCase" 
                  name="useCase" 
                  required 
                  placeholder="Tell us about your community and what services you'd like to connect..."
                  value={formData.useCase}
                  onChange={handleInputChange}
                ></textarea>
                <small>Help us understand your needs better</small>
              </div>

              <div className="form-group">
                <label htmlFor="timeline">When would you like to start? *</label>
                <select 
                  id="timeline" 
                  name="timeline" 
                  required
                  value={formData.timeline}
                  onChange={handleInputChange}
                >
                  <option value="">Select timeline...</option>
                  <option value="immediately">Immediately</option>
                  <option value="1-2weeks">In 1-2 weeks</option>
                  <option value="1month">In about a month</option>
                  <option value="exploring">Just exploring</option>
                </select>
              </div>

              <button 
                onClick={handleSubmit} 
                className="submit-button"
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}